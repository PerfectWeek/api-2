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
    const group = await strapi.services.group.fetch(ctx.params);

    const groupMembers = await strapi.services.groupmember.fetchAll({group: group.id});
    group.attributes.members = groupMembers.models.map(formatGroupMember);
    await fetchUsersImages(group.attributes.members);

    group.attributes.invited_members = []; // TODO: invited members

    return group;
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
    const createdGroup = await strapi.services.group.add(ctx.request.body);

    const member = await strapi.services.groupmember.add({
      group: createdGroup.attributes.id,
      user: ctx.state.user.id,
      role: "admin"
    });
    member.relations.user.relations.image = ctx.state.user.image; // Because image isn't fetched

    createdGroup.attributes.members = Array(member).map(formatGroupMember);
    createdGroup.attributes.invited_members = []; // TODO: invited_members

    return createdGroup;
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

//
// Helpers
//

const formatGroupMember = gm => {
  return {
    username: gm.relations.user.attributes.username,
    id: gm.relations.user.attributes.id,
    role: gm.attributes.role,
    image: gm.relations.user.relations.image
  };
};

// Because strapi does not fetch deep enough, we need to manually
// request users to obtain their images
const fetchUsersImages = async users => {
  for (const user of users) {
    const correspondingUser = await strapi.plugins['users-permissions'].services.user.fetch({
      id: user.id
    });
    user.image = correspondingUser.image;
  }

  return users;
};
