const { expect } = require('chai');
const request = require('supertest');
const { Author } = require('../src/models');
const app = require('../src/app');

describe('/authors', () => {
  before(async () => {
    await Author.sequelize.sync();
    await Author.destroy({ where: {} });
  });

  describe('with no authors in the database', () => {
    describe('POST /authors', () => {
      it('creates a new author in the database', async () => {
        const response = await request(app).post('/authors').send({
          name: 'J. R. R. Tolkien',
        });
        const newAuthorRecord = await Author.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal('J. R. R. Tolkien');
        expect(newAuthorRecord.name).to.equal('J. R. R. Tolkien');
      });

      it('sends a 400 error if author is empty', async () => {
        const response = await request(app).post('/authors').send({
          name: '',
        });
        const newAuthorRecord = await Author.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(newAuthorRecord).to.equal(null);
      });

      it('sends a 400 error if author is not provided', async () => {
        const response = await request(app).post('/genres').send({});
        const newAuthorRecord = await Author.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(newAuthorRecord).to.equal(null);
      });

      it('sends a 400 error if author is not unique', async () => {
        const response = await request(app).post('/genres').send({
          name: 'J. R. R. Tolkien',
        });
        const newAuthorRecord = await Author.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(newAuthorRecord).to.equal(null);
      });
    });

    describe('with authors in the database', () => {
      let authors;

      beforeEach(async () => {
        await Author.destroy({ where: {} });

        authors = await Promise.all([
          Author.create({
            name: 'J. R. R. Tolkien',
          }),
          Author.create({
            name: 'George R. R. Martin',
          }),
          Author.create({
            name: 'Bram Stoker',
          }),
        ]);
      });

      describe('GET /authors', () => {
        it('gets all available authors in the database', async () => {
          const response = await request(app).get('/authors');

          expect(response.status).to.equal(200);
          expect(response.body.length).to.equal(3);

          response.body.forEach((author) => {
            const expected = authors.find((all) => all.id === author.id);

            expect(author.name).to.equal(expected.name);
          });
        });
      });

      describe('GET /authors/:id', () => {
        it('gets a author by id', async () => {
          const author = authors[0];
          const response = await request(app).get(`/authors/${author.id}`);

          expect(response.status).to.equal(200);
          expect(response.body.name).to.equal(author.name);
        });

        it('returns a 404 error if the author does not exist', async () => {
          const response = await request(app).get('/authors/9999');

          expect(response.status).to.equal(404);
          expect(response.body.error).to.equal('The author could not be found.');
        });
      });

      describe('PATCH /authors/:id', () => {
        it('updates author by id', async () => {
          const author = authors[0];
          const response = await request(app)
            .patch(`/authors/${author.id}`)
            .send({ name: 'J. K. Rowling' });

          const updatedAuthorRecord = await Author.findByPk(author.id, {
            raw: true,
          });

          expect(response.status).to.equal(200);
          expect(updatedAuthorRecord.name).to.equal('J. K. Rowling');
        });

        it('returns 404 if the author does not exist', async () => {
          const response = await request(app)
            .patch('/authors/9999')
            .send({ name: 'J. K. Rowling' });

          expect(response.status).to.equal(404);
          expect(response.body.error).to.equal('The author could not be found.');
        });

        it('sends a 400 error if author is not unique', async () => {
          const author = authors[0];
          const response = await request(app)
            .patch(`/authors/${author.id}`)
            .send({
              name: 'Bram Stoker',
            });

          expect(response.status).to.equal(400);
          expect(response.body.errors.length).to.equal(1);
          expect(author.name).to.equal('J. R. R. Tolkien');
        });
      });

      describe('DELETE /authors/:id', () => {
        it('deletes a author by id', async () => {
          const author = authors[0];
          const response = await request(app).delete(`/authors/${author.id}`);
          const deletedAuthor = await Author.findByPk(author.id, { raw: true });

          expect(response.status).to.equal(204);
          expect(deletedAuthor).to.equal(null);
        });

        it('returns a 404 if the author does not exist', async () => {
          const response = await request(app).delete('/authors/9999');
          expect(response.status).to.equal(404);
          expect(response.body.error).to.equal('The author could not be found.');
        });
      });
    });
  });
});
