/* /src/models/genre */
module.exports = (sequelize, DataTypes) => {
  const schema = {
    type: {
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

  return sequelize.define('Genre', schema);
};
