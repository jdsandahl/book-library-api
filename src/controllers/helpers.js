const { Book, Reader } = require('../models');

const get404Error = (model) => ({ error: `The ${model} could not be found.` });

const getModel = (model) => {
  const models = {
    book: Book,
    reader: Reader,
  };
  return models[model];
};

// Helper functions to be exported

const getAllItems = (res, model) => {
  const Model = getModel(model);

  Model.findAll().then((items) => {
    res.status(200).json(items);
  });
};

const createItem = (res, model, item) => {
  const Model = getModel(model);

  Model.create(item)
    .then((newItemCreated) => {
      res.status(201).json(newItemCreated);
    })
    .catch((error) => {
      const errorMessages = error.errors.map((e) => e.message);
      res.status(400).json({ errors: errorMessages });
    });
};

const updateItem = (res, model, item, id) => {
  const Model = getModel(model);

  Model.update(item, { where: { id } }).then(([fieldsUpdated]) => {
    if (!fieldsUpdated) {
      res.status(404).json(get404Error(model));
    } else {
      Model.findByPk(id).then((updatedItem) => {
        res.status(200).json(updatedItem);
      });
    }
  });
};

const getItemById = (res, model, id) => {
  const Model = getModel(model);

  Model.findByPk(id).then((item) => {
    if (!item) {
      res.status(404).json(get404Error(model));
    } else {
      res.status(200).json(item);
    }
  });
};

const deleteItem = (res, model, id) => {
  const Model = getModel(model);

  Model.findByPk(id).then((foundItem) => {
    if (!foundItem) {
      res.status(404).json(get404Error(model));
    } else {
      Model.destroy({ where: { id } }).then(() => {
        res.status(204).send();
      });
    }
  });
};

module.exports = {
  getAllItems,
  createItem,
  updateItem,
  getItemById,
  deleteItem,
};
