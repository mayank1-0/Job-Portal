/* eslint-disable no-unused-vars */
const bcrypt = require("bcrypt");

module.exports = (sequelize, Sequelize) => {
	const UserModel = sequelize.define(
		"Users",
		{
			userID: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			name: {
				type: Sequelize.STRING,
			},
			email: {
				type: Sequelize.STRING,
				validate: {
					isEmail: true,
				},
				unique: true,
			},
			mobile: {
				type: Sequelize.STRING,
				validate: {
					isNumeric: true,
				},
				unique: true,
			},
			age: {
				type: Sequelize.INTEGER,
				validate: {
					//https://sequelize.org/v5/manual/models-definition.html#per-attribute-validations
					isInt: true,
				},
			},
			gender: {
				type: Sequelize.STRING,
			},
			accType: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: "user",
			},
			isAdmin: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			password: {
				type: Sequelize.STRING,
			},
			resetPasswordToken: {
				type: Sequelize.STRING,
			}
		},
		{
			hooks: {
				//any operation we do before a function
				async beforeCreate(user, options) {
					try {
						//function called before creating a table.
						if (user.toJSON().password) {
							const hash = await bcrypt.hash(user.toJSON().password, 10); //converts password into hash or salt.
							user.set("password", hash);
						}
						if (user.toJSON().resetPasswordToken) {
							const hashToken = await bcrypt.hash(user.toJSON().resetPasswordToken, 10); //converts password into hash or salt.
							user.set("resetPasswordToken", hashToken);
						}
						return;
					}
					catch (err) {
						throw new Error();
					}
				},
				async beforeUpdate(user, options) {
					//function called before updating a table.
					try {
						//function called before creating a table.
						if (user.toJSON().password) {
							const hash = await bcrypt.hash(user.toJSON().password, 10); //converts password into hash or salt.
							user.set("password", hash);
						}
						if (user.toJSON().resetPasswordToken) {
							const hashToken = await bcrypt.hash(user.toJSON().resetPasswordToken, 10); //converts password into hash or salt.
							user.set("resetPasswordToken", hashToken);
						}
						return;
					}
					catch (err) {
						throw new Error();
					}
				},
			},
		},
	);

	return UserModel;
};
