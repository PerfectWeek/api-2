'use strict';

/**
 * Eventattendee.js controller
 *
 * @description: A set of functions called "actions" for managing `Eventattendee`.
 */

module.exports = {

  /**
   * Retrieve eventattendee records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.eventattendee.searchOfUser(ctx.query, ctx.state.user.id);
    } else {
      return strapi.services.eventattendee.fetchAllOfUser(ctx.query, ctx.state.user.id);
    }
  },

  /**
   * Retrieve a eventattendee record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.eventattendee.fetchOfUser(ctx.params, ctx.state.user.id);
  },

  /**
   * Count eventattendee records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.eventattendee.countOfUser(ctx.query, ctx.state.user.id);
  },

  /**
   * Create a/an eventattendee record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.eventattendee.add(ctx.request.body);
  },

  /**
   * Update a/an eventattendee record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.eventattendee.editOfUser(ctx.params, ctx.request.body, ctx.state.user.id);
  },

  /**
   * Destroy a/an eventattendee record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.eventattendee.removeOfUser(ctx.params, ctx.state.user.id);
  }
};
