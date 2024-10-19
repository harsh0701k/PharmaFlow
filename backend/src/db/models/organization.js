const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const organization = sequelize.define(
    'organization',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
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

  organization.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.organization.hasMany(db.users, {
      as: 'users_organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.organization.hasMany(db.appointments, {
      as: 'appointments_organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.organization.hasMany(db.inventories, {
      as: 'inventories_organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.organization.hasMany(db.patients, {
      as: 'patients_organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.organization.hasMany(db.prescriptions, {
      as: 'prescriptions_organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    //end loop

    db.organization.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.organization.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return organization;
};
