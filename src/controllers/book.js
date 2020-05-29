/* /src/controllers/book */
const { Book } = require('../models');

const getBooks = (_, res) => {
  Book.findAll().then((books) => {
    res.status(200).json(books);
  });
};

const createBooks = (req, res) => {
  const newBook = req.body;

  Book.create(newBook).then((newBookCreated) => {
    res.status(201).json(newBookCreated);
  });
};

const getBookById = (req, res) => {
  const { id } = req.params;

  Book.findByPk(id).then((book) => {
    if (!book) {
      res.status(404).json({ error: 'The book could not be found.' });
    } else {
      res.status(200).json(book);
    }
  });
};

const updateBooks = (req, res) => {
  const { id } = req.params;
  const newDetails = req.body;

  Book.update(newDetails, { where: { id } }).then(([updatedDetails]) => {
    if (!updatedDetails) {
      res.status(404).json({ error: 'The book could not be found.' });
    } else {
      Book.findByPk(id).then((updatedBook) => {
        res.status(200).json(updatedBook);
      });
    }
  });
};

const deleteBooks = (req, res) => {};

module.exports = {
  getBooks,
  createBooks,
  getBookById,
  updateBooks,
  deleteBooks,
};
