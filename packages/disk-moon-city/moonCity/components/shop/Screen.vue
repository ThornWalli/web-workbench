<template>
  <mc-screen
    class="mc-shop-screen"
    :background-image="backgroundImage"
    :change-key="JSON.stringify(lines)">
    <mc-text-drawer loop :lines="lines" />
    <slot />
  </mc-screen>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import Building from '../../classes/Building';
import Vehicle from '../../classes/Vehicle';
import Weapon from '../../classes/Weapon';
import useI18n from '../../composables/useI18n';
import graphics, { GRAPHIC_BACKGROUND_TYPE } from '../../utils/graphics';
import McScreen from '../Screen.vue';
import McTextDrawer from '../TextDrawer.vue';
import useCore from '../../composables/useCore';
import { fillTextStart } from '../../utils/string';
import type { AVAILABLE_BUILDING_TYPES } from '../../classes/buildings/types';
import type { AVAILABLE_VEHICLE_TYPES } from '../../classes/vehicles/types';
import type { AVAILABLE_WEAPON_TYPES } from '../../classes/weapons/types';
import type { VEHICLE_KEY } from '../../types';
import {
  CONSOLE_ALIGN,
  type ConsoleGroupLines,
  type ConsoleLine,
  type ConsoleSubGroupLines
} from '../../observables/roundComplete/types';

const { t } = useI18n();
const { core } = useCore();

const $props = defineProps<{
  modelValue:
    | AVAILABLE_BUILDING_TYPES
    | AVAILABLE_VEHICLE_TYPES
    | AVAILABLE_WEAPON_TYPES;
}>();

const resolveModel = computed(() => new $props.modelValue());

const lines = computed(() => {
  const player = core.currentPlayer;
  if (!player) {
    throw new Error('Player not found');
  }
  const model = resolveModel.value;
  switch (type.value) {
    case 'vehicle':
      return getVehicleLines(
        model as Vehicle,
        player.city.vehicles.filter(v => v.key === model.key).length
      );
    case 'building':
      return getBuildingLines(
        model as Building,
        player.city.buildings.filter(v => v.key === model.key).length
      );
    case 'weapon':
      return getWeaponLines(
        model as Weapon,
        player.city.weapons.filter(v => v.key === model.key).length
      );
  }
  return [];
});

const type = computed(() => {
  if (resolveModel.value instanceof Vehicle) {
    return GRAPHIC_BACKGROUND_TYPE.VEHICLE;
  } else if (resolveModel.value instanceof Building) {
    return GRAPHIC_BACKGROUND_TYPE.BUILDING;
  } else if (resolveModel.value instanceof Weapon) {
    return GRAPHIC_BACKGROUND_TYPE.WEAPON;
  }
  return undefined;
});

const backgroundImage = computed(() => {
  if (!type.value) {
    return undefined;
  }
  switch (type.value) {
    case GRAPHIC_BACKGROUND_TYPE.VEHICLE:
      return graphics.background[GRAPHIC_BACKGROUND_TYPE.VEHICLE][
        resolveModel.value.key as VEHICLE_KEY
      ];
  }
  return undefined;
});

/**
 *
 * @param {Vehicle} vehicle
 */
const getVehicleLines = (
  vehicle: Vehicle,
  count: number
): ConsoleGroupLines => {
  return [
    [
      [
        {
          background: true,
          content: `${t(`view.shop.info.label.module_type`)}: `,
          color: 'dark-yellow'
        },
        {
          background: true,
          content: t(`vehicle.${vehicle.key}.name`),
          color: 'yellow'
        }
      ],
      [{ spacer: true }],
      [
        {
          content: t(`view.shop.info.label.price`) + ':',
          color: 'dark-yellow'
        },
        {
          content: fillTextStart(String(vehicle.price), 5, '0'),
          color: 'white'
        }
      ]
    ],
    [
      {
        background: true,
        content: `${t(`view.shop.info.label.you_have.vehicles.start`)}: `,
        color: 'dark-blue'
      },
      {
        background: true,
        content: fillTextStart(String(count), 3, '0'),
        color: 'white'
      },
      {
        background: true,
        content: ` ${t(`view.shop.info.label.you_have.vehicles.end`)}`,
        color: 'dark-blue'
      }
    ],
    { spacer: true },
    [
      {
        content: `${t(`view.shop.info.label.vehicle_data`)}:`,
        color: 'dark-blue',
        background: true,
        underline: true
      }
    ],
    [
      [
        {
          content: `${t(`view.shop.info.label.vehicle_storage`)}   : `,
          color: 'dark-blue',
          background: true
        },
        {
          content: fillTextStart(
            String(
              (vehicle.storage?.slots || []).map(
                slot =>
                  `${slot.value}${t('label.unit')} ${t(`storageType.${slot.type}.shortName`)}`
              )
            ),
            2,
            '0'
          ),
          color: 'white',
          background: true
        }
      ]
    ],
    [
      [
        {
          content: `${t(`view.shop.info.label.armor`)}  : `,
          color: 'dark-blue',
          background: true
        },
        {
          content: fillTextStart(String(vehicle.maxArmor), 2, '0'),
          color: 'white',
          background: true
        }
      ]
    ],
    [
      [
        {
          content: `${t(`view.shop.info.label.weapon`)} : `,
          color: 'dark-blue',
          background: true
        },
        {
          content: t(`vehicle_weapon.${vehicle.weapon.key}.name`),
          color: 'white',
          background: true
        }
      ]
    ]
  ];
};

/**
 *
 * @param {Building} building
 */
const getBuildingLines = (
  building: Building,
  count: number
): ConsoleGroupLines => {
  return [
    [
      [
        {
          content: `${t(`view.shop.info.label.module_type`)}: `,
          color: 'dark-yellow'
        },
        { content: t(`building.${building.key}.name`), color: 'yellow' }
      ],
      [{ spacer: true }],
      [
        {
          content: t(`view.shop.info.label.price`) + ':',
          color: 'dark-yellow'
        },
        {
          content: fillTextStart(String(building.price), 5, '0'),
          color: 'white'
        }
      ]
    ],
    [
      {
        content: `${t(`view.shop.info.label.you_have.buildings.start`)}: `,
        color: 'dark-blue'
      },
      { content: fillTextStart(String(count), 3, '0'), color: 'white' },
      {
        content: ` ${t(`view.shop.info.label.you_have.buildings.end`)}`,
        color: 'dark-blue'
      }
    ],
    [],
    [
      {
        content: `${t(`view.shop.info.label.description`)}:`,
        color: 'blue',
        underline: true,
        block: true
      }
    ],
    ...t(`building.${building.key}.description`)
      .split('\n')
      .map(line => [
        {
          content: line,
          color: 'blue'
        }
      ]),
    ...getStorageLines(building),
    ...getProductionLines(building),
    ...getCostLines(building)
  ].filter(Boolean);
};

/**
 *
 * @param {Weapon} building
 */
const getWeaponLines = (weapon: Weapon, count: number): ConsoleGroupLines => {
  return [
    [
      [
        {
          content: `${t(`view.shop.info.label.module_type`)}: `,
          color: 'dark-yellow'
        },
        { content: t(`weapon.${weapon.key}.name`), color: 'yellow' }
      ],
      [{ spacer: true }],
      [
        {
          content: t(`view.shop.info.label.price`) + ':',
          color: 'dark-yellow'
        },
        { content: fillTextStart(String(weapon.price), 5, '0'), color: 'white' }
      ]
    ],
    [
      {
        content: `${t(`view.shop.info.label.you_have.weapons.start`)}: `,
        color: 'dark-blue'
      },
      { content: fillTextStart(String(count), 3, '0'), color: 'white' },
      {
        content: ` ${t(`view.shop.info.label.you_have.weapons.end`)}`,
        color: 'dark-blue'
      }
    ],
    [],
    [
      {
        content: `${t(`view.shop.info.label.description`)}:`,
        color: 'blue',
        underline: true,
        block: true
      }
    ],
    ...t(`weapon.${weapon.key}.description`)
      .split('\n')
      .map(line => [
        {
          content: line,
          color: 'blue'
        }
      ])
  ];
};

const getStorageLines = (model: Vehicle | Building): ConsoleGroupLines => {
  const { storage } = model;
  const lines = Array<ConsoleLine | ConsoleLine[]>();
  if ((storage?.slots || []).length > 0) {
    lines.push(
      { break: true },
      [
        {
          content: `${t(`view.shop.info.label.` + (model instanceof Vehicle ? 'vehicle_storage' : 'storage'))}:`,
          color: 'blue',
          underline: true,
          block: true,
          background: true
        }
      ],

      ...(!storage || !storage.slots.length
        ? [
            { spacer: true },
            {
              content: t(`view.shop.info.label.no_storage`),
              color: 'dark-red',
              align: CONSOLE_ALIGN.CENTER,
              block: true,
              background: true
            },
            { spacer: true }
          ]
        : []),

      ...(storage?.slots || []).map(slot => [
        {
          content: `${t(`storageType.${slot.type}.name`)}`,
          color: 'dark-blue',
          background: true
        },
        { spacer: true },
        {
          content: fillTextStart(String(slot.value), 4, '0') + t('label.unit'),
          color: 'white',
          background: true
        }
      ])
    );
    return lines;
  }
  return lines;
};

const getProductionLines = ({ roundProduction }: Building) => {
  const lines: ConsoleSubGroupLines = [];
  const productions = Object.entries(roundProduction);
  if (productions.length > 0) {
    lines.push({ break: true }, [
      {
        content: `${t(`view.shop.info.label.production`)}:`,
        color: 'blue',
        underline: true,
        block: true
      }
    ]);
    lines.push(
      ...(!productions.length
        ? [
            { spacer: true },
            {
              content: t(`view.shop.info.label.no_production`),
              color: 'dark-red',
              align: CONSOLE_ALIGN.CENTER,
              block: true
            },
            { spacer: true }
          ]
        : [])
    );
    lines.push(
      ...productions.map<ConsoleLine[]>(([type, value]) => [
        {
          content: `${t(`resource.${type}.name`)}: `,
          color: 'dark-blue'
        },
        { spacer: true },
        {
          content: fillTextStart(String(value), 4, '0') + t('label.unit'),
          color: 'white'
        }
      ])
    );
  }
  return lines;
};

const getCostLines = ({ roundCost }: Building) => {
  const costs = Object.entries(roundCost);
  const lines = Array<ConsoleLine | ConsoleLine[]>();
  if (costs.length > 0) {
    lines.push({ break: true }, [
      {
        content: `${t(`view.shop.info.label.cost`)}:`,
        color: 'blue',
        underline: true,
        block: true
      }
    ]);
    lines.push(
      ...(!costs.length
        ? [
            { spacer: true },
            {
              content: t(`view.shop.info.label.no_cost`),
              color: 'dark-red',
              align: CONSOLE_ALIGN.CENTER,
              block: true
            },
            { spacer: true }
          ]
        : [])
    );
    lines.push(
      ...costs.map<ConsoleLine[]>(([type, value]) => [
        {
          content: `${t(`resource.${type}.name`)}: `,
          color: 'dark-blue'
        },
        { spacer: true },
        {
          content: fillTextStart(String(value), 4, '0') + t('label.unit'),
          color: 'white'
        }
      ])
    );
  }
  return lines;
};
</script>
