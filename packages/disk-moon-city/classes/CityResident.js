import {
  DISTRIBUTION_DEFAULT_VALUES,
  DISTRIBUTION_TYPE
} from '../utils/city.js';
import CityHuman from './CityHuman';

const MOOD_WEIGHT = {
  [DISTRIBUTION_TYPE.FOOD]: 0.2,
  [DISTRIBUTION_TYPE.ENERGY]: 0.2,
  [DISTRIBUTION_TYPE.TAXES]: 0.5,
  [DISTRIBUTION_TYPE.HOUSE]: 0.1
};

export default class CityResident extends CityHuman {
  /**
   * Stimmung der Einwohner.
   * @type {DISTRIBUTION_TYPE}
   */
  mood = 0;
  lastMood = 0;

  constructor({ mood, lastMood, ...options } = {}) {
    super(options);
    this.mood = mood || this.mood;
    this.lastMood = lastMood || this.lastMood;
  }

  executeMood(
    city,
    moods = {
      [DISTRIBUTION_TYPE.FOOD]: false,
      [DISTRIBUTION_TYPE.ENERGY]: false,
      [DISTRIBUTION_TYPE.TAXES]: false,
      [DISTRIBUTION_TYPE.HOUSE]: false
    }
  ) {
    moods = {
      [DISTRIBUTION_TYPE.FOOD]: false,
      [DISTRIBUTION_TYPE.ENERGY]: false,
      [DISTRIBUTION_TYPE.TAXES]: false,
      [DISTRIBUTION_TYPE.HOUSE]: false,
      ...moods
    };
    this.lastMood = this.mood;
    this.mood = calculateMood(city, moods, this.mood);
    console.log('mood', { mood: this.mood, lastMood: this.lastMood });
  }

  toJSON() {
    return {
      ...super.toJSON(),
      mood: this.mood,
      lastMood: this.lastMood
    };
  }
}

// 5 / 4 / 100;

/**
 *
 * @param {import("./City.js").default} city
 * @param {*} type
 * @param {*} value
 * @returns
 */
function calculateMood(city, moods, mood) {
  return Object.entries(moods).reduce(
    (result, [type, value]) => {
      const positive = value ? 1 : -1;
      const moodWeight = MOOD_WEIGHT[String(type)];

      let test;
      switch (type) {
        case DISTRIBUTION_TYPE.TAXES:
          test = calcTaxesMood(city, type);
          break;

        default:
          test = calcDefaultMood(city, type);
          break;
      }

      const v = positive * moodWeight * test;
      console.log(
        result,
        test,
        type,
        positive,
        moodWeight,
        DISTRIBUTION_DEFAULT_VALUES[String(type)],
        getDestribution(city, type),
        v
      );
      result += v;
      return Math.max(Math.min(result, 1), -1);
    },
    // Übernehme drei Viertel der alten Stimmung
    mood / 3 / 4
  );
}

const getDestribution = (city, type) => {
  return {
    [DISTRIBUTION_TYPE.FOOD]: city.distributionFood,
    [DISTRIBUTION_TYPE.ENERGY]: city.distributionEnergy,
    [DISTRIBUTION_TYPE.TAXES]: city.taxes,
    [DISTRIBUTION_TYPE.HOUSE]: 1
  }[String(type)];
};

const calcTaxesMood = (city, type) => {
  const distribution = getDestribution(city, type);
  return -1 * (distribution / DISTRIBUTION_DEFAULT_VALUES[String(type)]);
};

const calcDefaultMood = (city, type) => {
  return (
    getDestribution(city, type) / DISTRIBUTION_DEFAULT_VALUES[String(type)]
  );
};
