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
      return strapi.services.groupmember.search(ctx.query);
    } else {
      return strapi.services.groupmember.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a groupmember record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.groupmember.fetch(ctx.params);
  },

  /**
   * Count groupmember records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.groupmember.count(ctx.query);
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
    return strapi.services.groupmember.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an groupmember record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.groupmember.remove(ctx.params);
  }
};
