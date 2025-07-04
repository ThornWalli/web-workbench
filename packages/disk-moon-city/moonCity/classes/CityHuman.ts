export interface CityHumanOptions {
  recruiting?: boolean;
  value?: number;
  recruitmentCosts?: number;
}

export interface CityHumanJSON {
  recruiting: boolean;
  value: number;
  recruitmentCosts: number;
}

export default class CityHuman {
  /**
   * Legt fest das Rekruiting wird.
   * @type {boolean}
   */
  recruiting = false;

  /**
   * Anzahl der rekrutierten Mitarbeiter.
   * @type {number}
   */
  value = 0;

  /**
   * Kosten für Rekrutierung.
   */
  recruitmentCosts = 300;

  constructor({ value, recruiting, recruitmentCosts }: CityHumanOptions = {}) {
    this.value = value || this.value;
    this.recruiting = recruiting || this.recruiting;
    this.recruitmentCosts = recruitmentCosts || this.recruitmentCosts;
  }

  setRecruiting() {
    this.recruiting = true;
  }

  remove(value: number) {
    this.value = Math.max(this.value - value, 0);
  }

  /**
   * Ruft die Anzahl der eingehenden Rekruten ab.
   * @return {number}
   * @ovveride
   */
  getIncomingRecruits() {
    return 300 + Math.round(Math.random() * 300);
  }

  abortRecruiting() {
    this.recruiting = false;
  }

  executeRecruiting(value: number) {
    this.recruiting = false;
    this.value += value;
    this.recruitmentCosts += Math.round(
      this.value * 0.15 * (value / this.getIncomingRecruits())
    );
  }

  toJSON(): CityHumanJSON {
    return {
      recruiting: this.recruiting,
      value: this.value,
      recruitmentCosts: this.recruitmentCosts
    };
  }
}
