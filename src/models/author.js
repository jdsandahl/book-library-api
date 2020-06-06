module.exports = (sequelize, DataTypes) => {
  const schema = {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
  };

  return sequelize.define('Author', schema);
};
