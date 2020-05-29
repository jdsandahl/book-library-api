const { expect } = require('chai');
const request = require('supertest');
const { Book } = require('../src/models');
const app = require('../src/app');

describe('/books', () => {
  before(async () => Book.sequelize.sync());

  describe('with no books in the database', () => {
    describe('POST /books', () => {
      it('creates a new book in the database', async () => {
        const response = await request(app).post('/books').send({
          title: 'Test Book Name',
          author: 'Test author name',
          genre: 'Test genre',
          isbn: 'Test ISBN',
        });
        const newBookRecord = await Book.findByPk(response.body.id, { raw: true });

        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal('Test Book Name');
        expect(newBookRecord.title).to.equal('Test Book Name');
        expect(newBookRecord.author).to.equal('Test author name');
        expect(newBookRecord.genre).to.equal('Test genre');
        expect(newBookRecord.isbn).to.equal('Test ISBN');
      });
    });
  });
});
