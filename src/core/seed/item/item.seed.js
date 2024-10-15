const { faker } = require('@faker-js/faker');
const _ = require('lodash');
const itemService = require('../../services/item.service');

const randomItemData = () => {
  return {
    code: faker.person.fullName(),
    name: faker.commerce.productName(),
    attributes: _.times(_.random(1, 5), () => ({
      k: faker.commerce.productMaterial(),
      name: faker.commerce.productName(),
      v: faker.commerce.productMaterial(),
    })),
  };
};

const seedData = async () => {
  const data = randomItemData();
  await itemService.addNewItem(data);
};

module.exports = {
  randomItemData,
  seedData,
};
