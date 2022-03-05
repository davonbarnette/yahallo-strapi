'use strict';

/**
 *  print controller
 */

const {createCoreController} = require('@strapi/strapi').factories;

module.exports = createCoreController('api::print.print', ({strapi}) => ({
  async createPrints() {
    let dropRate = 4;
    let prints = [];
    for (let i = 0; i < dropRate; i++) {
      let print = await strapi.service("api::print.print").createPrint();
      prints.push(print);
    }
    return {prints};
  }
}));
