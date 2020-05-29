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

    describe('GET /books/:id', () => {
      it('gets a book by id', async () => {
        const book = books[0];
        const response = await request(app).get(`/books/${book.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal(book.title);
        expect(response.body.author).to.equal(book.author);
        expect(response.body.genre).to.equal(book.genre);
        expect(response.body.isbn).to.equal(book.isbn);
      });

      it('returns a 404 error if the book does not exist', async () => {
        const response = await request(app).get('/books/9999');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });

    describe('PATCH /books/:id', () => {
      it('updates books title by id', async () => {
        const book = books[0];
        const response = await request(app)
          .patch(`/books/${book.id}`)
          .send({ title: 'The 1st Book' });
        const updatedBookRecord = await Book.findByPk(book.id, { raw: true });

        expect(response.status).to.equal(200);
        expect(updatedBookRecord.title).to.equal('The 1st Book');
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app)
          .patch('/books/9999')
          .send({ title: 'The 1st Book' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });

    describe('DELETE /books/:id', () => {
      it('deletes a book by id', async () => {
        const book = books[0];
        const response = await request(app).delete(`/books/${book.id}`);
        const deletedBook = await Book.findByPk(book.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedBook).to.equal(null);
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app).delete('/books/9999');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });
  });
});
