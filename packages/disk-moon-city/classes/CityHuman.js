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

  constructor({ value, recruiting, recruitmentCosts } = {}) {
    this.value = value || this.value;
    this.recruiting = recruiting || this.recruiting;
    this.recruitmentCosts = recruitmentCosts || this.recruitmentCosts;
  }

  setRecruiting() {
    this.recruiting = true;
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

  executeRecruiting(value) {
    this.recruiting = false;
    this.value += value;
    this.recruitmentCosts += Math.round(
      this.value * 0.15 * (value / this.getIncomingRecruits())
    );
  }

  toJSON() {
    return {
      recruiting: this.recruiting,
      value: this.value,
      recruitmentCosts: this.recruitmentCosts
    };
  }
}
