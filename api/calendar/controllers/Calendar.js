'use strict';

/**
 * Calendar.js controller
 *
 * @description: A set of functions called "actions" for managing `Calendar`.
 */

module.exports = {

  /**
   * Retrieve calendar records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.calendar.search(ctx.query);
    } else {
      return strapi.services.calendar.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a calendar record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.calendar.fetch(ctx.params);
  },

  /**
   * Count calendar records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.calendar.count(ctx.query);
  },

  /**
   * Create a/an calendar record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.calendar.add(ctx.request.body);
  },

  /**
   * Update a/an calendar record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.calendar.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an calendar record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.calendar.remove(ctx.params);
  }
};
