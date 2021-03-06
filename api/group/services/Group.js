/* global Group */
'use strict';

/**
 * Group.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');

// Strapi utilities.
const utils = require('strapi-hook-bookshelf/lib/utils/');

module.exports = {

  /**
   * Promise to fetch all groups.
   *
   * @return {Promise}
   */

  fetchAll: (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('group', params);
    // Select field to populate.
    const populate = Group.associations
        .filter(ast => ast.autoPopulate !== false)
        .map(ast => ast.alias);

    return Group.query(function(qb) {
      _.forEach(filters.where, (where, key) => {
        if (_.isArray(where.value) && where.symbol !== 'IN' && where.symbol !== 'NOT IN') {
          for (const value in where.value) {
            qb[value ? 'where' : 'orWhere'](key, where.symbol, where.value[value])
          }
        } else {
          qb.where(key, where.symbol, where.value);
        }
      });

      if (filters.sort) {
        qb.orderBy(filters.sort.key, filters.sort.order);
      }

      qb.offset(filters.start);
      qb.limit(filters.limit);
    }).fetchAll({
      withRelated: filters.populate || populate
    });
  },
  /**
   * Promise to fetch all groups.
   *
   * @return {Promise}
   */

  fetchAllOfUser: async (params, user_id) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('group', params);
    // Select field to populate.
    const populate = Group.associations
        .filter(ast => ast.autoPopulate !== false)
        .map(ast => ast.alias);

    return await Group.query(function(qb) {
      _.forEach(filters.where, (where, key) => {
        if (_.isArray(where.value) && where.symbol !== 'IN' && where.symbol !== 'NOT IN') {
          for (const value in where.value) {
            qb[value ? 'where' : 'orWhere'](key, where.symbol, where.value[value])
          }
        } else {
          qb.where(key, where.symbol, where.value);
        }
      });

      if (filters.sort) {
        qb.orderBy(filters.sort.key, filters.sort.order);
      }

      qb.offset(filters.start);
      qb.limit(filters.limit);
    }).fetchAll({
      withRelated: filters.populate || populate
    }).then(ret => {
      ret.remove(ret.models.filter((model) => {
        const members = model.relations.members.models;
        return (members.findIndex((member) => {
          return member.attributes.user === user_id;
        })) === -1;
      }));
      return ret;
    });
  },

  /**
   * Promise to fetch a/an group.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    // Select field to populate.
    const populate = Group.associations
        .filter(ast => ast.autoPopulate !== false)
        .map(ast => ast.alias);

    return Group.forge(_.pick(params, 'id')).fetch({
      withRelated: populate
    });
  },

  fetchOfUser: (params, user_id) => {
    // Select field to populate.
    const populate = Group.associations
        .filter(ast => ast.autoPopulate !== false)
        .map(ast => ast.alias);

    return Group.forge(_.pick(params, 'id')).fetch({
      withRelated: populate
    }).then(ret => {
      if (!ret) return null;
      const members = ret.relations.members.models;

      if ((members.findIndex((member) => {
        return member.attributes.user === user_id;
      })) === -1) return null;

      return ret;

    });

  },

  /**
   * Promise to count a/an group.
   *
   * @return {Promise}
   */

  countOfUser: (params, user_id) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('group', params);

    const populate = Group.associations
        .filter(ast => ast.autoPopulate !== false)
        .map(ast => ast.alias);

    return Group.query(function(qb) {
      _.forEach(filters.where, (where, key) => {
        if (_.isArray(where.value)) {
          for (const value in where.value) {
            qb[value ? 'where' : 'orWhere'](key, where.symbol, where.value[value]);
          }
        } else {
          qb.where(key, where.symbol, where.value);
        }
      });
    }).fetchAll({
      withRelated: populate
    }).then(ret => {
      ret.remove(ret.models.filter((model) => {
        const members = model.relations.members.models;
        return (members.findIndex((member) => {
          return member.attributes.user === user_id;
        })) === -1;
      }));

      return ret.length;
    });
  },

  /**
   * Promise to count a/an group.
   *
   * @return {Promise}
   */

  count: (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('group', params);

    return Group.query(function(qb) {
      _.forEach(filters.where, (where, key) => {
        if (_.isArray(where.value)) {
          for (const value in where.value) {
            qb[value ? 'where' : 'orWhere'](key, where.symbol, where.value[value]);
          }
        } else {
          qb.where(key, where.symbol, where.value);
        }
      });
    }).count();
  },

  /**
   * Promise to add a/an group.
   *
   * @return {Promise}
   */

  add: async (values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Group.associations.map(ast => ast.alias));
    const data = _.omit(values, Group.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = await Group.forge(data).save();

    // Create relational data and return the entry.
    return Group.updateRelations({ id: entry.id , values: relations });
  },

  /**
   * Promise to edit a/an group.
   *
   * @return {Promise}
   */

  editOfUser: async (params, values, user_id) => {

    const populate = Group.associations
        .filter(ast => ast.autoPopulate !== false)
        .map(ast => ast.alias);

    const group = await Group.forge(_.pick(params, 'id')).fetch({
      withRelated: populate
    }).then(ret => {
      if (!ret) return null;
      const members = ret.relations.members.models;

      if ((members.findIndex((member) => {
        return member.attributes.user === user_id && member.attributes.role === 'admin';
      })) === -1) return null;

      return ret;

    });

    if (group === null) return null;

    // Extract values related to relational data.
    const relations = _.pick(values, Group.associations.map(ast => ast.alias));
    const data = _.omit(values, Group.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = Group.forge(params).save(data);

    // Create relational data and return the entry.
    return Group.updateRelations(Object.assign(params, { values: relations }));
  },

  /**
   * Promise to edit a/an group.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Group.associations.map(ast => ast.alias));
    const data = _.omit(values, Group.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = Group.forge(params).save(data);

    // Create relational data and return the entry.
    return Group.updateRelations(Object.assign(params, { values: relations }));
  },

  /**
   * Promise to remove a/an group.
   *
   * @return {Promise}
   */

  removeOfUser: async (params, user_id) => {

    const populate = Group.associations
        .filter(ast => ast.autoPopulate !== false)
        .map(ast => ast.alias);

    const group = await Group.forge(_.pick(params, 'id')).fetch({
      withRelated: populate
    }).then(ret => {
      if (!ret) return null;
      const members = ret.relations.members.models;

      if ((members.findIndex((member) => {
        return member.attributes.user === user_id && member.attributes.role === 'admin';
      })) === -1) return null;

      return ret;

    });

    if (group === null) return null;

    for (const group_member of group.relations.members.models) {
      await strapi.services.groupmember.remove({id: group_member.id});
    }

    params.values = {};
    Group.associations.map(association => {
      switch (association.nature) {
        case 'oneWay':
        case 'oneToOne':
        case 'manyToOne':
        case 'oneToManyMorph':
          params.values[association.alias] = null;
          break;
        case 'oneToMany':
        case 'manyToMany':
        case 'manyToManyMorph':
          params.values[association.alias] = [];
          break;
        default:
      }
    });

    await Group.updateRelations(params);

    return Group.forge(params).destroy();
  },

  /**
   * Promise to remove a/an group.
   *
   * @return {Promise}
   */

  remove: async (params) => {
    params.values = {};
    Group.associations.map(association => {
      switch (association.nature) {
        case 'oneWay':
        case 'oneToOne':
        case 'manyToOne':
        case 'oneToManyMorph':
          params.values[association.alias] = null;
          break;
        case 'oneToMany':
        case 'manyToMany':
        case 'manyToManyMorph':
          params.values[association.alias] = [];
          break;
        default:
      }
    });

    await Group.updateRelations(params);

    return Group.forge(params).destroy();
  },

  /**
   * Promise to search a/an group.
   *
   * @return {Promise}
   */

  search: async (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('group', params);
    // Select field to populate.
    const populate = Group.associations
        .filter(ast => ast.autoPopulate !== false)
        .map(ast => ast.alias);

    const associations = Group.associations.map(x => x.alias);
    const searchText = Object.keys(Group._attributes)
        .filter(attribute => attribute !== Group.primaryKey && !associations.includes(attribute))
        .filter(attribute => ['string', 'text'].includes(Group._attributes[attribute].type));

    const searchNoText = Object.keys(Group._attributes)
        .filter(attribute => attribute !== Group.primaryKey && !associations.includes(attribute))
        .filter(attribute => !['string', 'text', 'boolean', 'integer', 'decimal', 'float'].includes(Group._attributes[attribute].type));

    const searchInt = Object.keys(Group._attributes)
        .filter(attribute => attribute !== Group.primaryKey && !associations.includes(attribute))
        .filter(attribute => ['integer', 'decimal', 'float'].includes(Group._attributes[attribute].type));

    const searchBool = Object.keys(Group._attributes)
        .filter(attribute => attribute !== Group.primaryKey && !associations.includes(attribute))
        .filter(attribute => ['boolean'].includes(Group._attributes[attribute].type));

    const query = (params._q || '').replace(/[^a-zA-Z0-9.-\s]+/g, '');

    return Group.query(qb => {
      // Search in columns which are not text value.
      searchNoText.forEach(attribute => {
        qb.orWhereRaw(`LOWER(${attribute}) LIKE '%${_.toLower(query)}%'`);
      });

      if (!_.isNaN(_.toNumber(query))) {
        searchInt.forEach(attribute => {
          qb.orWhereRaw(`${attribute} = ${_.toNumber(query)}`);
        });
      }

      if (query === 'true' || query === 'false') {
        searchBool.forEach(attribute => {
          qb.orWhereRaw(`${attribute} = ${_.toNumber(query === 'true')}`);
        });
      }

      // Search in columns with text using index.
      switch (Group.client) {
        case 'mysql':
          qb.orWhereRaw(`MATCH(${searchText.join(',')}) AGAINST(? IN BOOLEAN MODE)`, `*${query}*`);
          break;
        case 'pg': {
          const searchQuery = searchText.map(attribute =>
              _.toLower(attribute) === attribute
                  ? `to_tsvector(${attribute})`
                  : `to_tsvector('${attribute}')`
          );

          qb.orWhereRaw(`${searchQuery.join(' || ')} @@ to_tsquery(?)`, query);
          break;
        }
      }

      if (filters.sort) {
        qb.orderBy(filters.sort.key, filters.sort.order);
      }

      if (filters.skip) {
        qb.offset(_.toNumber(filters.skip));
      }

      if (filters.limit) {
        qb.limit(_.toNumber(filters.limit));
      }
    }).fetchAll({
      width: populate
    });
  },

  /**
   * Promise to search a/an group.
   *
   * @return {Promise}
   */

  searchOfUser: async (params, user_id) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('group', params);
    // Select field to populate.
    const populate = Group.associations
        .filter(ast => ast.autoPopulate !== false)
        .map(ast => ast.alias);

    const associations = Group.associations.map(x => x.alias);
    const searchText = Object.keys(Group._attributes)
        .filter(attribute => attribute !== Group.primaryKey && !associations.includes(attribute))
        .filter(attribute => ['string', 'text'].includes(Group._attributes[attribute].type));

    const searchNoText = Object.keys(Group._attributes)
        .filter(attribute => attribute !== Group.primaryKey && !associations.includes(attribute))
        .filter(attribute => !['string', 'text', 'boolean', 'integer', 'decimal', 'float'].includes(Group._attributes[attribute].type));

    const searchInt = Object.keys(Group._attributes)
        .filter(attribute => attribute !== Group.primaryKey && !associations.includes(attribute))
        .filter(attribute => ['integer', 'decimal', 'float'].includes(Group._attributes[attribute].type));

    const searchBool = Object.keys(Group._attributes)
        .filter(attribute => attribute !== Group.primaryKey && !associations.includes(attribute))
        .filter(attribute => ['boolean'].includes(Group._attributes[attribute].type));

    const query = (params._q || '').replace(/[^a-zA-Z0-9.-\s]+/g, '');

    return Group.query(qb => {
      // Search in columns which are not text value.
      searchNoText.forEach(attribute => {
        qb.orWhereRaw(`LOWER(${attribute}) LIKE '%${_.toLower(query)}%'`);
      });

      if (!_.isNaN(_.toNumber(query))) {
        searchInt.forEach(attribute => {
          qb.orWhereRaw(`${attribute} = ${_.toNumber(query)}`);
        });
      }

      if (query === 'true' || query === 'false') {
        searchBool.forEach(attribute => {
          qb.orWhereRaw(`${attribute} = ${_.toNumber(query === 'true')}`);
        });
      }

      // Search in columns with text using index.
      switch (Group.client) {
        case 'mysql':
          qb.orWhereRaw(`MATCH(${searchText.join(',')}) AGAINST(? IN BOOLEAN MODE)`, `*${query}*`);
          break;
        case 'pg': {
          const searchQuery = searchText.map(attribute =>
              _.toLower(attribute) === attribute
                  ? `to_tsvector(${attribute})`
                  : `to_tsvector('${attribute}')`
          );

          qb.orWhereRaw(`${searchQuery.join(' || ')} @@ to_tsquery(?)`, query);
          break;
        }
      }

      if (filters.sort) {
        qb.orderBy(filters.sort.key, filters.sort.order);
      }

      if (filters.skip) {
        qb.offset(_.toNumber(filters.skip));
      }

      if (filters.limit) {
        qb.limit(_.toNumber(filters.limit));
      }
    }).fetchAll({
      width: populate
    }).then(ret => {
      ret.remove(ret.models.filter((model) => {
        const members = model.relations.members.models;
        return (members.findIndex((member) => {
          return member.attributes.user === user_id;
        })) === -1;
      }));
      return ret;
    });
  }
};
