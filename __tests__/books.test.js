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
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal('Test Book Name');
        expect(newBookRecord.title).to.equal('Test Book Name');
        expect(newBookRecord.author).to.equal('Test author name');
        expect(newBookRecord.genre).to.equal('Test genre');
        expect(newBookRecord.isbn).to.equal('Test ISBN');
      });
    });
  });

  describe('with books in the database', () => {
    let books;

    beforeEach(async () => {
      await Book.destroy({ where: {} });

      books = await Promise.all([
        Book.create({
          title: 'The First Book',
          author: 'First Author',
          genre: 'First',
          isbn: '1A-111',
        }),
        Book.create({
          title: 'The Second Book',
          author: 'Second Author',
          genre: 'Second',
          isbn: '2B-222',
        }),
        Book.create({
          title: 'The Third Book',
          author: 'Third Author',
          genre: 'Third',
          isbn: '3C-333',
        }),
      ]);
    });

    describe('GET /books', () => {
      it('gets all book records', async () => {
        const response = await request(app).get('/books');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((book) => {
          const expected = books.find((all) => all.id === book.id);

          expect(book.title).to.equal(expected.title);
          expect(book.author).to.equal(expected.author);
          expect(book.genre).to.equal(expected.genre);
          expect(book.isbn).to.equal(expected.isbn);
        });
      });
    });
  });
});
