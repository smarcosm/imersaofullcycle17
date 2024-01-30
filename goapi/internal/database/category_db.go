package database

import (
	"database/sql"

	"github.com/smarcosm/imersaofullcycle17/goapi/internal/enttity"
)

type CategoryDB struct {
	db *sql.DB
}

func NewCategoryDB(db *sql.DB) *CategoryDB {
	return &CategoryDB{db: db}
}

func (cd *CategoryDB) GetCategories() ([]*enttity.Category, error) {
	rows, err := cd.db.Query("SELECT id, name FROM categories")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var categories []*enttity.Category
	for rows.Next() {
		var category enttity.Category
		if err := rows.Scan(&category.ID, &category.Name); err != nil {
			return nil, err
		}
		categories = append(categories, &category)
	}
	return categories, nil
}
