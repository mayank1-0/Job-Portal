module.exports = (sequelize, Sequelize) => {
  const TimelineModel = sequelize.define("Timelines", {
    applicantID: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    interviewerName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    interviewerID: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    statusCode: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    feedback: {
      type: Sequelize.TEXT,
    },
    logicalAbility: {
      type: Sequelize.INTEGER,
      validate: {
        isInt: true,
      },
    },
    attitude: {
      type: Sequelize.INTEGER,
      validate: {
        isInt: true,
      },
    },
    communication: {
      type: Sequelize.INTEGER,
      validate: {
        isInt: true,
      },
    },
    date: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    scheduledSlot: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isCancelled: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    round: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return TimelineModel;
};
