<template>
  <label
    class="wb-disks-mooncity-atoms-label-set"
    :class="styleClasses"
    :style="style"
  >

    <span v-if="label" class="label-set__label">{{ label }}</span>
    <template v-if="settable">
      <input v-model="checked" type="checkbox" :disabled="disabled">
      <span class="label-set__checkbox" />
    </template>

  </label>
</template>

<script>
import { COLORS } from '../../../../web-workbench/disks/mooncity/utils';
export default {
  props: {
    label: { type: String, default: 'Label' },
    labelColor: { type: String, default: 'gray' },
    value: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    isFlat: { type: Boolean, default: false },
    isEmbedded: { type: Boolean, default: false },
    isHighlight: { type: Boolean, default: false },
    isStatic: { type: Boolean, default: false },
    settable: { type: Boolean, default: true },
    toggle: { type: Boolean, default: false },
    checkboxColor: {
      type: String,
      default: 'red' // red, green
    }
  },

  data () {
    return {
      checked: false
    };
  },

  computed: {
    style () {
      return {
        '--label-color': COLORS[String(this.labelColor)]
      };
    },
    styleClasses () {
      return {
        'label-set--disabled': this.disabled,
        'label-set--label': !!this.label,
        'label-set--settable': this.settable,
        'label-set--flat': this.isFlat,
        'label-set--static': this.isStatic,
        'label-set--embedded': this.isEmbedded,
        'label-set--highlight': this.isHighlight,
        [`label-set--checkbox-${this.checkboxColor}`]: true
      };
    }
  }
};
</script>

<style lang="postcss">
.wb-disks-mooncity-atoms-label-set {
  --label-color: #fff;
  --label-checkbox-position: 0 0;
  --label-checkbox-position-checked: 0 0;

  display: flex;

  &.label-set--label {
    padding: 2px 1px 2px 2px;
  }

  &.label-set--disabled {
    pointer-events: none;
  }

  font-size: 10px;
  line-height: 10px;
  user-select: none;
  background: #212031;
  border: solid #8c8a9c 2px;
  border-right-color: #424552;
  border-bottom-color: #424552;
  box-shadow: 2px 2px 0 0 #212031;

  & input {
    display: none;
  }

  &.label-set--checkbox-red {
    --label-checkbox-position: -6px 0;
  }

  &.label-set--checkbox-green {
    --label-checkbox-position: -12px 0;
  }

  & .label-set__label {
    flex: 1;
    color: var(--label-color);
  }

  &.label-set--embedded {
    background: #212031;
    border-top-color: #000;
    border-right-color: #bdbace;
    border-bottom-color: #bdbace;
    border-left-color: #000;
    box-shadow: none;
  }

  &.label-set--highlight {
    background: #212031;
    border-top-color: #8c8a9c;
    border-right-color: #424552;
    border-bottom-color: #424552;
    border-left-color: #8c8a9c;
  }

  &.label-set--static {
    border-top-color: #bbc;
    border-right-color: #889;
    border-bottom-color: #889;
    border-left-color: #bbc;
    box-shadow: 2px 2px 0 #223, 2px 2px 0 #555 inset;
  }

  &.label-set--flat {
    box-shadow: none;
  }

  &.label-set--settable {
    & .label-set__label + input + .label-set__checkbox {
      border: none;
    }

    & input:checked + .label-set__checkbox {
      background-position: var(--label-checkbox-position);
    }

    & .label-set__checkbox {
      box-sizing: content-box;
      float: right;
      width: 6px;
      height: 10px;
      margin-left: 0;
      background-image: url('~assets/disks/mooncity/img/controls//label_checkbox.png');
      background-position: 0 0;
      border-top: solid #424552 2px;
      border-right: solid #bdbace 2px;
      border-bottom: solid #bdbace 2px;
      border-left: solid #424552 2px;
    }

    &.rounded {
      width: 6px;
      height: 14px;
      padding: 0;
      vertical-align: top;
      background-image: url('~assets/disks/mooncity/img/controls//rounded_checkbox.png');
      background-position: 0 -14px;
      border-radius: 0 0 0 6px;

      /* border-color: #bdbace #8c8a9c #8c8a9c #bdbace;border-colorborder-color */
    }
  }

}

/* .wb-disks-mooncity-atoms-label-set {
  box-sizing: content-box;
  display: inline-block;
  padding: 2px 1px 2px 2px;
  font-size: 10px;
  line-height: 10px;
  vertical-align: top;
  background: #000;
  border: solid #8c8a9c 2px;
  border-right-color: #424552;
  border-bottom-color: #424552;
  box-shadow: 2px 2px 0 0 #212031;

  & > span {
    display: inline-block;
    line-height: 10px;
  }

  &.embedded {
    background: #212031;
    border-top-color: #000;
    border-right-color: #bdbace;
    border-bottom-color: #bdbace;
    border-left-color: #000;
    box-shadow: none;
  }

  &.highlight {
    background: #212031;
    border-top-color: #8c8a9c;
    border-right-color: #424552;
    border-bottom-color: #424552;
    border-left-color: #8c8a9c;
  }

  &.flat {
    box-shadow: none;
  }

  & > .value {
    float: right;
    height: 10px;
    background: #000;
  }

  &.transparent {
    background: none;
    border: none;
    box-shadow: none;
  }

  &.static {
    border-top-color: #bbc;
    border-right-color: #889;
    border-bottom-color: #889;
    border-left-color: #bbc;
    box-shadow: 2px 2px 0 #223, 2px 2px 0 #555 inset;
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

  --color-label-progressbar-value: #c00;

  & .progress-bar {
    position: relative;
    display: inline-block;
    width: 94px;
    height: 6px;
    margin-top: 2px;
    margin-right: 2px;
    background: #667;

    & > .value {
      position: absolute;
      top: 0;
      left: 0;
      display: inline-block;
      width: 0;
      height: 100%;
      background: var(--color-label-progressbar-value);
    }
  }
} */
</style>
