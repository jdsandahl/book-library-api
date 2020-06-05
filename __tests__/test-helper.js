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

const getResponse = async (requestType, route, req) => {
  if (requestType === 'GET')
    return await request(app).get(route).send(req);

  if (requestType === 'POST')
    return await request(app).post(route).send(req);

  if (requestType === 'PATCH')
    return await request(app).patch(route).send(req);

  if (requestType === 'DELETE')
    return await request(app).delete(route).send(req);
};

const sends400Error = async (testObj) => {
  const { model, route, type, EXPECTED_ERRORS, req } = testObj;  
  
  const Model = await getModel(model);
  const response = await getResponse(type, route, req);
  const newRecord = await Model.findByPk(response.body.id, { raw: true });

  expect(response.status).to.equal(400);
  expect(response.body.errors.length).to.equal(EXPECTED_ERRORS);
  expect(newRecord).to.equal(null);
  console.log('400 error', response.body.errors);
};

module.exports = { sends400Error };
