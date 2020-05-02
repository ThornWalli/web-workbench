<template>
  <span
    class="wb-disks-mooncity-atoms-label"
    :class="{
      warning: false,
      transparent: false,
      flat: false,
      highlight: false,
      embed: false,
      static: false,
    }"
  >

    <slot>{{ content }}</slot>

  </span>
</template>

<script>
export default {
  props: {
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    static: { type: Boolean, default: false },
    oneClick: { type: Boolean, default: false },

    before: { type: String, default: null },
    color: { type: String, default: null },
    inputName: { type: String, default: null },
    group: { type: String, default: null },
    value: { type: String, default: null },
    content: { type: String, default: null }
  }
};
</script>

<style lang="postcss">
.wb-disks-mooncity-atoms-label {
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
}
</style>
