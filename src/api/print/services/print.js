'use strict';

/**
 * print service.
 */

const {createCoreService} = require('@strapi/strapi').factories;
const NumberUtils = require("../../../utils/utils.number");
const {SORTED_CONDITION_LEVELS} = require("../../../utils/utils.rarity");
const {CONDITION_LEVELS} = require("../../../utils/utils.rarity");
const {RarityGeneratorSingleton} = require("../../../utils/utils.rarity");
const {RARITY_LEVELS} = require("../../../utils/utils.rarity");
const {SORTED_RARITY_LEVELS} = require("../../../utils/utils.rarity");

module.exports = createCoreService('api::print.print', ({strapi}) => ({
  async createPrint() {
    let descChars = await strapi.entityService.findMany("api::character.character", {
      sort: {
        id: 'desc',
      },
      limit: 1
    })
    let ascChars = await strapi.entityService.findMany("api::character.character", {
      sort: {
        id: 'asc',
      },
      limit: 1
    })

    let lastChar = descChars[0];
    let firstChar = ascChars[0]

    let pickedCardId = NumberUtils.getRandomIntInclusive(firstChar.id, lastChar.id);

    let curCharacter = await strapi.entityService.findOne(
      "api::character.character",
      pickedCardId, {
        populate: {
          cards: {
            populate: {
              image: true,
            }
          }
        }
      }
    )

    const {cards} = curCharacter;
    let cardRarityMap = {};
    cards.forEach(card => cardRarityMap[card.rarity] = card);

    let RarityGenerator = new RarityGeneratorSingleton(RARITY_LEVELS, SORTED_RARITY_LEVELS);
    let randomRarity = RarityGenerator.getRandom();
    let selectedCard = cardRarityMap[randomRarity];

    let curAmountOfPrintsForCard = await strapi.entityService.count("api::print.print", {
      filters: {
        card: selectedCard.id
      }
    })

    let ConditionGenerator = new RarityGeneratorSingleton(CONDITION_LEVELS, SORTED_CONDITION_LEVELS)
    let randomCondition = ConditionGenerator.getRandom();

    return await strapi.entityService.create("api::print.print", {
      data: {
        printNumber: curAmountOfPrintsForCard + 1,
        card: selectedCard.id,
        condition: randomCondition,
      },
      populate: {
        card: {
          populate: {
            character: "*",
            image: "*",
          }
        }
      }
    })
  }
}));
