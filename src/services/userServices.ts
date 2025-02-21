import {db} from '../database/models'
export const getUserByEmail = async (email: string) =>
  db.User.findOne({ where: { email } })

export const getUserById = async (id: string) => {
  const user = await db.User.findOne({ where: { id } })
  return user
}

export const getUserByUsername = async (username: string) =>
  db.User.findAll({ where: { username } })

export const createUser = async (details: object) => db.User.create(details)

export const getUserByRole = (userRole: string) =>
  db.User.findAll({ where: { userRole } })

export const deleteUserById = (id: string) => db.User.destroy({ where: { id } })

export const updateUserById = (fieldsToUpdate: object, id: number) =>
  db.User.update(fieldsToUpdate, { where: { id } })

export const getUsersCount = async () => {

  const users = await db.User.findAll({
      attributes: { exclude: ['password'] },    
  })
  return users.length
}
