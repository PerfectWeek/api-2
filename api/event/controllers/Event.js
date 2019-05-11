'use strict';

/**
 * Event.js controller
 *
 * @description: A set of functions called "actions" for managing `Event`.
 */

module.exports = {

  /**
   * Retrieve event records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.event.searchOfUser(ctx.query, ctx.state.user.id);
    } else {
      return strapi.services.event.fetchAllOfUser(ctx.query, ctx.state.user.id);
    }
  },

  /**
   * Retrieve a event record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.event.fetchOfUser(ctx.params, ctx.state.user.id);
  },

  /**
   * Count event records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.event.countOfUser(ctx.query, ctx.state.user.id);
  },

  /**
   * Create a/an event record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.event.add(ctx.request.body);
  },

  /**
   * Update a/an event record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.event.editOfUser(ctx.params, ctx.request.body, ctx.state.user.id) ;
  },

  /**
   * Destroy a/an event record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.event.removeOfUser(ctx.params, ctx.state.user.id);
  }
};
