<template>
  <span
    class="wb-disks-mooncity-atoms-header-field"
    :style="style"
  >
    <span>{{ label }}:</span><span class="color-gray">{{ value }}</span>
  </span>
</template>

<script>

const COLORS = {
  red: '#ce0000',
  redBorder: '#212031',
  yellow: '#ffdf21',
  gold: '#de9a10',
  darkGold: '#c70',
  blue: '#00ceff',
  darkBlue: '#008ace',
  lightBlue: '#00cfff',
  orange: '#ce7500',
  lightOrange: '#de9a10',
  purple: '#7375ad',
  green: '#8b4',
  darkGreen: '#426531',
  gray: '#cecfce',
  white: '#fff'
};

export default {
  props: {
    label: { type: String, default: null },
    labelColor: { type: String, default: 'gray' },
    value: { type: String, default: null }
  },
  computed: {
    style () {
      return {
        '--label-color': COLORS[String(this.labelColor)]
      };
    }
  }
};
</script>

<style lang="postcss">
.wb-disks-mooncity-atoms-header-field {
  --label-color: #fff;

  box-sizing: content-box;
  display: inline-block;
  padding: 2px 1px 2px 2px;
  font-size: 10px;
  line-height: 10px;
  vertical-align: top;
  background: none;
  border: none;
  border-right-color: #424552;
  border-bottom-color: #424552;
  box-shadow: none;

  & > span {
    display: inline-block;
    line-height: 10px;

    &:first-child {
      color: var(--label-color);
    }
  }

  & > .value {
    float: right;
    height: 10px;
    background: #000;
  }

  & .underline {
    & .color- {
      &green,
      &red,
      &blue,
      &dark-blue {
        position: absolute;
        top: -2px;
        display: inline-block;
        padding-bottom: 2px;
      }

      &green {
        border-bottom: 2px solid #426531;
      }

      &red {
        border-bottom: 2px solid #ad0000;
      }

      &blue {
        border-bottom: 2px solid #008ace;
      }

      &dark-blue {
        border-bottom: 2px solid #008ace;
      }

      & p:first-child & {
        &green,
        &red,
        &blue,
        &dark-blue {
          top: 0;
        }

      }

    }
  }
}
</style>
