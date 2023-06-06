module.exports = (sequelize, Sequelize) => {
  const OpeningsModel = sequelize.define("Openings", {
    openingName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    department: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    location: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    skillsRequired: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    responsibilities: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    selectionProcess: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    eligibility: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    package: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return OpeningsModel;
};
