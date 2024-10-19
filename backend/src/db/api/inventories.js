const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class InventoriesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const inventories = await db.inventories.create(
      {
        id: data.id || undefined,

        medicine_name: data.medicine_name || null,
        quantity: data.quantity || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await inventories.setPharmacy(data.pharmacy || null, {
      transaction,
    });

    await inventories.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    return inventories;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const inventoriesData = data.map((item, index) => ({
      id: item.id || undefined,

      medicine_name: item.medicine_name || null,
      quantity: item.quantity || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const inventories = await db.inventories.bulkCreate(inventoriesData, {
      transaction,
    });

    // For each item created, replace relation files

    return inventories;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const inventories = await db.inventories.findByPk(id, {}, { transaction });

    await inventories.update(
      {
        medicine_name: data.medicine_name || null,
        quantity: data.quantity || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await inventories.setPharmacy(data.pharmacy || null, {
      transaction,
    });

    await inventories.setOrganization(
      (globalAccess ? data.organization : currentUser.organization.id) || null,
      {
        transaction,
      },
    );

    return inventories;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const inventories = await db.inventories.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of inventories) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of inventories) {
        await record.destroy({ transaction });
      }
    });

    return inventories;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const inventories = await db.inventories.findByPk(id, options);

    await inventories.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await inventories.destroy({
      transaction,
    });

    return inventories;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const inventories = await db.inventories.findOne(
      { where },
      { transaction },
    );

    if (!inventories) {
      return inventories;
    }

    const output = inventories.get({ plain: true });

    output.pharmacy = await inventories.getPharmacy({
      transaction,
    });

    output.organization = await inventories.getOrganization({
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
        model: db.organizations,
        as: 'pharmacy',
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

      if (filter.medicine_name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'inventories',
            'medicine_name',
            filter.medicine_name,
          ),
        };
      }

      if (filter.quantityRange) {
        const [start, end] = filter.quantityRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            quantity: {
              ...where.quantity,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            quantity: {
              ...where.quantity,
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

      if (filter.pharmacy) {
        const listItems = filter.pharmacy.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          pharmacyId: { [Op.or]: listItems },
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
          count: await db.inventories.count({
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
      : await db.inventories.findAndCountAll({
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
          Utils.ilike('inventories', 'medicine_name', query),
        ],
      };
    }

    const records = await db.inventories.findAll({
      attributes: ['id', 'medicine_name'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['medicine_name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.medicine_name,
    }));
  }
};
