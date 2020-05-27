/* src/model/book */
module.exports = (sequelize, DataTypes) => {
  const schema = {
    title: DataTypes.String,
    author: DataTypes.String,
    genre: DataTypes.String,
    ISBN: DataTypes.String,
  };

  return sequelize.define('Book', schema);
};
