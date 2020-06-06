/* src/model/book */
module.exports = (sequelize, DataTypes) => {
  const schema = {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: [true],
          msg: 'Please provide a book title.',
        },
        notEmpty: {
          args: [true],
          msg: 'The book title must not be blank.',
        },
      },
    },
    isbn: {
      type: DataTypes.STRING,
    },
  };

  return sequelize.define('Book', schema);
};
