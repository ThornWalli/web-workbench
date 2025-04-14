<template>
  <mc-screen
    class="mc-shop-screen"
    :background-image="backgroundImage"
    :change-key="JSON.stringify(lines)">
    <mc-text-drawer loop :lines="lines" />
    <slot />
  </mc-screen>
</template>

<script setup>
import { computed } from 'vue';
import Building from '../../classes/Building';
import Vehicle from '../../classes/Vehicle';
import Weapon from '../../classes/Weapon';
import useI18n from '../../composables/useI18n';
import graphics from '../../utils/graphics';
import McScreen from '../Screen.vue';
import McTextDrawer from '../TextDrawer.vue';
import useCore from '../../composables/useCore';
import { fillTextStart } from '../../utils/string';

const { t } = useI18n();
const { core } = useCore();

const $props = defineProps({
  modelValue: {
    type: Function,
    required: true
  }
});

const resolveModel = computed(() => {
  return new $props.modelValue();
});

const lines = computed(() => {
  const player = core.currentPlayer;
  const model = resolveModel.value;
  switch (type.value) {
    case 'vehicle':
      return getVehicleLines(
        model,
        player.city.vehicles.filter(v => v.key === model.key).length
      );
    case 'building':
      return getBuildingLines(
        model,
        player.city.buildings.filter(v => v.key === model.key).length
      );
    case 'weapon':
      return getWeaponLines(
        model,
        player.city.weapons.filter(v => v.key === model.key).length
      );
  }
  return [];
});

const type = computed(() => {
  if (resolveModel.value instanceof Vehicle) {
    return 'vehicle';
  } else if (resolveModel.value instanceof Building) {
    return 'building';
  } else if (resolveModel.value instanceof Weapon) {
    return 'weapon';
  }
  return null;
});

const backgroundImage = computed(() => {
  return (
    graphics.background[String(type.value)]?.[resolveModel.value.key] || null
  );
});

/**
 *
 * @param {Vehicle} vehicle
 */
const getVehicleLines = (vehicle, count) => {
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
      { spacer: true },
      [
        {
          content: t(`view.shop.info.label.price`) + ':',
          color: 'dark-yellow'
        },
        { content: fillTextStart(vehicle.price, 5, '0'), color: 'white' }
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
        content: fillTextStart(count, 3, '0'),
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
            vehicle.storage.slots.map(
              slot =>
                `${slot.value}${t('label.unit')} ${t(`storageType.${slot.type}.shortName`)}`
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
          content: fillTextStart(vehicle.maxArmor, 2, '0'),
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
const getBuildingLines = (building, count) => {
  return [
    [
      [
        {
          content: `${t(`view.shop.info.label.module_type`)}: `,
          color: 'dark-yellow'
        },
        { content: t(`building.${building.key}.name`), color: 'yellow' }
      ],
      { spacer: true },
      [
        {
          content: t(`view.shop.info.label.price`) + ':',
          color: 'dark-yellow'
        },
        { content: fillTextStart(building.price, 5, '0'), color: 'white' }
      ]
    ],
    [
      {
        content: `${t(`view.shop.info.label.you_have.buildings.start`)}: `,
        color: 'dark-blue'
      },
      { content: fillTextStart(count, 3, '0'), color: 'white' },
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
const getWeaponLines = (weapon, count) => {
  return [
    [
      [
        {
          content: `${t(`view.shop.info.label.module_type`)}: `,
          color: 'dark-yellow'
        },
        { content: t(`weapon.${weapon.key}.name`), color: 'yellow' }
      ],
      { spacer: true },
      [
        {
          content: t(`view.shop.info.label.price`) + ':',
          color: 'dark-yellow'
        },
        { content: fillTextStart(weapon.price, 5, '0'), color: 'white' }
      ]
    ],
    [
      {
        content: `${t(`view.shop.info.label.you_have.weapons.start`)}: `,
        color: 'dark-blue'
      },
      { content: fillTextStart(count, 3, '0'), color: 'white' },
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

const getStorageLines = model => {
  const { storage } = model;
  return (storage?.slots || []).length > 0
    ? [
        { break: true },
        [
          {
            content: `${t(`view.shop.info.label.` + (model instanceof Vehicle ? 'vehicle_storage' : 'storage'))}:`,
            color: 'blue',
            underline: true,
            block: true,
            background: true
          }
        ]
      ].concat(
        ((!storage || !storage.slots.length) && [
          { spacer: true },
          {
            content: t(`view.shop.info.label.no_storage`),
            color: 'dark-red',
            align: 'center',
            block: true,
            background: true
          },
          { spacer: true }
        ]) ||
          [],
        (storage?.slots || []).map(slot => [
          {
            content: `${t(`storageType.${slot.type}.name`)}`,
            color: 'dark-blue',
            background: true
          },
          { spacer: true },
          {
            content: fillTextStart(slot.value, 4, '0') + t('label.unit'),
            color: 'white',
            background: true
          }
        ])
      )
    : [];
};

const getProductionLines = ({ roundProduction }) => {
  const productions = Object.entries(roundProduction);
  return productions.length > 0
    ? [
        { break: true },
        [
          {
            content: `${t(`view.shop.info.label.production`)}:`,
            color: 'blue',
            underline: true,
            block: true
          }
        ]
      ].concat(
        (!productions.length && [
          { spacer: true },
          {
            content: t(`view.shop.info.label.no_production`),
            color: 'dark-red',
            align: 'center',
            block: true
          },
          { spacer: true }
        ]) ||
          [],
        productions.map(([type, value]) => [
          {
            content: `${t(`resource.${type}.name`)}: `,
            color: 'dark-blue'
          },
          { spacer: true },
          {
            content: fillTextStart(value, 4, '0') + t('label.unit'),
            color: 'white'
          }
        ])
      )
    : [];
};

const getCostLines = ({ roundCost }) => {
  const costs = Object.entries(roundCost);
  return costs.length
    ? [
        { break: true },
        [
          {
            content: `${t(`view.shop.info.label.cost`)}:`,
            color: 'blue',
            underline: true,
            block: true
          }
        ]
      ].concat(
        (!costs.length && [
          { spacer: true },
          {
            content: t(`view.shop.info.label.no_cost`),
            color: 'dark-red',
            align: 'center',
            block: true
          },
          { spacer: true }
        ]) ||
          [],
        costs.map(([type, value]) => [
          {
            content: `${t(`resource.${type}.name`)}: `,
            color: 'dark-blue'
          },
          { spacer: true },
          {
            content: fillTextStart(value, 4, '0') + t('label.unit'),
            color: 'white'
          }
        ])
      )
    : [];
};
</script>
