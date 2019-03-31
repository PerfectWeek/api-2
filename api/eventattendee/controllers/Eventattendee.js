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
      return strapi.services.eventattendee.search(ctx.query);
    } else {
      return strapi.services.eventattendee.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a eventattendee record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.eventattendee.fetch(ctx.params);
  },

  /**
   * Count eventattendee records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.eventattendee.count(ctx.query);
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
    return strapi.services.eventattendee.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an eventattendee record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.eventattendee.remove(ctx.params);
  }
};
