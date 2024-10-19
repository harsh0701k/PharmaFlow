const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class PatientsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const patients = await db.patients.create(
      {
        id: data.id || undefined,

        first_name: data.first_name || null,
        last_name: data.last_name || null,
        date_of_birth: data.date_of_birth || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await patients.setUser(data.user || null, {
      transaction,
    });

    await patients.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    return patients;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const patientsData = data.map((item, index) => ({
      id: item.id || undefined,

      first_name: item.first_name || null,
      last_name: item.last_name || null,
      date_of_birth: item.date_of_birth || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const patients = await db.patients.bulkCreate(patientsData, {
      transaction,
    });

    // For each item created, replace relation files

    return patients;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const patients = await db.patients.findByPk(id, {}, { transaction });

    await patients.update(
      {
        first_name: data.first_name || null,
        last_name: data.last_name || null,
        date_of_birth: data.date_of_birth || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await patients.setUser(data.user || null, {
      transaction,
    });

    await patients.setOrganization(
      (globalAccess ? data.organization : currentUser.organization.id) || null,
      {
        transaction,
      },
    );

    return patients;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const patients = await db.patients.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of patients) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of patients) {
        await record.destroy({ transaction });
      }
    });

    return patients;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const patients = await db.patients.findByPk(id, options);

    await patients.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await patients.destroy({
      transaction,
    });

    return patients;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const patients = await db.patients.findOne({ where }, { transaction });

    if (!patients) {
      return patients;
    }

    const output = patients.get({ plain: true });

    output.appointments_patient = await patients.getAppointments_patient({
      transaction,
    });

    output.prescriptions_patient = await patients.getPrescriptions_patient({
      transaction,
    });

    output.user = await patients.getUser({
      transaction,
    });

    output.organization = await patients.getOrganization({
      transaction,
    });

    return output;
  }

  static async findAll(filter, globalAccess, options) {
    const limit = filter.limit || 0;
    let offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    const orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.users,
        as: 'user',
      },

      {
        model: db.organization,
        as: 'organization',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.first_name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('patients', 'first_name', filter.first_name),
        };
      }

      if (filter.last_name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('patients', 'last_name', filter.last_name),
        };
      }

      if (filter.date_of_birthRange) {
        const [start, end] = filter.date_of_birthRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            date_of_birth: {
              ...where.date_of_birth,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            date_of_birth: {
              ...where.date_of_birth,
              [Op.lte]: end,
            },
          };
        }
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.user) {
        const listItems = filter.user.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          userId: { [Op.or]: listItems },
        };
      }

      if (filter.organization) {
        const listItems = filter.organization.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          organizationId: { [Op.or]: listItems },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = options?.countOnly
      ? {
          rows: [],
          count: await db.patients.count({
            where: globalAccess ? {} : where,
            include,
            distinct: true,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order:
              filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction,
          }),
        }
      : await db.patients.findAndCountAll({
          where: globalAccess ? {} : where,
          include,
          distinct: true,
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
          order:
            filter.field && filter.sort
              ? [[filter.field, filter.sort]]
              : [['createdAt', 'desc']],
          transaction,
        });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit, globalAccess, organizationId) {
    let where = {};

    if (!globalAccess && organizationId) {
      where.organizationId = organizationId;
    }

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('patients', 'first_name', query),
        ],
      };
    }

    const records = await db.patients.findAll({
      attributes: ['id', 'first_name'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['first_name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.first_name,
    }));
  }
};
