import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}
  // select * from products where id in (1, 2, 3)
  async create(createOrderDto: CreateOrderDto) {
    const productIDs = createOrderDto.items.map((item) => item.product_id);
    const uniqueProductIDs = [...new Set(productIDs)];
    const products = await this.productRepo.findBy({
      id: In(uniqueProductIDs),
    });

    if (products.length !== uniqueProductIDs.length) {
      throw new Error(
        `Algum produto não existe. Produtos passados ${productIDs}, produtos encontrados ${products.map(
          (product) => product.id,
        )}`,
      );
    }
    const order = Order.create({
      client_id: 1,
      items: createOrderDto.items.map((item) => {
        const product = products.find(
          (product) => product.id === item.product_id,
        );
        return {
          price: product.price,
          product_id: item.product_id,
          quantity: item.quantity,
        };
      }),
    });
    await this.orderRepo.save(order);
    return order;
  }

  findAll() {
    return this.orderRepo.find();
  }

  findOne(id: string) {
    return this.orderRepo.findOne({
      where: { id },
    });
  }
}
