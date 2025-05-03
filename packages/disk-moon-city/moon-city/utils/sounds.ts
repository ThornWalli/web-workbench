import music_mooncity from '../assets/sounds/music/mooncity.mp3';
import music_spaceragtime from '../assets/sounds/music/spaceragtime.mp3';

import sfx_text_drawer_end from '../assets/sounds/sfx/text_drawer_end.wav';
import sfx_text_drawer_write from '../assets/sounds/sfx/text_drawer_write.wav';
import sfx_menu_item_click from '../assets/sounds/sfx/menu_item_click.wav';
import sfx_button_1_click from '../assets/sounds/sfx/button_1_click.wav';
import sfx_button_2_click from '../assets/sounds/sfx/button_2_click.wav';
import sfx_button_3_click from '../assets/sounds/sfx/button_3_click.wav';
import sfx_button_4_click from '../assets/sounds/sfx/button_4_click.wav';
import sfx_buy_sell from '../assets/sounds/sfx/buy_sell.wav';
import sfx_error from '../assets/sounds/sfx/error.wav';
import sfx_round_complete from '../assets/sounds/sfx/round_complete.wav';
import sfx_vehicle_arrive from '../assets/sounds/sfx/vehicle_arrive.wav';

import sfx_rocket from '../assets/sounds/sfx/rocket.wav';
import sfx_sat_laser from '../assets/sounds/sfx/sat_laser.wav';
import sfx_city_shield_tick from '../assets/sounds/sfx/city_shield_tick.wav';

export enum SOUND_TYPE {
  MUSIC = 'music',
  SFX = 'sfx'
}

export enum MUSIC {
  MOONCITY = 'mooncity',
  SPACERAGTIME = 'spaceragtime'
}
export enum SFX {
  TEXT_DRAWER_WRITE = 'text_drawer_write',
  TEXT_DRAWER_END = 'text_drawer_end',
  ERROR = 'error',
  BUTTON_1_CLICK = 'button_1_click',
  BUTTON_2_CLICK = 'button_2_click',
  BUTTON_3_CLICK = 'button_3_click',
  BUTTON_4_CLICK = 'button_4_click',
  BUY_SELL = 'buy_sell',
  MENU_ITEM_CLICK = 'menu_item_click',
  ROUND_COMPLETE = 'round_complete',
  VEHICLE_ARRIVE = 'vehicle_arrive',
  ROCKET = 'rocket',
  SAT_LASER = 'sat_laser',
  CITY_SHIELD_TICK = 'city_shield_tick'
}

export const music: { [key in MUSIC]: string } = {
  [MUSIC.MOONCITY]: music_mooncity,
  [MUSIC.SPACERAGTIME]: music_spaceragtime
};

export const sfx: { [key in SFX]: string } = {
  [SFX.TEXT_DRAWER_WRITE]: sfx_text_drawer_write,
  [SFX.TEXT_DRAWER_END]: sfx_text_drawer_end,
  [SFX.ERROR]: sfx_error,
  [SFX.BUTTON_1_CLICK]: sfx_button_1_click,
  [SFX.BUTTON_2_CLICK]: sfx_button_2_click,
  [SFX.BUTTON_3_CLICK]: sfx_button_3_click,
  [SFX.BUTTON_4_CLICK]: sfx_button_4_click,
  [SFX.BUY_SELL]: sfx_buy_sell,
  [SFX.MENU_ITEM_CLICK]: sfx_menu_item_click,
  [SFX.ROUND_COMPLETE]: sfx_round_complete,
  [SFX.VEHICLE_ARRIVE]: sfx_vehicle_arrive,
  [SFX.ROCKET]: sfx_rocket,
  [SFX.SAT_LASER]: sfx_sat_laser,
  [SFX.CITY_SHIELD_TICK]: sfx_city_shield_tick
};
