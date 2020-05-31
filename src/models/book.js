/* src/model/book */
module.exports = (sequelize, DataTypes) => {
  const schema = {
    title: {
      type: DataTypes.STRING,
    },
    author: {
      type: DataTypes.STRING,
    },
    genre: {
      type: DataTypes.STRING,
    },
    isbn: {
      type: DataTypes.STRING,
    },
  };

  return sequelize.define('Book', schema);
};
