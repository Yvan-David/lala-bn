import { DataTypes, Model, Optional } from 'sequelize'

export interface CategoryAttributes {
  id?: number
  name: string
  description?: string
}

module.exports = (sequelize: any) => {
  class Category extends Model<CategoryAttributes> implements CategoryAttributes {
    public id!: number
    public name!: string
    public description!: string

    static associate(models: any) {
      // A Category has many Listings
      Category.hasMany(models.Listing, {
        foreignKey: 'categoryId',
        as: 'listings',
      })
    }
  }

  Category.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'Categories',
      timestamps: true,
    }
  )

  return Category
}
