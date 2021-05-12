const bcrypt = require("bcrypt");

module.exports = (sequelize, Sequelize) => {
  const UserModel = sequelize.define("Users", {
    userID: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true,
      },
      unique: true
    },
    mobile: {
      type: Sequelize.STRING,
      validate: {
        isNumeric: true,
      },
      unique: true
    },
    age: {
      type: Sequelize.INTEGER,
      validate: { //https://sequelize.org/v5/manual/models-definition.html#per-attribute-validations
        isInt: true,
      }
    },
    gender: {
      type: Sequelize.STRING
    },
    accType: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'user',
    },
    isAdmin: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    password: {
      type: Sequelize.STRING
    }
  },
    {
      hooks: {
        beforeCreate(user, options) {
          // console.log(user.toJSON().password);
          if(user.toJSON().password) {
            return bcrypt.hash(user.toJSON().password, 10)
            .then(hash => {
              // console.log(hash);
              // user.toJSON().password = hash;
              user.set('password', hash);
            })
            .catch(err => {
              console.log(err)
              throw new Error();
            });
          }
        },
        beforeUpdate(user, options) {
          // console.log(user.toJSON().password);
          if(user.toJSON().password) {
            return bcrypt.hash(user.toJSON().password, 10)
            .then(hash => {
              // console.log(hash);
              // user.toJSON().password = hash;
              user.set('password', hash);
            })
            .catch(err => {
              console.log(err)
              throw new Error();
            });
          }
        }
      }
    }
  );

  return UserModel;
};