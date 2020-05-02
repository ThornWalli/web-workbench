<template>
  <div class="wb-disks-mooncity-molecules-navigation">
    <ul>
      <li v-for="(item, index) in items" :key="index" :class="['navigation__button', 'navigation__button--' + item.name]">
        <button />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      items: [
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
        },
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
      background: url(~assets/img/disks/mooncity/navigation.png);
      background-position: 0 -50px;
    }

    &::after {
      display: block;
      width: 10px;
      height: 50px;
      content: "";
      background: url(~assets/img/disks/mooncity/navigation.png);
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
        background: url(~assets/img/disks/mooncity/navigation.png);
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

    & button {
      width: 48px;
      height: 50px;
      padding: 0;
      margin: 0;
      background: url(~assets/img/disks/mooncity/navigation.png);
      border: none;

      &::before {
        display: block;
        width: 48px;
        height: 50px;
        content: "";
        background: url(~assets/img/disks/mooncity/navigation.png);
        background-position: calc((var(--button-index)) * -48px)  calc(-100px + var(--button-type) * -50px);
      }
    }

  }
}
</style>
