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
          msg: 'Please provide the genre type.',
        },
        notEmpty: {
          args: [true],
          msg: 'The genre type must not be blank.',
        },
      },
    },
  };

  return sequelize.define('Genre', schema);
};
