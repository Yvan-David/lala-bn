import { DataTypes, Model } from 'sequelize'

export interface ListingAttributes {
  id?: string
  title: string
  phoneNumber: string
  description: string
  price: number
  location: string
  images: string[]
  hostId: string
  categoryId?: number
  booked: boolean
}

module.exports = (sequelize: any) => {
  class Listing extends Model<ListingAttributes> implements ListingAttributes {
    public id!: string
    public title!: string
    public phoneNumber!: string
    public description!: string
    public price!: number
    public location!: string
    public images!: string[]
    public hostId!: string
    public categoryId!: number
    public booked!: boolean

    static associate(models: any) {
      Listing.belongsTo(models.User, { foreignKey: 'hostId', as: 'host' })
      Listing.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' })
      Listing.hasMany(models.Booking, { foreignKey: 'listingId', as: 'bookings' })
    }
  }

  Listing.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: false,
      },
      hostId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      booked: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Listing',
      tableName: 'Listings',
      timestamps: true,
    }
  )

  return Listing
}
