const RARITY_LEVELS = {
  SILVER: "SILVER",
  GOLD: "GOLD",
  DIAMOND: "DIAMOND",
  JADE: "JADE",
}

const SORTED_RARITY_LEVELS = [
  {level: RARITY_LEVELS.SILVER, weightPercentage: 50}, // 0.00 - 0.49
  {level: RARITY_LEVELS.GOLD, weightPercentage: 35}, // 0.50 - 0.84
  {level: RARITY_LEVELS.DIAMOND, weightPercentage: 14.75}, // 0.85 - 0.94
  {level: RARITY_LEVELS.JADE, weightPercentage: 0.25} // 0.95 - 0.99
]

const CONDITION_LEVELS = {
  POOR: "POOR",
  GOOD: "GOOD",
  EXCELLENT: "EXCELLENT",
  MINT: "MINT",
}

const SORTED_CONDITION_LEVELS = [
  {level: CONDITION_LEVELS.POOR, weightPercentage: 50}, // 0.00 - 0.49
  {level: CONDITION_LEVELS.GOOD, weightPercentage: 35}, // 0.50 - 0.84
  {level: CONDITION_LEVELS.EXCELLENT, weightPercentage: 14.75}, // 0.85 - 0.94
  {level: CONDITION_LEVELS.MINT, weightPercentage: 0.25} // 0.95 - 0.99
]

class RarityGeneratorSingleton {

  constructor(rarityLevelsMap = RARITY_LEVELS, sortedRarityLevels = SORTED_RARITY_LEVELS) {
    this.sortedRarityLevels = sortedRarityLevels;
    this.generateBounds();
  }

  generateBounds(){
    let curLowerBound = 0;
    let curUpperBound = 0;

    for (let i = 0; i < this.sortedRarityLevels.length; i++) {
      let rarityLevel = this.sortedRarityLevels[i];

      curLowerBound = curUpperBound;
      curUpperBound = curLowerBound + rarityLevel.weightPercentage;

      this.sortedRarityLevels[i]["upperBound"] = curUpperBound;
      this.sortedRarityLevels[i]["lowerBound"] = curLowerBound;
    }
  }

  getRandom(){
    let randNumber = Math.floor(Math.random() * 10000) / 100;

    for (let i = 0; i < this.sortedRarityLevels.length; i++) {
      const sortElement = this.sortedRarityLevels[i];

      let { upperBound, lowerBound, level } = sortElement;

      if (randNumber >= lowerBound && randNumber < upperBound){
        return level;
      }
    }
  }

  getMultipleRarities(){
    let rarityMap = {};
    for (let i = 0; i < 5; i++) {
      let rarity = this.getRandom();
      if (!rarityMap[rarity]){
        rarityMap[rarity] = 1;
      } else {
        rarityMap[rarity] += 1;
      }
    }
    return rarityMap;
  }
}

module.exports = {
  RarityGeneratorSingleton,
  RARITY_LEVELS,
  SORTED_RARITY_LEVELS,
  SORTED_CONDITION_LEVELS,
  CONDITION_LEVELS
};
