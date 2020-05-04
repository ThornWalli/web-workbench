
export const NAMES = {
  CITY_SHIELD: 'city_shield',
  ITEM_CLICK: 'item_click',
  BOTTOM_NAVIGATION_1: 'bottom_navigation_1',
  BOTTOM_NAVIGATION_2: 'bottom_navigation_2',
  BOTTOM_NAVIGATION_3: 'bottom_navigation_3',
  BOTTOM_NAVIGATION_4: 'bottom_navigation_4',
  BOTTOM_NAVIGATION_5: 'bottom_navigation_5',
  SHOP_ITEM_CLICK: 'shop_item_click',
  WRITE_LINE: 'write_line',
  END_LINE: 'end_line',
  TARGET_CITY_SELECT: 'target_city_select',
  ERROR: 'error',
  BUY: 'buy',
  NOW_ROUND_VEHICLE_COME: 'now_round_vehicle_come',
  BUTTON_CLICK_1: 'button_click_1',
  LABEL_CHECKBOX_CLICK: 'label_checkbox_click',
  PICKER: 'picker',
  ACTION_VEHICLE_CLICK: 'action_vehicle_click'
};

class SoundPlayer {
  el;
  #running = false;
  #playQueue = [];

  constructor () {
    this.el = document.createElement('audio');
  }

  runQueue () {
    if (this.#playQueue.length < 1) {
      this.#running = false;
    } else {
      this.#running = true;
      const path = this.#playQueue.shift();
      this.el.onloadeddata = () => {
        this.el.play();
      };
      this.el.onended = () => {
        this.runQueue();
      };
      console.log(path);
      this.el.setAttribute('src', path);
    }
  }

  async play (name) {
    const trackPath = await import('@/assets/disks/mooncity/sounds/sfx/' + String(name) + '.ogg').then(module => module.default);
    this.#playQueue.push(trackPath);
    if (!this.#running) {
      this.runQueue();
    }
  }
}

export default new SoundPlayer();
