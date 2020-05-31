const { Reader } = require('../models');
const { getAllItems, createItem } = require('./helpers');

const getReaders = (_, res) => getAllItems(res, 'reader');

const createReader = (req, res) => createItem(res, 'reader', req.body);

const updateReader = (req, res) => {
  const { id } = req.params;
  const newDetails = req.body;

  Reader.update(newDetails, { where: { id } }).then(([recordsUpdated]) => {
    if (!recordsUpdated) {
      res.status(404).json({ error: 'The reader could not be found.' });
    } else {
      Reader.findByPk(id).then((updatedReader) => {
        res.status(200).json(updatedReader);
      });
    }
  });
};

const getReaderById = (req, res) => {
  const { id } = req.params;

  Reader.findByPk(id).then((reader) => {
    if (!reader) {
      res.status(404).json({ error: 'The reader could not be found.' });
    } else {
      res.status(200).json(reader);
    }
  });
};

const deleteReader = (req, res) => {
  const { id } = req.params;

  Reader.findByPk(id).then((foundReader) => {
    if (!foundReader) {
      res.status(404).json({ error: 'The reader could not be found.' });
    } else {
      Reader.destroy({ where: { id } }).then(() => {
        res.status(204).send();
      });
    }
  });
};

module.exports = {
  getReaders,
  getReaderById,
  createReader,
  updateReader,
  deleteReader,
};
