'use strict';

/**
 * Userrelationship.js controller
 *
 * @description: A set of functions called "actions" for managing `Userrelationship`.
 */

module.exports = {

  /**
   * Retrieve userrelationship records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.userrelationship.search(ctx.query, ctx.state.user.id);
    } else {
      return strapi.services.userrelationship.fetchAll(ctx.query, ctx.state.user.id);
    }
  },

  /**
   * Retrieve a userrelationship record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.userrelationship.fetch(ctx.params);
  },

  /**
   * Count userrelationship records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.userrelationship.count(ctx.query);
  },

  /**
   * Create a/an userrelationship record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.userrelationship.add(ctx.request.body);
  },

  /**
   * Update a/an userrelationship record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.userrelationship.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an userrelationship record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.userrelationship.remove(ctx.params);
  },

  /**
   * Send friend request to user
   *
   * @returns {Object}
   */

  invite: async (ctx, next) => {
    const relationships = await strapi.services.userrelationship.fetchAll({}, ctx.state.user.id);
    const to = ctx.request.body.user;

    if (!to) {
      return ctx.response.badRequest('Missing user argument in body');
    }

    if (to === ctx.state.user.id) {
      return ctx.response.badRequest('Cannot invite yourself as a friend');
    }

    const user_entity = await strapi.plugins['users-permissions'].services.user.fetch({
      id: to
    });

    if (user_entity === null) {
      return ctx.response.notFound(`No user with ID ${to}`);
    }

    for (const relationship of relationships.models) {

      if (relationship.attributes.with === to) {

        switch (relationship.attributes.status) {
          case 'friend':
            return ctx.response.badRequest(`User with ID ${to} is already a friend`);
          case 'request':
            return ctx.response.badRequest(`User with ID ${to} has already been requested`);
        }

      } else if (relationship.attributes.from === to) {

        switch (relationship.attributes.status) {
          case 'friend':
            return ctx.response.badRequest(`User with ID ${to} is already a friend`);
          case 'request':
            return ctx.response.badRequest(`User with ID ${to} has already requested you`);
        }

      }

    }
    return strapi.services.userrelationship.invite(ctx.request.body, ctx.state.user.id);
  },

  /**
   * Accept or Refuse friend request
   *
   * @returns {Object}
   */
  respond: async (ctx, next) => {
    const { response, request } = ctx.request.body;

    if (response === undefined) {
      return ctx.response.badRequest('Missing response argument in body');
    }

    if (request === undefined) {
      return ctx.response.badRequest('Missing request argument in body');
    }

    const relationship = await strapi.services.userrelationship.fetch({
      id: request
    });

    if (!relationship) {
      return ctx.response.notFound(`No request with ID ${request}`);
    }

    if (relationship.attributes.with !== ctx.state.user.id) {
      return ctx.response.notFound(`Request with ID ${request} cannot be accepted by current user`);
    }

    if (relationship.attributes.status !== 'request') {
      return ctx.response.badRequest('Relationship has status "friend", expected "request"');
    }

    if (response === true) {
      await relationship.set({
        status: 'friend'
      }).save();
    } else {
      return strapi.services.userrelationship.remove({
        id: request
      });
    }

    return strapi.services.userrelationship.fetchAll({}, ctx.state.user.id);

  }
};
