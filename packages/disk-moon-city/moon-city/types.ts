export enum VEHICLE_KEY {
  GRABBER = 'grabber',
  SHRIMP = 'shrimp',
  BIRDY = 'birdy',
  SPIDER = 'spider',
  HAWK = 'hawk',
  PHANTOM = 'phantom',
  THUNDER = 'thunder',
  BIG_PLUNDER = 'big_plunder'
}

export enum BUILDING_KEY {
  ORE_STORAGE = 'ore_storage',
  REFINERY = 'refinery',
  POWER_STATION = 'power_station',
  ENERGY_TRANSMITTER = 'energy_transmitter',
  HOUSE = 'house',
  GREEN_HOUSE = 'green_house',
  FOOD_STORAGE = 'food_storage',
  VEHICLE_FACTORY = 'vehicle_factory',
  BARRACK = 'barrack',
  WEAPON_FACTORY = 'weapon_factory',
  VAULT = 'vault',
  SHIELD_GENERATOR = 'shield_generator'
}

export enum WEAPON_KEY {
  SATELLITE_LASER = 'satellite_laser',
  ROCKET = 'rocket',
  SEARCH_ROCKET = 'search_rocket'
}

export enum RECRUITMENT_TYPE {
  SECURITY_SERVICE = 'security_service',
  SOLDIER = 'soldier',
  MERCENARY = 'mercenary'
}

export enum COMPLETE_TYPE {
  ROUND = 'round',
  PLAYER = 'game'
}

export enum BUILDING_TYPE {
  WEAPON = 'weapon',
  SHIELD = 'shield',
  BUNKER = 'bunker',
  BARRACK = 'barrack',
  SECURITY = 'security',
  SOLDIER = 'soldier',
  MERCENARY = 'mercenary',
  STORAGE = 'storage',
  RESOURCE = 'resource',
  COMMERCE = 'commerce',
  PRODUCTION = 'production',
  POWER_STATION = 'power_station',
  ENERGY_CELL = 'energy_cell',
  REFINERY = 'refinery',
  INDUSTRIAL = 'industrial',
  VEHICLE = 'vehicle',
  FACTORY = 'factory',
  ENERGY = 'energy',
  FOOD = 'food',
  ORE = 'ore',
  ENERGY_TRANSMITTER = 'energy_transmitter'
}

export enum RESOURCE_TYPE {
  NONE = 'none',
  MINERAL_ORE = 'mineral_ore',
  ENERGY_CELL = 'energy_cell',
  FOOD = 'food',
  ENERGY = 'energy',
  CREDITS = 'credits',
  SHIELD_ENERGY = 'shield_energy'
}

export enum STORAGE_TYPE {
  NONE = 'none',
  CREDITS = 'credits',
  MINERAL_ORE = 'mineral_ore',
  ENERGY_CELL = 'energy_cell',
  FOOD = 'food',
  ENERGY = 'energy',
  HUMAN = 'human',
  EMPLOYEE = 'employee',
  SECURITY_SERVICE = 'security_service',
  SOLDIER = 'soldiers',
  MERCENARY = 'mercenary',
  ENERGY_TRANSFER = 'energy_transfer',
  SHIELD_ENERGY = 'shield_energy'
}

export enum EMPLOYEE_TYPE {
  SECURITY_SERVICE = 'security_service',
  SOLDIER = 'soldier',
  MERCENARY = 'mercenary'
}

export enum STATS_NAVIGATION_TYPES {
  NEXT = 'next',

  OVERVIEW = 'overview',
  CURRENT_LOG = 'current_log',
  LAST_LOG = 'last_log',
  POPULATION = 'population',
  CREDITS = 'credits',

  SECURITY_SERVICE = 'security_service',
  SOLDIER = 'soldier',
  MERCENARY = 'mercenary',
  ENERGY = 'energy',
  FOOD = 'food',

  MINREAL_ORE = 'resource_ore',
  ENERGY_CELL = 'resource_energy_cell',
  BUILDINGS = 'buildings',
  VEHICLES = 'vehicles',
  WEAPONS = 'weapons'
}

export enum INFO_NAVIGATION_TYPES {
  START = 'start',

  SECURITY_SERVICE = 'security_service',
  SOLDIER = 'soldier',
  MERCENARY = 'mercenary',
  ENERGY = 'energy',
  FOOD = 'food'
}

export enum ATTACK_TYPE {
  SPY = 'spy',
  ATTACK_CITY = 'attack_city',
  FACTORY_SABOTAGE = 'factory_sabotage',
  POWER_STATION_SABOTAGE = 'power_station_sabotage',
  DESTROY_ENERGY_TRANSMITTER = 'destroy_energy_transmitter',
  DAMAGE_VEHICLE = 'damage_vehicle',
  WEAPON = 'weapon',
  VEHICLE_ATTACK = 'vehicle_attack'
}

export enum PLAYER_STATUS {
  PLAYING = 'playing',
  GAME_LOST = 'game_lost',
  GAME_WON = 'game_won'
}

export enum LINE_GROUP {
  VEHICLE = 'vehicle',
  GENERAL = 'general',
  COST = 'cost',
  INCOME = 'income',
  ATTACK = 'attack'
}
