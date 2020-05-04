<template>
  <form class="wb-disks-mooncity-molecules-navigation">
    <ul>
      <li v-for="item in navigation" :key="item.name" :class="['navigation__button', 'navigation__button--' + item.name]">
        <router-link :to="`/${item.name}`" @click.native="onClickNavigationItem">
          <span />
        </router-link>
      </li>
      <li v-for="(item, index) in actions" :key="index" :class="['navigation__button', 'navigation__button--' + item.name]">
        <button />
      </li>
    </ul>
  </form>
</template>

<script>
// import soundPlayer, { NAMES as TRACK_NAMES } from '../../../../web-workbench/disks/mooncity/lib/service/soundPlayer';
export default {
  props: {
    navigation: {
      type: Array,
      default () {
        return [
          {
            title: 'Shop',
            name: 'shop'
          },
          {
            title: 'City',
            name: 'city'
          },
          {
            title: 'State',
            name: 'state'
          },
          {
            title: 'Weapon',
            name: 'weapon'
          }
        ];
      }
    }
  },
  data () {
    return {
      actions: [
        {
          title: 'Action',
          name: 'action'
        },
        {
          title: 'Save',
          name: 'save'
        }
      ]
    };
  },
  methods: {
    onClickNavigationItem () {
      this.$emit('navigationItem');
    }
  }
};
</script>

<style lang="postcss">
.wb-disks-mooncity-molecules-navigation {
  & ul {
    display: flex;
    padding: 0;
    margin: 0;

    &::before {
      display: block;
      width: 10px;
      height: 50px;
      content: "";
      background: url(~assets/disks/mooncity/img/navigation.png);
      background-position: 0 -50px;
    }

    &::after {
      display: block;
      width: 10px;
      height: 50px;
      content: "";
      background: url(~assets/disks/mooncity/img/navigation.png);
      background-position: -18px -50px;
    }

  }

  & .navigation__button {
    --button-index: 0;
    --button-type: 0;

    display: flex;

    &:not(:first-child) {
      &::before {
        display: block;
        width: 8px;
        height: 50px;
        content: "";
        background: url(~assets/disks/mooncity/img/navigation.png);
        background-position: -10px -50px;
      }
    }

    &.navigation__button--shop {
      --button-index: 1;
    }

    &.navigation__button--city {
      --button-index: 2;
    }

    &.navigation__button--state {
      --button-index: 3;
    }

    &.navigation__button--weapon {
      --button-index: 4;

    }

    &.navigation__button--action {
      --button-type: 1;
      --button-index: 0;

    }

    &.navigation__button--save {
      --button-index: 5;

    }

    & a {
      &.router-link-exact-active span::after {
        --selected: 1;
      }

      & span {
        &::after {
          position: absolute;
          top: 0;
          left: 0;
          display: block;
          width: 100%;
          height: 100%;
          content: "";
          background: url(~assets/disks/mooncity/img/navigation.png);
          background-position: calc(-48px * (1 + var(--selected))) calc(1 * -50px);
        }
      }
    }

    & button,
    & a > span {
      position: relative;
      display: block;
      width: 48px;
      height: 50px;
      padding: 0;
      margin: 0;
      background: url(~assets/disks/mooncity/img/navigation.png);
      border: none;
      outline: none;

      --selected: 0;

      &:hover,
      &.js--selected {
        --selected: 1;
      }

      &::before {
        display: block;
        width: 100%;
        height: 100%;
        content: "";
        background: url(~assets/disks/mooncity/img/navigation.png);
        background-position: calc((var(--button-index)) * -48px)  calc(-100px + var(--button-type) * -50px);
      }
    }

  }
}
</style>
