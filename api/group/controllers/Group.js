'use strict';

/**
 * Group.js controller
 *
 * @description: A set of functions called "actions" for managing `Group`.
 */

module.exports = {

  /**
   * Retrieve group records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.group.search(ctx.query);
    } else {
      return strapi.services.group.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a group record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.group.fetch(ctx.params);
  },

  /**
   * Count group records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.group.count(ctx.query);
  },

  /**
   * Create a/an group record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.group.add(ctx.request.body);
  },

  /**
   * Update a/an group record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.group.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an group record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.group.remove(ctx.params);
  }
};
