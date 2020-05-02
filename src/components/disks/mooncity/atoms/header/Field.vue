<template>
  <span
    class="wb-disks-mooncity-atoms-header-field"
  >{{ label }}: {{ value }}</span>
</template>

<script>
export default {
  props: {
    label: { type: String, default: null },
    value: { type: String, default: null }
  }
};
</script>

<style lang="postcss">
.wb-disks-mooncity-atoms-header-field {
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
