/* /src/controllers/book */
const {
  getAllItems,
  createItem,
  updateItem,
  getItemById,
  deleteItem,
} = require('./helpers');

const getBooks = (_, res) => getAllItems(res, 'book');

const createBooks = (req, res) => createItem(res, 'book', req.body);

const getBookById = (req, res) => getItemById(res, 'book', req.params.id);

const updateBooks = (req, res) => updateItem(res, 'book', req.body, req.params.id);

const deleteBooks = (req, res) => deleteItem(res, 'book', req.params.id);

module.exports = {
  getBooks,
  createBooks,
  getBookById,
  updateBooks,
  deleteBooks,
};
