const { expect } = require('chai');
const request = require('supertest');
const { Genre } = require('../src/models');
const app = require('../src/app');

describe('/genres', () => {
  before(async () => {
    await Genre.sequelize.sync();
    await Genre.destroy({ where: {} });
  });

  describe('with no genres in the database', () => {
    describe('POST /genres', () => {
      it('creates a new genre in the database', async () => {
        const response = await request(app).post('/genres').send({
          type: 'Fantasy',
        });
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.type).to.equal('Fantasy');
        expect(newGenreRecord.type).to.equal('Fantasy');
      });

      it('sends a 400 error if genre is empty', async () => {
        const response = await request(app).post('/genres').send({
          type: '',
        });
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(newGenreRecord).to.equal(null);
      });

      it('sends a 400 error if genre is not provided', async () => {
        const response = await request(app).post('/genres').send({});
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(newGenreRecord).to.equal(null);
      });

      it('sends a 400 error if genre is not unique', async () => {
        const response = await request(app).post('/genres').send({
          type: 'Fantasy',
        });
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(newGenreRecord).to.equal(null);
      });
    });

    describe('with genres in the database', () => {
      let genres;

      beforeEach(async () => {
        await Genre.destroy({ where: {} });

        genres = await Promise.all([
          Genre.create({
            type: 'Science Fiction',
          }),
          Genre.create({
            type: 'Fantasy',
          }),
          Genre.create({
            type: 'Travel',
          }),
        ]);
      });

      describe('GET /genres', () => {
        it('gets all available genres in the database', async () => {
          const response = await request(app).get('/genres');

          expect(response.status).to.equal(200);
          expect(response.body.length).to.equal(3);

          response.body.forEach((genre) => {
            const expected = genres.find((all) => all.id === genre.id);

            expect(genre.type).to.equal(expected.type);
          });
        });
      });

      describe('GET /genres/:id', () => {
        it('gets a genre by id', async () => {
          const genre = genres[0];
          const response = await request(app).get(`/genres/${genre.id}`);

          expect(response.status).to.equal(200);
          expect(response.body.type).to.equal(genre.type);
        });

        it('returns a 404 error if the book does not exist', async () => {
          const response = await request(app).get('/genres/9999');

          expect(response.status).to.equal(404);
          expect(response.body.error).to.equal('The genre could not be found.');
        });
      });

      describe('PATCH /genres/:id', () => {
        it('updates genre by id', async () => {
          const genre = genres[0];
          const response = await request(app)
            .patch(`/genres/${genre.id}`)
            .send({ type: 'Adventure' });

          const updatedGenreRecord = await Genre.findByPk(genre.id, {
            raw: true,
          });

          expect(response.status).to.equal(200);
          expect(updatedGenreRecord.type).to.equal('Adventure');
        });

        it('returns 404 if the genre does not exist', async () => {
          const response = await request(app)
            .patch('/genres/9999')
            .send({ type: 'Adventure' });

          expect(response.status).to.equal(404);
          expect(response.body.error).to.equal('The genre could not be found.');
        });

        it('sends a 400 error if genre is not unique', async () => {
          const genre = genres[0];
          const response = await request(app)
            .patch(`/genres/${genre.id}`)
            .send({
              type: 'Fantasy',
            });

          expect(response.status).to.equal(400);
          expect(response.body.errors.length).to.equal(1);
          expect(genre.type).to.equal('Science Fiction');
        });
      });

      describe('DELETE /genres/:id', () => {
        it('deletes a genre by id', async () => {
          const genre = genres[0];
          const response = await request(app).delete(`/genres/${genre.id}`);
          const deletedGenre = await Genre.findByPk(genre.id, { raw: true });

          expect(response.status).to.equal(204);
          expect(deletedGenre).to.equal(null);
        });

        it('returns a 404 if the genre does not exist', async () => {
          const response = await request(app).delete('/genres/9999');
          expect(response.status).to.equal(404);
          expect(response.body.error).to.equal('The genre could not be found.');
        });
      });
    });
  });
});
