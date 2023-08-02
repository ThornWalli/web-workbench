<template>
  <div class="wb-env-core" :class="styleClasses" :style="style">
    <wb-env-screen
      ref="screen"
      :boot-sequence="screenBootSequence"
      :options="screenOptions"
      :theme="theme"
      :cursor="cursor"
      v-bind="screen"
      @toggle-screen-active="onToggleScreenActive"
    >
      <template #default>
        <div ref="inner" class="inner">
          <wb-env-molecule-header v-if="renderComponents && headerVisible" :show-cover="!ready" :items="headerItems" />
          <div ref="content" class="content">
            <template v-if="renderComponents">
              <wb-env-window-wrapper
                ref="windowWrapper"
                :core="core"
                :wrapper="windowsModule.contentWrapper"
                :clamp-y="false"
                :parent-layout="layout"
              >
                <wb-env-symbol-wrapper
                  v-if="renderSymbols"
                  :parent-scrollable="false"
                  class="symbol-wrapper"
                  :clamp-symbols="true"
                  :show-storage-bar="false"
                  :parent-layout="layout"
                  :wrapper="symbolsModule.defaultWrapper"
                />
              </wb-env-window-wrapper>
            </template>
            <wb-env-no-disk v-if="showNoDisk" />
            <wb-env-error v-if="error" v-bind="error" @close="onClickError" />
          </div>
        </div>
      </template>
    </wb-env-screen>
  </div>
</template>

<script>

import { toRaw, toRef } from 'vue';
import { filter } from 'rxjs/operators';
import { ipoint } from '@js-basics/vector';
import { Subscription } from 'rxjs';

import Screen from '../classes/modules/Screen';
import { WINDOW_POSITION } from '../classes/WindowWrapper';
import domEvents from '../services/domEvents';
import { BOOT_SEQUENCE, CONFIG_NAMES as CORE_CONFIG_NAME, BOOT_DURATION } from '../classes/Core/utils';
import { Theme } from '../classes/Theme';
import defaultCursor from '../assets/svg/cursor/pointer.svg?url';
import WbEnvScreen from './Screen';
import WbEnvError from './Error';
import WbEnvNoDisk from './NoDisk';
import WbEnvMoleculeHeader from './molecules/Header';
import WbEnvWindowWrapper from './WindowWrapper';
import WbEnvSymbolWrapper from './SymbolWrapper';

import WbModulesCoreWebDos from './modules/core/WebDos';
import { useRuntimeConfig, markRaw, ref, useHead, computed } from '#imports';

export default {
  components: {
    WbEnvScreen,
    WbEnvNoDisk,
    WbEnvError,
    WbEnvWindowWrapper,
    WbEnvSymbolWrapper,
    WbEnvMoleculeHeader
  },

  props: {
    core: {
      type: Object,
      required: true
    },
    noDisk: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  emits: [
    'ready'
  ],

  setup (props) {
    const screenModule = ref();

    const theme = computed(() => {
      if (screenModule.value) {
        return screenModule.value.currentTheme;
      }
      return new Theme();
    });

    const vars = computed(() => {
      const vars = theme.value.toCSSVars();
      return ':root {\n' + Object.keys(vars).map(key => `${key}: ${vars[String(key)]};`).join('\n') + '\n}';
    });

    useHead(() => {
      return {
        style: [
          vars.value && {
            key: 'wb-core-vars',
            type: 'text/css',
            innerHTML: vars.value
          }
        ].filter(Boolean)
      };
    });
    const core = toRef(props, 'core');
    const executionCounter = core.value.executionCounter;

    return { executionCounter, screenModule, theme, vars };
  },

  data () {
    return {

      subscription: new Subscription(),

      error: null,

      symbolsModule: markRaw(this.core.modules.symbols),
      windowsModule: markRaw(this.core.modules.windows),
      filesModule: markRaw(this.core.modules.files),

      layout: {
        position: ipoint(0, 0),
        size: ipoint(0, 0)
      },

      renderComponents: false,
      renderSymbols: false,
      ready: false,
      wait: false,

      activeDisks: [],

      webWorkbenchConfig: {
        [CORE_CONFIG_NAME.BOOT_WITH_WEBDOS]: false,
        [CORE_CONFIG_NAME.BOOT_SEQUENCE]: false,
        [CORE_CONFIG_NAME.SCREEN_1084_FRAME]: true,
        [CORE_CONFIG_NAME.SCREEN_REAL_LOOK]: true,
        [CORE_CONFIG_NAME.SCREEN_SCAN_LINES]: true,
        [CORE_CONFIG_NAME.SCREEN_ACTIVE_ANIMATION]: false
      },
      screenOptions: {
        contrast: 0.5,
        brightness: 0.5,
        color: 0.5,
        sharpness: 0,
        horizontalCentering: 0.5,
        soundVolumne: 0.5
      },
      bootSequence: BOOT_SEQUENCE.SEQUENCE_1
    };
  },

  computed: {
    style () {
      return {
        '--default-cursor': `url(${defaultCursor})`

      };
    },
    showNoDisk () {
      return this.bootSequence === BOOT_SEQUENCE.NO_DISK;
    },
    horizontalCentering () {
      return this.screenOptions.horizontalCentering;
    },
    headerVisible () {
      if (this.windowsModule) {
        return this.windowsModule.contentWrapper.isHeaderVsible();
      }
      return true;
    },
    embedWindow () {
      if (this.windowsModule) {
        return this.windowsModule.contentWrapper.hasEmbbedWindow();
      }
      return false;
    },
    screenBootSequence () {
      if (this.error) {
        return BOOT_SEQUENCE.ERROR;
      }
      // if (this.noDisk) {
      // return BOOT_SEQUENCE.NO_DISK;
      // }
      return this.bootSequence;
    },
    cursor () {
      if (this.screenModule) {
        return this.screenModule.cursor;
      }
      return null;
    },
    screen () {
      return {
        frameActive: this.webWorkbenchConfig[CORE_CONFIG_NAME.SCREEN_1084_FRAME],
        hasRealLook: this.webWorkbenchConfig[CORE_CONFIG_NAME.SCREEN_REAL_LOOK],
        hasScanLines: this.webWorkbenchConfig[CORE_CONFIG_NAME.SCREEN_SCAN_LINES],
        hasActiveAnimation: this.webWorkbenchConfig[CORE_CONFIG_NAME.SCREEN_ACTIVE_ANIMATION]
      };
    },
    themeColors () {
      return this.webWorkbenchConfig[CORE_CONFIG_NAME.THEME];
    },
    hasFrame () {
      return this.webWorkbenchConfig[CORE_CONFIG_NAME.SCREEN_1084_FRAME];
    },
    styleClasses () {
      return {
        ready: this.ready,
        waiting: this.waiting
      };
    },
    waiting () {
      return this.executionCounter > 0;
    },
    headerItems () {
      return this.windowsModule.contextMenu.activeItems.items;
    }
  },

  watch: {
    horizontalCentering () {
      this.onResize();
    },
    waiting (waiting) {
      toRaw(this.screenModule.cursor).setWait(waiting);
    },
    hasFrame () {
      this.$nextTick(() => {
        this.onResize();
        this.$nextTick(() => {
          this.symbolsModule.defaultWrapper.rearrangeIcons({ root: true });
          this.windowsModule.contentWrapper.setWindowPositions(WINDOW_POSITION.CENTER);
        });
      });
    }
  },

  async mounted () {
    this.subscription.add(domEvents.resize.subscribe(this.onResize));

    this.core.addModule(Screen, {
      contentEl: this.$refs.content
    });

    const core = await this.core.setup();
    this.onResize();
    this.screenModule = core.modules.screen;
    this.webWorkbenchConfig = core.config.observable;
    this.subscription.add(core.errorObserver.subscribe((err) => {
      this.setError(err);
    }));
    await this.screenActiveAnimation();
    await this.onReady();
  },

  unmounted () {
    this.activeDisks.forEach(file => this.core.modules.files.fs.removeFloppyDisk(file));
    this.core.modules.windows.clear();
    this.subscription.unsubscribe();
  },

  methods: {

    onToggleScreenActive (screenActive) {
      if (!this.ready && !screenActive) {
        this.noDisk = true;
      }
      if (screenActive) {
        this.$nextTick(() => {
          this.onResize();
        });
      }
    },

    screenActiveAnimation () {
      let result;
      let parallel = false;
      if (this.webWorkbenchConfig[CORE_CONFIG_NAME.BOOT_WITH_SEQUENCE]) {
        result = new Promise(resolve => window.setTimeout(async () => {
          await this.$refs.screen.turnOn(1500);
          resolve();
        }, 1000));
      } else if (this.webWorkbenchConfig[CORE_CONFIG_NAME.BOOT_WITH_WEBDOS]) {
        result = this.$refs.screen.turnOn(2000);
      }

      parallel = !!result;

      if (!parallel) {
        result = this.$refs.screen.turnOn(2000).then(() => {
          return this.$refs.windowWrapper.refresh();
        }).catch((err) => {
          throw err;
        });
      }

      result
        .then(() => this.$refs.screen.togglePanel(true))
        .catch((err) => {
          throw err;
        });

      if (parallel) {
        return result;
      }
    },

    onResize () {
      const { left, top, width, height } = this.$el.getBoundingClientRect();
      this.layout = {
        position: ipoint(left, top),
        size: ipoint(width, height)
      };
      if (this.$refs.content) {
        this.core.modules.screen.updateContentLayout(this.$refs.content);
        this.core.modules.screen.updateScreenLayout(this.$refs.inner);
      }
    },

    async onReady () {
      const executionResolve = this.core.addExecution();

      const withBoot = 'no-boot' in this.$route.query ? false : this.webWorkbenchConfig[CORE_CONFIG_NAME.BOOT_WITH_SEQUENCE];
      await this.startBootSequence(withBoot);

      if (!this.noDisk) {
        this.bootSequence = BOOT_SEQUENCE.READY;

        this.onResize();
        this.renderComponents = true;

        await new Promise((resolve) => {
          this.$nextTick(async () => {
            this.core.modules.screen.updateContentLayout(this.$refs.content);
            this.core.modules.screen.updateScreenLayout(this.$refs.inner);
            this.renderSymbols = true;

            const withWebDos = 'no-webdos' in this.$route.query ? false : this.webWorkbenchConfig[CORE_CONFIG_NAME.BOOT_WITH_WEBDOS];
            await this.boot(withWebDos);

            this.ready = true;
            resolve();
          });
        });
        executionResolve();
        this.$emit('ready');
      } else {
        this.bootSequence = BOOT_SEQUENCE.NO_DISK;
      }
    },

    // Error

    onClickError () {
      this.error = null;
    },

    setError (error, userInteraction = true) {
      console.warn(error);
      const data = {
        input: 'Press left mouse button or touch to continue.',
        text: error.message,
        stack: null,
        code: `#${Math.floor(Math.random() * 99999999)}.${Math.floor(Math.random() * 99999999)}`
      };
      if (!userInteraction) {
        data.input = null;
      }
      data.userInteraction = userInteraction;
      this.error = data;
    },

    // Start Sequence & Boot

    async startBootSequence (active) {
      const defaultSequences = [
        BOOT_SEQUENCE.SEQUENCE_1,
        BOOT_SEQUENCE.SEQUENCE_2,
        BOOT_SEQUENCE.SEQUENCE_3
      ];
      if (active) {
        let counter = defaultSequences.length;
        const sequence = async () => {
          counter--;
          this.bootSequence = defaultSequences[defaultSequences.length - Number(counter)];
          if (counter > 0) {
            await new Promise((resolve) => {
              window.setTimeout(resolve, BOOT_DURATION);
            });
            await sequence();
          }
        };
        await new Promise(resolve => window.setTimeout(resolve, BOOT_DURATION / 2));
        await sequence();
      } else {
        this.bootSequence = defaultSequences[defaultSequences.length - 1];
      }
    },

    async boot (withWebDos) {
      await this.prepareMemory();
      await this.createBootScript(withWebDos);

      if (withWebDos) {
        await this.startWebDos();
      } else {
        await this.core.executeCommand('basic "TMP:BOOT.basic"');
      }

      return this.core.executeCommands([
        'remove "TMP:BOOT.basic"',
        'mountDisk "debug"'

        // 'executeFile "DF1:WebPainting.app"'
        // 'executeFile "DF0:Editor.app"'
        // 'executeFile "DF0:ColorSettings.app"'
        // 'openSettings'
        // 'executeFile "DF0:DocumentReader.app"'
        // 'executeFile "DF2:Tests.app"'
      ]);
    },

    startWebDos () {
      const bootWindow = this.windowsModule.addWindow(
        {
          title: 'WebDOS',
          component: WbModulesCoreWebDos,
          componentData: {
            core: this.core,
            command: 'basic "TMP:BOOT.basic"'
          },
          options: {
            scrollX: false,
            scrollY: true,
            scale: false,
            embed: true
          }
        }, { full: true });
      bootWindow.wrapper.centerWindow(bootWindow);

      bootWindow.focus();

      return new Promise((resolve) => {
        bootWindow.events.pipe(filter(({ name }) => name === 'close')).subscribe(resolve);
      });
    },

    prepareMemory () {
      const { firebase } = useRuntimeConfig().public;
      this.core.modules.parser.memory.set('FIREBASE_API_KEY', '"' + firebase.apiKey + '"');
    },

    createBootScript (withWebDos) {
      const { firebase } = useRuntimeConfig().public;
      const lines = [

        '// Functions',

        'SUB Separator(stars) STATIC',
        'PRINT STRING$(stars, "*")',
        'END SUB',

        'SUB Headline(title$) STATIC',
        'LET title$ = "*** " + title + " ***"',
        'PRINT ""',
        'Separator(LEN(title$))',
        'PRINT title$',
        'Separator(LEN(title$))',
        'PRINT ""',
        'END SUB',

        '// Output'

      ];

      const sleep = (duration = 1000) => withWebDos ? ('SLEEP ' + duration) : '';

      const withCloundMount = true;
      const floppyDisks = [
        'workbench13',
        'extras13',
        'examples'
      ];
      const cloudDisks = [
        'CDLAMMPEE',
        'CDNUXT'
      ];

      lines.push(
        sleep(1000),
        'Headline("Mount Disks…")',
        sleep(1000),
        ...floppyDisks.reduce((result, disk) => result.concat([
          `mountDisk "${disk}"`, sleep(1000)
        ]), []),
        'rearrangeIcons -root'
      );

      if (withCloundMount && firebase.apiKey && firebase.url) {
        lines.push(
          sleep(1000),
          'Headline("Mount Cloud Storages…")',
          sleep(1000),
          ...cloudDisks.reduce((result, disk) => {
            result.push(`cloudMount "${disk}" --api-key="${firebase.apiKey}" --url="${firebase.url}"`, sleep(1000));
            return result;
          }, [])
        );
      }

      lines.push(
        sleep(1000),
        'PRINT ""',
        'PRINT "<strong>Waiting is user experience …</strong>"'
      );

      return this.core.modules.files.fs.createTmpFile('BOOT.basic', {
        type: 'basic',
        content: lines
      });
    }

  }
};
</script>

<style lang="postcss" scoped>
.wb-env-core {
  --color-text: var(--color-core-text, #fff);

  color: var(--color-text);

  & * {
    cursor: var(--default-cursor), auto;
  }

  & style {
    display: none;
  }

  & .inner {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  &>div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  & .content {
    flex: 1;
    height: auto;
  }

  & .content>.symbol-wrapper {
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  &.ready {
    & .content>.symbol-wrapper {
      opacity: 1;
    }
  }

}
</style>
