'use strict';

/**
 * Groupmember.js controller
 *
 * @description: A set of functions called "actions" for managing `Groupmember`.
 */

module.exports = {

  /**
   * Retrieve groupmember records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.groupmember.searchOfUser(ctx.query, ctx.state.user.id);
    } else {
      return strapi.services.groupmember.fetchAllOfUser(ctx.query, ctx.state.user.id);
    }
  },

  /**
   * Retrieve a groupmember record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.groupmember.fetchOfUser(ctx.params, ctx.state.user.id);
  },

  /**
   * Count groupmember records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.groupmember.countOfUser(ctx.query, ctx.state.user.id);
  },

  /**
   * Create a/an groupmember record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.groupmember.add(ctx.request.body);
  },

  /**
   * Update a/an groupmember record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.groupmember.editOfUser(ctx.params, ctx.request.body, ctx.state.user.id);
  },

  /**
   * Destroy a/an groupmember record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.groupmember.removeOfUser(ctx.params, ctx.state.user.id);
  }
};
