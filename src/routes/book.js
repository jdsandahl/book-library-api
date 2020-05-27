/* /src/routes/book */
const express = require('express');

const router = express.Router();
const bookController = require('../controllers/book');

router
  .route('/')
  .get(bookController.getBooks);
  .post(bookController.createBooks);

router
  .route('/:id')
  .get(bookController.getBookById);
  .patch(bookController.getBooks);
  .delete(bookController.createBooks);

module.exports = routers;  


