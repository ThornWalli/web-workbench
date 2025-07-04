import { DISTRIBUTION_DEFAULT_VALUES, DISTRIBUTION_TYPE } from '../utils/city';
import type City from './City';
import CityHuman, {
  type CityHumanJSON,
  type CityHumanOptions
} from './CityHuman';

export type Moods = {
  [key in DISTRIBUTION_TYPE]: boolean;
};

const MOOD_WEIGHT = {
  [DISTRIBUTION_TYPE.FOOD]: 0.2,
  [DISTRIBUTION_TYPE.ENERGY]: 0.2,
  [DISTRIBUTION_TYPE.TAXES]: 0.5,
  [DISTRIBUTION_TYPE.HOUSE]: 0.1
};

export interface CityResidentOptions extends CityHumanOptions {
  mood?: number;
  lastMood?: number;
}

export interface CityResidentJSON extends CityHumanJSON {
  mood: number;
  lastMood: number;
}

export default class CityResident extends CityHuman {
  /**
   * @description Stimmung der Einwohner.
   */
  mood: number = 0;
  lastMood = 0;

  constructor({ mood, lastMood, ...options }: CityResidentOptions = {}) {
    super(options);
    this.mood = mood || this.mood;
    this.lastMood = lastMood || this.lastMood;
  }

  executeMood(
    city: City,
    moods: Partial<Moods> = {
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

  override toJSON(): CityResidentJSON {
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
 * @param {import("./City").default} city
 * @param {*} type
 * @param {*} value
 * @returns
 */
function calculateMood(city: City, moods: Partial<Moods>, mood: number) {
  return Object.entries(moods).reduce(
    (result, [type, value]) => {
      const positive = value ? 1 : -1;
      const moodWeight = MOOD_WEIGHT[type as DISTRIBUTION_TYPE] || 0;

      let test;
      switch (type) {
        case DISTRIBUTION_TYPE.TAXES:
          test = calcTaxesMood(city, type);
          break;

        default:
          test = calcDefaultMood(city, type as DISTRIBUTION_TYPE);
          break;
      }

      const v = positive * moodWeight * test;
      console.log(
        result,
        test,
        type,
        positive,
        moodWeight,
        DISTRIBUTION_DEFAULT_VALUES[type as DISTRIBUTION_TYPE],
        getDestribution(city, type as DISTRIBUTION_TYPE),
        v
      );
      result += v;
      return Math.max(Math.min(result, 1), -1);
    },
    // Übernehme drei Viertel der alten Stimmung
    mood / 3 / 4
  );
}

const getDestribution = (city: City, type: DISTRIBUTION_TYPE) => {
  return {
    [DISTRIBUTION_TYPE.FOOD]: city.distributionFood,
    [DISTRIBUTION_TYPE.ENERGY]: city.distributionEnergy,
    [DISTRIBUTION_TYPE.TAXES]: city.taxes,
    [DISTRIBUTION_TYPE.HOUSE]: 1
  }[type];
};

const calcTaxesMood = (city: City, type: DISTRIBUTION_TYPE) => {
  const distribution = getDestribution(city, type);
  return -1 * (distribution / DISTRIBUTION_DEFAULT_VALUES[type]);
};

const calcDefaultMood = (city: City, type: DISTRIBUTION_TYPE) => {
  return getDestribution(city, type) / DISTRIBUTION_DEFAULT_VALUES[type];
};
