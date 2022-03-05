'use strict';

/**
 *  card controller
 */

const {createCoreController} = require('@strapi/strapi').factories;
const axios = require("axios");
const {sleep} = require("../../../utils/utils.node");

module.exports = createCoreController('api::card.card', ({strapi}) => ({
  async syncCards() {
    let params = {
      order_by: "favorites",
      sort: "desc",
      page: 1,
    }
    let characters;
    try {
      characters = await axios.get("https://api.jikan.moe/v4/characters", {
        params
      })
    } catch (e) {
      strapi.debug.error("Could not get anime", e.message);
    }

    if (!characters) {
      return undefined;
    }

    // Sleep to get rid of the current
    await sleep(1000);

    strapi.service("api::card.card").createCardsFromCharacters(characters.data.data);

    return true;
  }
}));

