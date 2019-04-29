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
      return strapi.services.calendar.searchOfUser(ctx.query, ctx.state.user.id);
    } else {
      return strapi.services.calendar.fetchAllOfUser(ctx.query, ctx.state.user.id);
    }
  },

  /**
   * Retrieve a calendar record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.calendar.fetchOfUser(ctx.params, ctx.state.user.id);
  },

  /**
   * Count calendar records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.calendar.countOfUser(ctx.query, ctx.state.user.id);
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
    return strapi.services.calendar.editOfUser(ctx.params, ctx.request.body, ctx.state.user.id) ;
  },

  /**
   * Destroy a/an calendar record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.calendar.removeOfUser(ctx.params, ctx.state.user.id);
  }
};
