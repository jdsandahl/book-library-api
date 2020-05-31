module.exports = (sequelize, DataTypes) => {
  const schema = {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          args: [true],
          msg: 'Please enter a valid email.',
        },
        notNull: {
          args: [true],
          msg: 'An email must be provided.',
        },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: [true],
          msg: 'Name cannot be empty.',
        },
        notNull: {
          args: [true],
          msg: 'A name must be provided',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isLessThan8Characters(value) {
          if (value.length < 8) {
            throw new Error('The password must be 8, or more characters.');
          }
        },
        notNull: {
          args: [true],
          msg: 'Password must be provided',
        },
      },
    },
  };

  return sequelize.define('Reader', schema);
};
