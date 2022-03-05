'use strict';

/**
 * card service.
 */

const {createCoreService} = require('@strapi/strapi').factories;
const axios = require("axios");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const {RARITY_LEVELS} = require("../../../utils/utils.rarity");
const nodeHtmlToImage = require("node-html-to-image");
const {sleep} = require("../../../utils/utils.node");
const {getHtmlText} = require("../customhtml/html-text");

module.exports = createCoreService('api::card.card', ({strapi}) => ({
  async createCard(characterData) {
    const {mal_id: malId, name, about} = characterData;

    let curStrapiCharacter = await strapi.entityService.findMany("api::character.character", {
      filters: {
        malId,
      }
    });

    if (curStrapiCharacter && curStrapiCharacter.length > 0) {
      return undefined;
    }

    let getCharacterPictures;
    let getAnimes;

    try {
      getCharacterPictures = await axios.get(`https://api.jikan.moe/v4/characters/${malId}/pictures`);
      getAnimes = await axios.get(`https://api.jikan.moe/v4/characters/${malId}/anime`);
    } catch (e) {
      console.error("Could not get pictures and/or animes", e.message)
    }


    let pictures = getCharacterPictures.data.data;
    let anime = getAnimes.data.data[0];
    const {
      anime: {
        title: animeTitle
      }
    } = anime;

    curStrapiCharacter = await strapi.entityService.create("api::character.character", {
      data: {
        name, animeTitle, malId: malId.toString(), about
      }
    })

    let rarityKeys = Object.keys(RARITY_LEVELS);

    for (let i = 0; i < rarityKeys.length; i++) {
      const rarityKey = rarityKeys[i];
      let rarity = RARITY_LEVELS[rarityKey]
      if (pictures[i]) {
        let {jpg: {image_url: imageUrl}} = pictures[i];

        const imageResponse = await axios.get(imageUrl, {responseType: 'arraybuffer'})
        const buffer = Buffer.from(imageResponse.data, 'binary')
        const card = await strapi.entityService.create('api::card.card', {
          data: {
            rarity,
            character: curStrapiCharacter.id
          },
        });

        let destPath = path.resolve(__dirname, `../card-borders/bordered-${card.id}.png`)
        let borderComposite = {input: path.resolve(__dirname, `../card-borders/${rarity}.png`)};

        let cardHeight = 350;
        let cardWidth = 225;
        let padding = 15;
        let textBoxTop = 40;
        let textBoxBottom = 56;

        let characterHtmlToImage = await nodeHtmlToImage({
          html: getHtmlText(cardWidth, textBoxTop, curStrapiCharacter.name),
          transparent: true,
        })

        let animeHtmlToImage = await nodeHtmlToImage({
          html: getHtmlText(cardWidth, textBoxBottom, curStrapiCharacter.animeTitle),
          transparent: true,
        })

        let cardImageComposite = {input:buffer}
        let characterNameComposite = {input: Buffer.from(characterHtmlToImage), top: 0, left: 0};
        let animeTitleComposite = {input: Buffer.from(animeHtmlToImage), top: cardHeight - textBoxBottom, left: 0};

        let composites = [cardImageComposite, borderComposite, characterNameComposite, animeTitleComposite]

        await sharp({
          create: {
            width: 225,
            height: 350,
            channels: 4,
            background: {r: 255, g: 0, b: 0, alpha: 0.0}
          }
        })
          .composite(composites)
          .sharpen()
          .withMetadata()
          .toFile(destPath)
        let fileStat = fs.statSync(destPath);
        await strapi.service('plugin::upload.upload').upload({
          data: {
            refId: card.id,
            ref: "api::card.card",
            field: "image",
          },
          files: {
            path: destPath,
            name: `bordered-${card.id}.png`,
            type: 'image/png',
            size: fileStat.size,
          }
        })
        fs.unlinkSync(destPath);
      }
    }
  },
  async createCardsFromCharacters(characters) {
    for (let i = 0; i < 10; i++) {
      const character = characters[i];
      console.log(`Syncing character: ${character.name}`);
      await strapi.service("api::card.card").createCard(character);
      await sleep(1000);
    }
  }
}));
