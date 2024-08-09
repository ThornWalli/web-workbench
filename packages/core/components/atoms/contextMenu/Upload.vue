<template>
  <li class="wb-env-atom-context-menu-upload">
    <div class="inner">
      <span class="title">{{ title }}</span>
      <span v-if="hotKey" class="hotkey">
        <svg-control-context-input-hotkey /> {{ hotKey }}
      </span>
      <input :accept="accept" type="file" @change="onChange" />
    </div>
  </li>
</template>

<script>
import { Subscription } from 'rxjs';
import domEvents from '@web-workbench/core/services/domEvents';
import SvgControlContextInputHotkey from '../../../assets/svg/control/context_item_hotkey.svg?component';

export default {
  components: { SvgControlContextInputHotkey },

  props: {
    title: { type: String, default: 'Item Title' },
    hotKey: { type: String, default: null },
    action: { type: Function, default: null }
  },

  emits: ['files'],

  data() {
    return {
      accept: 'application/json',
      subscription: new Subscription()
    };
  },

  mounted() {
    this.optionsWrapper = this.options;
    this.$nextTick(() => {
      if (this.hotKey) {
        this.subscription.add(
          domEvents.keyDown.subscribe(e => {
            if (
              domEvents.cmdActive &&
              this.hotKey?.charCodeAt(0) === e.keyCode
            ) {
              this.executeAction();
            }
          })
        );
      }
    });
  },
  unmounted() {
    this.subscription.unsubscribe();
  },
  methods: {
    onChange(e) {
      const target = e.target;
      const files = Array.from((e.dataTransfer || e.target).files);
      target.value = null;
      if (this.action) {
        this.action(files);
      } else {
        this.$emit('files', files);
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-env-atom-context-menu-upload {
  position: relative;

  --color-background: var(--color-context-menu-item-background, #fff);
  --color-hotkey: var(--color-context-menu-item-hotkey, #05a);
  --color-title: var(--color-context-menu-item-label, #05a);

  & > .inner {
    display: flex;
    flex-flow: row wrap;
    flex-wrap: nowrap;
    justify-content: flex-end;
    width: 100%;
    height: 20px;
    padding: 3px 4px;
    padding-bottom: 0;
    line-height: 16px;
    color: var(--label);
    text-decoration: none;
    white-space: nowrap;
    appearance: none;
    background: var(--color-background);
    border: none;
    outline: none;

    & > .title {
      display: block;
      flex: 1;
      color: var(--color-title);
      text-align: left;
    }

    & > .hotkey {
      display: inline-block;

      /* float: right; */
      justify-content: flex-end;
      padding-left: 10px;

      & svg {
        position: relative;
        top: -1px;
        display: inline-block;

        & :deep(.svg-primary) {
          fill: var(--color-hotkey);
        }
      }
    }
  }

  & input {
    position: absolute;
    inset: 0;
    opacity: 0;
  }

  .wb-atom-context-menu & {
    &:not(.disabled):hover > .inner,
    &:not(.disabled):active > .inner,
    &:not(.disabled).force-visible > .inner {
      /* padding-bottom: 1px; */
      filter: var(--filter-default);
    }
  }
}
</style>
