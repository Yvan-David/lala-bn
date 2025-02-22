import { DataTypes, Model } from 'sequelize'

export interface BookingAttributes {
  id?: string
  startDate: Date
  endDate: Date
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled'
  renterId: string
  listingId: string
}

module.exports = (sequelize: any) => {
  class Booking extends Model<BookingAttributes> implements BookingAttributes {
    public id!: string
    public startDate!: Date
    public endDate!: Date
    public totalPrice!: number
    public status!: 'pending' | 'confirmed' | 'cancelled'
    public renterId!: string
    public listingId!: string

    static associate(models: any) {
      // A Booking belongs to a User (renter)
      Booking.belongsTo(models.User, {
        foreignKey: 'renterId',
        as: 'renter',
      })

      // A Booking belongs to a Listing
      Booking.belongsTo(models.Listing, {
        foreignKey: 'listingId',
        as: 'listing',
      })
    }
  }

  Booking.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
        defaultValue: 'pending',
      },
      renterId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      listingId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Booking',
      tableName: 'Bookings',
      timestamps: true,
    }
  )

  return Booking
}
