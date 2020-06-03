const { expect } = require('chai');
const request = require('supertest');
const { Genre } = require('../src/models');
const app = require('../src/app');

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
    });
  });
});
