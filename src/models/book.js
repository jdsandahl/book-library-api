/* src/model/book */
module.exports = (sequelize, DataTypes) => {
  const schema = {
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    genre: DataTypes.STRING,
    isbn: DataTypes.STRING,
  };

  return sequelize.define('Book', schema);
};
