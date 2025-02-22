'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      {
        name: 'Apartment',
        description: 'A self-contained housing unit that occupies part of a building.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'House',
        description: 'A standalone residential building, typically for one family.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Cottage',
        description: 'A small, cozy house, typically in a rural or semi-rural location.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Villa',
        description: 'A luxurious, spacious residence, often with a garden or pool.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Studio',
        description: 'A compact, open-plan apartment, combining living, dining, and sleeping areas.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Penthouse',
        description: 'A high-end apartment on the top floor of a building, often with stunning views.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Hostel',
        description: 'A budget-friendly lodging option, often with shared rooms and amenities.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Bungalow',
        description: 'A single-story home, often with a broad front porch and compact design.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Cabin',
        description: 'A rustic dwelling, usually located in natural settings like forests or mountains.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Tiny Home',
        description: 'A small, efficient living space, often mobile or in compact communities.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {})
  },
}
