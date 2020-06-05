const { expect } = require('chai');
const request = require('supertest');
const { Book, Genre, Reader } = require('../src/models');
const app = require('../src/app');

const getModel = (model) => {
  const models = {
    book: Book,
    reader: Reader,
    genre: Genre,
  };
  return models[model];
};

const sends400Error = async (model, route, TOTAL_EXPECTED_ERRORS, testCase) => {
  const Model = await getModel(model);
  const response = await request(app).post(route).send(testCase);
  const newRecord = await Model.findByPk(response.body.id, { raw: true });

  expect(response.status).to.equal(400);
  expect(response.body.errors.length).to.equal(TOTAL_EXPECTED_ERRORS);
  expect(newRecord).to.equal(null);
  console.log('400 error', response.body.errors);
};

module.exports = { sends400Error };
