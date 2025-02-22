import { DataTypes, Model } from 'sequelize';

export enum UserRole {
  ADMIN = 'admin',
  RENTER = 'renter',
  HOST = 'host',
}

/**
 * User Interface
 */
export interface UserAttributes {
  id?: string
  username?: string
  email?: string
  password?: string
  userRole?: string
}

/**
 * Represents a user in the databases.
 */

module.exports = (sequelize:any, DataTypes:any) =>{

  class User extends Model<UserAttributes> implements UserAttributes {
    public id!: string
  
    public username!: string
  
    public email!: string
  
    public password!: string  
  
    public userRole!: string
  
    static associate(models: any) {
      User.hasMany(models.Listing, { foreignKey: 'hostId', as: 'listings' })
      User.hasMany(models.Booking, { foreignKey: 'renterId', as: 'bookings' })
    }
  }
  
  User.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userRole: {
        type: DataTypes.ENUM('admin', 'host', 'renter'),
        defaultValue: 'renter',
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      timestamps: true,
    },
  )
  return User
}
