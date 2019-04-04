'use strict';

/**
 * Groupinvite.js controller
 *
 * @description: A set of functions called "actions" for managing `Groupinvite`.
 */

module.exports = {

  /**
   * Retrieve groupinvite records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.groupinvite.search(ctx.query);
    } else {
      return strapi.services.groupinvite.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a groupinvite record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.groupinvite.fetch(ctx.params);
  },

  /**
   * Count groupinvite records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.groupinvite.count(ctx.query);
  },

  /**
   * Create a/an groupinvite record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.groupinvite.add(ctx.request.body);
  },

  /**
   * Update a/an groupinvite record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.groupinvite.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an groupinvite record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.groupinvite.remove(ctx.params);
  }
};
