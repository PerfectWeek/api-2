/* global Event */
'use strict';

/**
 * Event.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');

// Strapi utilities.
const utils = require('strapi-hook-bookshelf/lib/utils/');

module.exports = {

  /**
   * Promise to fetch all events.
   *
   * @return {Promise}
   */

  fetchAllOfUser: (params, user_id) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('event', params);
    // Select field to populate.
    const populate = Event.associations
        .filter(ast => ast.autoPopulate !== false)
        .map(ast => ast.alias);

    return Event.query(function(qb) {
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
        const attendees = model.relations.attendees.models;
        return (attendees.findIndex((attendee) => {
          return attendee.attributes.user === user_id;
        })) === -1;
      }));
      return ret;
    });
  },

  /**
   * Promise to fetch all events.
   *
   * @return {Promise}
   */

  fetchAll: (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('event', params);
    // Select field to populate.
    const populate = Event.associations
        .filter(ast => ast.autoPopulate !== false)
        .map(ast => ast.alias);

    return Event.query(function(qb) {
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
   * Promise to fetch a/an event.
   *
   * @return {Promise}
   */

  fetchOfUser: (params, user_id) => {
    // Select field to populate.
    const populate = Event.associations
        .filter(ast => ast.autoPopulate !== false)
        .map(ast => ast.alias);

    return Event.forge(_.pick(params, 'id')).fetch({
      withRelated: populate
    }).then(ret => {
      if (!ret) return null;
      const attendees = ret.relations.attendees.models;

      if ((attendees.findIndex((attendee) => {
        return attendee.attributes.user === user_id;
      })) === -1) return null;

      return ret;

    });
  },

  /**
   * Promise to fetch a/an event.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    // Select field to populate.
    const populate = Event.associations
        .filter(ast => ast.autoPopulate !== false)
        .map(ast => ast.alias);

    return Event.forge(_.pick(params, 'id')).fetch({
      withRelated: populate
    });
  },

  /**
   * Promise to count a/an event.
   *
   * @return {Promise}
   */

  countOfUser: (params, user_id) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('event', params);

    const populate = Event.associations
        .filter(ast => ast.autoPopulate !== false)
        .map(ast => ast.alias);

    return Event.query(function(qb) {
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
        const attendees = model.relations.attendees.models;
        return (attendees.findIndex((attendee) => {
          return attendee.attributes.user === user_id;
        })) === -1;
      }));

      return ret.length;
    });
  },

  /**
   * Promise to count a/an event.
   *
   * @return {Promise}
   */

  count: (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('event', params);

    return Event.query(function(qb) {
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
   * Promise to add a/an event.
   *
   * @return {Promise}
   */

  add: async (values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Event.associations.map(ast => ast.alias));
    const data = _.omit(values, Event.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = await Event.forge(data).save();

    // Create relational data and return the entry.
    return Event.updateRelations({ id: entry.id , values: relations });
  },

  /**
   * Promise to edit a/an event.
   *
   * @return {Promise}
   */

  editOfUser: async (params, values, user_id) => {
    // Extract values related to relational data.
    const populate = Event.associations
        .filter(ast => ast.autoPopulate !== false)
        .map(ast => ast.alias);

    const event = await Event.forge(_.pick(params, 'id')).fetch({
      withRelated: populate
    }).then(ret => {
      if (!ret) return null;
      const attendees = ret.relations.attendees.models;

      if ((attendees.findIndex((member) => {
        return member.attributes.user === user_id && member.attributes.status === 'admin';
      })) === -1) return null;

      return ret;

    });

    if (event === null) return null;
    const relations = _.pick(values, Event.associations.map(ast => ast.alias));
    const data = _.omit(values, Event.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = Event.forge(params).save(data);

    // Create relational data and return the entry.
    return Event.updateRelations(Object.assign(params, { values: relations }));
  },

  /**
   * Promise to edit a/an event.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Event.associations.map(ast => ast.alias));
    const data = _.omit(values, Event.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = Event.forge(params).save(data);

    // Create relational data and return the entry.
    return Event.updateRelations(Object.assign(params, { values: relations }));
  },

  /**
   * Promise to remove a/an event.
   *
   * @return {Promise}
   */

  removeOfUser: async (params, user_id) => {
    // Extract values related to relational data.
    const populate = Event.associations
        .filter(ast => ast.autoPopulate !== false)
        .map(ast => ast.alias);

    const event = await Event.forge(_.pick(params, 'id')).fetch({
      withRelated: populate
    }).then(ret => {
      if (!ret) return null;
      const attendees = ret.relations.attendees.models;

      if ((attendees.findIndex((member) => {
        return member.attributes.user === user_id && member.attributes.status === 'admin';
      })) === -1) return null;

      return ret;

    });

    if (event === null) return null;
    params.values = {};
    Event.associations.map(association => {
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

    await Event.updateRelations(params);

    return Event.forge(params).destroy();
  },

  /**
   * Promise to remove a/an event.
   *
   * @return {Promise}
   */

  remove: async (params) => {
    params.values = {};
    Event.associations.map(association => {
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

    await Event.updateRelations(params);

    return Event.forge(params).destroy();
  },

  /**
   * Promise to search a/an event.
   *
   * @return {Promise}
   */

  searchOfUser: async (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('event', params);
    // Select field to populate.
    const populate = Event.associations
        .filter(ast => ast.autoPopulate !== false)
        .map(ast => ast.alias);

    const associations = Event.associations.map(x => x.alias);
    const searchText = Object.keys(Event._attributes)
        .filter(attribute => attribute !== Event.primaryKey && !associations.includes(attribute))
        .filter(attribute => ['string', 'text'].includes(Event._attributes[attribute].type));

    const searchNoText = Object.keys(Event._attributes)
        .filter(attribute => attribute !== Event.primaryKey && !associations.includes(attribute))
        .filter(attribute => !['string', 'text', 'boolean', 'integer', 'decimal', 'float'].includes(Event._attributes[attribute].type));

    const searchInt = Object.keys(Event._attributes)
        .filter(attribute => attribute !== Event.primaryKey && !associations.includes(attribute))
        .filter(attribute => ['integer', 'decimal', 'float'].includes(Event._attributes[attribute].type));

    const searchBool = Object.keys(Event._attributes)
        .filter(attribute => attribute !== Event.primaryKey && !associations.includes(attribute))
        .filter(attribute => ['boolean'].includes(Event._attributes[attribute].type));

    const query = (params._q || '').replace(/[^a-zA-Z0-9.-\s]+/g, '');

    return Event.query(qb => {
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
      switch (Event.client) {
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
   * Promise to search a/an event.
   *
   * @return {Promise}
   */

  search: async (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('event', params);
    // Select field to populate.
    const populate = Event.associations
        .filter(ast => ast.autoPopulate !== false)
        .map(ast => ast.alias);

    const associations = Event.associations.map(x => x.alias);
    const searchText = Object.keys(Event._attributes)
        .filter(attribute => attribute !== Event.primaryKey && !associations.includes(attribute))
        .filter(attribute => ['string', 'text'].includes(Event._attributes[attribute].type));

    const searchNoText = Object.keys(Event._attributes)
        .filter(attribute => attribute !== Event.primaryKey && !associations.includes(attribute))
        .filter(attribute => !['string', 'text', 'boolean', 'integer', 'decimal', 'float'].includes(Event._attributes[attribute].type));

    const searchInt = Object.keys(Event._attributes)
        .filter(attribute => attribute !== Event.primaryKey && !associations.includes(attribute))
        .filter(attribute => ['integer', 'decimal', 'float'].includes(Event._attributes[attribute].type));

    const searchBool = Object.keys(Event._attributes)
        .filter(attribute => attribute !== Event.primaryKey && !associations.includes(attribute))
        .filter(attribute => ['boolean'].includes(Event._attributes[attribute].type));

    const query = (params._q || '').replace(/[^a-zA-Z0-9.-\s]+/g, '');

    return Event.query(qb => {
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
      switch (Event.client) {
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
        const attendees = model.relations.attendees.models;
        return (attendees.findIndex((attendee) => {
          return attendee.attributes.user === user_id;
        })) === -1;
      }));
      return ret;
    });
  }
};
