const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class AppointmentsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const appointments = await db.appointments.create(
      {
        id: data.id || undefined,

        appointment_date: data.appointment_date || null,
        location: data.location || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await appointments.setPatient(data.patient || null, {
      transaction,
    });

    await appointments.setDoctor(data.doctor || null, {
      transaction,
    });

    await appointments.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    return appointments;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const appointmentsData = data.map((item, index) => ({
      id: item.id || undefined,

      appointment_date: item.appointment_date || null,
      location: item.location || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const appointments = await db.appointments.bulkCreate(appointmentsData, {
      transaction,
    });

    // For each item created, replace relation files

    return appointments;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const appointments = await db.appointments.findByPk(
      id,
      {},
      { transaction },
    );

    await appointments.update(
      {
        appointment_date: data.appointment_date || null,
        location: data.location || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await appointments.setPatient(data.patient || null, {
      transaction,
    });

    await appointments.setDoctor(data.doctor || null, {
      transaction,
    });

    await appointments.setOrganization(
      (globalAccess ? data.organization : currentUser.organization.id) || null,
      {
        transaction,
      },
    );

    return appointments;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const appointments = await db.appointments.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of appointments) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of appointments) {
        await record.destroy({ transaction });
      }
    });

    return appointments;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const appointments = await db.appointments.findByPk(id, options);

    await appointments.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await appointments.destroy({
      transaction,
    });

    return appointments;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const appointments = await db.appointments.findOne(
      { where },
      { transaction },
    );

    if (!appointments) {
      return appointments;
    }

    const output = appointments.get({ plain: true });

    output.patient = await appointments.getPatient({
      transaction,
    });

    output.doctor = await appointments.getDoctor({
      transaction,
    });

    output.organization = await appointments.getOrganization({
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

      if (filter.location) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('appointments', 'location', filter.location),
        };
      }

      if (filter.calendarStart && filter.calendarEnd) {
        where = {
          ...where,
          [Op.or]: [
            {
              appointment_date: {
                [Op.between]: [filter.calendarStart, filter.calendarEnd],
              },
            },
            {
              appointment_date: {
                [Op.between]: [filter.calendarStart, filter.calendarEnd],
              },
            },
          ],
        };
      }

      if (filter.appointment_dateRange) {
        const [start, end] = filter.appointment_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            appointment_date: {
              ...where.appointment_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            appointment_date: {
              ...where.appointment_date,
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
          count: await db.appointments.count({
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
      : await db.appointments.findAndCountAll({
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
          Utils.ilike('appointments', 'appointment_date', query),
        ],
      };
    }

    const records = await db.appointments.findAll({
      attributes: ['id', 'appointment_date'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['appointment_date', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.appointment_date,
    }));
  }
};
