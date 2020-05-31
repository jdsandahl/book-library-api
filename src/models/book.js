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
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: [true],
          msg: 'Please provide the author name.',
        },
        notEmpty: {
          args: [true],
          msg: 'The author name must not be blank.',
        },
      },
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
