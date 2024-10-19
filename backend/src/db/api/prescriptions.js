const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class PrescriptionsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const prescriptions = await db.prescriptions.create(
      {
        id: data.id || undefined,

        issued_date: data.issued_date || null,
        medication_details: data.medication_details || null,
        status: data.status || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await prescriptions.setPatient(data.patient || null, {
      transaction,
    });

    await prescriptions.setDoctor(data.doctor || null, {
      transaction,
    });

    await prescriptions.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    return prescriptions;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const prescriptionsData = data.map((item, index) => ({
      id: item.id || undefined,

      issued_date: item.issued_date || null,
      medication_details: item.medication_details || null,
      status: item.status || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const prescriptions = await db.prescriptions.bulkCreate(prescriptionsData, {
      transaction,
    });

    // For each item created, replace relation files

    return prescriptions;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const prescriptions = await db.prescriptions.findByPk(
      id,
      {},
      { transaction },
    );

    await prescriptions.update(
      {
        issued_date: data.issued_date || null,
        medication_details: data.medication_details || null,
        status: data.status || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await prescriptions.setPatient(data.patient || null, {
      transaction,
    });

    await prescriptions.setDoctor(data.doctor || null, {
      transaction,
    });

    await prescriptions.setOrganization(
      (globalAccess ? data.organization : currentUser.organization.id) || null,
      {
        transaction,
      },
    );

    return prescriptions;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const prescriptions = await db.prescriptions.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of prescriptions) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of prescriptions) {
        await record.destroy({ transaction });
      }
    });

    return prescriptions;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const prescriptions = await db.prescriptions.findByPk(id, options);

    await prescriptions.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await prescriptions.destroy({
      transaction,
    });

    return prescriptions;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const prescriptions = await db.prescriptions.findOne(
      { where },
      { transaction },
    );

    if (!prescriptions) {
      return prescriptions;
    }

    const output = prescriptions.get({ plain: true });

    output.patient = await prescriptions.getPatient({
      transaction,
    });

    output.doctor = await prescriptions.getDoctor({
      transaction,
    });

    output.organization = await prescriptions.getOrganization({
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
        model: db.patients,
        as: 'patient',
      },

      {
        model: db.users,
        as: 'doctor',
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

      if (filter.medication_details) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'prescriptions',
            'medication_details',
            filter.medication_details,
          ),
        };
      }

      if (filter.issued_dateRange) {
        const [start, end] = filter.issued_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            issued_date: {
              ...where.issued_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            issued_date: {
              ...where.issued_date,
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

      if (filter.status) {
        where = {
          ...where,
          status: filter.status,
        };
      }

      if (filter.patient) {
        const listItems = filter.patient.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          patientId: { [Op.or]: listItems },
        };
      }

      if (filter.doctor) {
        const listItems = filter.doctor.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          doctorId: { [Op.or]: listItems },
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
          count: await db.prescriptions.count({
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
      : await db.prescriptions.findAndCountAll({
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
          Utils.ilike('prescriptions', 'medication_details', query),
        ],
      };
    }

    const records = await db.prescriptions.findAll({
      attributes: ['id', 'medication_details'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['medication_details', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.medication_details,
    }));
  }
};
