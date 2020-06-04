const { expect } = require('chai');
const request = require('supertest');
const { Genre } = require('../src/models');
const app = require('../src/app');
// const { sends400Error } = require('./test-helper');

describe('/genres', () => {
  before(async () => {
    await Genre.destroy({ where: {} });
    Genre.sequelize.sync();
  });

  describe('with no genres in the database', () => {
    describe('POST /genres', () => {
      it('creates a new genre in the database', async () => {
        const response = await request(app).post('/genres').send({
          genre: 'Fantasy',
        });
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.genre).to.equal('Fantasy');
        expect(newGenreRecord.genre).to.equal('Fantasy');
      });

      // replace 400 error tests with this helper version
      /*
      it('sends 400 error using helper test', async () => {
        const TOTAL_EXPECTED_ERRORS = 1;
        const testGenre = {
          genre: '',
        };

        await sends400Error('genres', TOTAL_EXPECTED_ERRORS, testGenre);
      });
      */

      // refactor
      it('sends a 400 error if genre is empty', async () => {
        const response = await request(app).post('/genres').send({
          genre: '',
        });
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(newGenreRecord).to.equal(null);
      });

      // refactor with helper
      it('sends a 400 error if genre is not provided', async () => {
        const response = await request(app).post('/genres').send({});
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(newGenreRecord).to.equal(null);
      });

      // refactor with helper
      it('sends a 400 error if genre is not unique', async () => {
        const response = await request(app).post('/genres').send({
          genre: 'Fantasy',
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
            genre: 'Science Fiction',
          }),
          Genre.create({
            genre: 'Fantasy',
          }),
          Genre.create({
            genre: 'Travel',
          }),
        ]);
      });

      describe('GET /genre', () => {
        it('gets all available genres in the database', async () => {
          const response = await request(app).get('/genres');

          expect(response.status).to.equal(200);
          expect(response.body.length).to.equal(3);

          response.body.forEach((genre) => {
            const expected = genres.find((all) => all.id === genre.id);

            expect(genre.genre).to.equal(expected.genre);
          });
        });
      });

      describe('GET /genre/:id', () => {
        it('gets a genre by id', async () => {
          const genre = genres[0];
          const response = await request(app).get(`/genres/${genre.id}`);

          expect(response.status).to.equal(200);
          expect(response.body.genre).to.equal(genre.genre);
        });

        it('returns a 404 error if the book does not exist', async () => {
          const response = await request(app).get('/genres/9999');

          expect(response.status).to.equal(404);
          expect(response.body.error).to.equal('The genre could not be found.');
        });
      });
    });
  });
});
