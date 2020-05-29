/* /src/controllers/book */
const { Book } = require('../models');

const getBooks = (_, res) => {};

const createBooks = (req, res) => {
  const newBook = req.body;

  Book.create(newBook).then((newBookCreated) => {
    res.status(201).json(newBookCreated);
  });
};

const getBookById = (req, res) => {};

const updateBooks = (req, res) => {};

const deleteBooks = (req, res) => {};

module.exports = {
  getBooks,
  createBooks,
  getBookById,
  updateBooks,
  deleteBooks,
};
