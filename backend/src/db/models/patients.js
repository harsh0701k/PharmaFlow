const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const patients = sequelize.define(
    'patients',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      first_name: {
        type: DataTypes.TEXT,
      },

      last_name: {
        type: DataTypes.TEXT,
      },

      date_of_birth: {
        type: DataTypes.DATE,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  patients.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.patients.hasMany(db.appointments, {
      as: 'appointments_patient',
      foreignKey: {
        name: 'patientId',
      },
      constraints: false,
    });

    db.patients.hasMany(db.prescriptions, {
      as: 'prescriptions_patient',
      foreignKey: {
        name: 'patientId',
      },
      constraints: false,
    });

    //end loop

    db.patients.belongsTo(db.users, {
      as: 'user',
      foreignKey: {
        name: 'userId',
      },
      constraints: false,
    });

    db.patients.belongsTo(db.organization, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.patients.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.patients.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return patients;
};
