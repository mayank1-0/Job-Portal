module.exports = (sequelize, Sequelize) => {
  const ApplicantModel = sequelize.define("Applicants", {
    applicantID: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      unique: true,
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
    isFresher: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    experience: {
      type: Sequelize.INTEGER,
      validate: {
        // https://sequelize.org/v5/manual/models-definition.html#per-attribute-validations
        isInt: true,
      },
    },
    noticePeriod: {
      type: Sequelize.INTEGER,
      validate: {
        isInt: true,
      },
    },
    skills: {
      type: Sequelize.STRING,
    },
    applicantBio: {
      type: Sequelize.STRING,
    },
    resume: {
      type: Sequelize.TEXT,
      validate: {
        isUrl: true,
      },
    },
    referrerEmployeeID: {
      type: Sequelize.STRING,
    },
    statusCode: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Applied",
    },
    comment: {
      type: Sequelize.TEXT,
    },
    appliedForCode: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    appliedFor: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    country: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return ApplicantModel;
};
