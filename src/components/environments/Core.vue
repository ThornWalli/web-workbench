<template>
  <div
    class="wb-env-core"
    :class="styleClasses"
  >
    <style type="text/css" v-html="vars">
      /* empty */
    </style>
    <wb-env-screen
      ref="screen"
      :boot-sequence="screenBootSequence"
      :options="screenOptions"
      :theme="theme"
      :cursor="cursor"
      v-bind="screen"
      @toggleScreenActive="onToggleScreenActive"
    >
      <template slot="default">
        <div ref="inner" class="core__inner">
          <wb-env-molecule-header
            v-if="renderComponents && headerVisible"
            :show-cover="!ready"
            :items="headerItems"
          />
          <div ref="content" class="core__content">
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
                  class="core__symbol-wrapper"
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

import { ipoint } from '@js-basics/vector';
import { Theme } from '@/web-workbench/classes/Theme';
import { BOOT_SEQUENCE, CONFIG_NAMES as CORE_CONFIG_NAME, BOOT_DURATION } from '@/web-workbench/classes/Core/utils';
import domEvents from '@/web-workbench/services/domEvents';
import { WINDOW_POSITION } from '@/web-workbench/classes/WindowWrapper';
import Screen from '@/web-workbench/classes/modules/Screen';

import WbEnvScreen from '@/components/environments/Screen';
import WbEnvError from '@/components/environments/Error';
import WbEnvNoDisk from '@/components/environments/NoDisk';
import WbEnvMoleculeHeader from '@/components/environments/molecules/Header';
import WbEnvWindowWrapper from '@/components/environments/WindowWrapper';
import WbEnvSymbolWrapper from '@/components/environments/SymbolWrapper';

import WbModulesCoreWebDos from '@/components/modules/core/WebDos';

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
    }
  },

  data () {
    return {
      error: null,
      hasDisk: true,

      symbolsModule: this.core.modules.symbols,
      windowsModule: this.core.modules.windows,
      filesModule: this.core.modules.files,
      screenModule: null,

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
    vars () {
      const vars = this.theme.toCSSVars();
      return ':root {\n' + Object.keys(vars).map(key => `${key}: ${vars[String(key)]};`).join('\n') + '\n}';
    },
    screenBootSequence () {
      if (this.error) {
        return BOOT_SEQUENCE.ERROR;
      }
      // if (this.noDisk) {
      //   return BOOT_SEQUENCE.NO_DISK;
      // }
      return this.bootSequence;
    },
    cursor () {
      if (this.screenModule) {
        return this.screenModule.cursor;
      }
      return null;
    },
    theme () {
      if (this.screenModule) {
        return this.screenModule.currentTheme;
      }
      return new Theme();
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
        'js--ready': this.ready,
        'js--waiting': this.waiting
      };
    },
    waiting () {
      return this.core.executionCounter > 0;
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
      this.screenModule.cursor.setWait(waiting);
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

  mounted () {
    this.subscriptions = [
      domEvents.resize.subscribe(this.onResize)
    ];

    this.core.addModule(Screen, {
      contentEl: this.$refs.content
    });

    return this.core.setup().then((core) => {
      this.screenModule = core.modules.screen;
      this.webWorkbenchConfig = core.config.observable;
      this.subscriptions.push(core.errorObserver.subscribe((err) => {
        this.setError(err);
      }));
      return core;
    }).then(this.screenActiveAnimation).then(this.onReady).catch((err) => {
      this.setError(err);
    });
  },

  destroyed () {
    this.activeDisks.forEach(file => this.core.modules.files.fs.removeFloppyDisk(file));
    this.core.modules.windows.clear();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  },

  methods: {

    onToggleScreenActive (screenActive) {
      if (!this.ready && !screenActive) {
        this.hasDisk = false;
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
        result = new Promise(resolve => global.setTimeout(async () => {
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
      this.layout.position = ipoint(left, top);
      this.layout.size = ipoint(width, height);
      if (this.$refs.content) {
        this.core.modules.screen.updateContentLayout(this.$refs.content);
        this.core.modules.screen.updateScreenLayout(this.$refs.inner);
      }
    },

    async onReady (core) {
      const executionResolve = this.core.addExecution();

      await this.startBootSequence(this.webWorkbenchConfig[CORE_CONFIG_NAME.BOOT_WITH_SEQUENCE]);

      if (this.hasDisk) {
        this.bootSequence = BOOT_SEQUENCE.READY;

        this.renderComponents = true;
        this.onResize();

        this.$nextTick(async () => {
          this.core.modules.screen.updateContentLayout(this.$refs.content);
          this.core.modules.screen.updateScreenLayout(this.$refs.inner);
          this.renderSymbols = true;

          await this.boot(this.webWorkbenchConfig[CORE_CONFIG_NAME.BOOT_WITH_WEBDOS]);

          this.ready = true;
          executionResolve();
          this.$emit('ready');
        });
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

    startBootSequence (active) {
      const defaultSequences = [
        BOOT_SEQUENCE.SEQUENCE_1,
        BOOT_SEQUENCE.SEQUENCE_2,
        BOOT_SEQUENCE.SEQUENCE_3
      ];
      if (active) {
        let counter = defaultSequences.length;
        const sequence = () => {
          counter--;
          this.bootSequence = defaultSequences[defaultSequences.length - Number(counter)];
          if (counter > 0) {
            return new Promise((resolve) => {
              global.setTimeout(resolve, BOOT_DURATION);
            }).then(() => sequence());
          }
        };
        return new Promise((resolve) => {
          global.setTimeout(resolve, BOOT_DURATION / 2);
        }).then(() => sequence());
      } else {
        this.bootSequence = defaultSequences[defaultSequences.length - 1];
      }
    },

    async  boot (withWebDos) {
      await this.prepareMemory();
      await this.createBootScript(withWebDos);

      let resolve;
      if (withWebDos) {
        resolve = this.startWebDos();
      } else {
        await this.core.executeCommand('basic "TMP:BOOT.basic"');
        resolve = Promise.resolve();
      }

      resolve = resolve.then(() => this.core.executeCommands([
        'remove "TMP:BOOT.basic"',
        'mountDisk "debug"'

        // 'executeFile "DF1:WebPainting.app"'
        // 'executeFile "DF0:Editor.app"'
        // 'executeFile "DF0:ColorSettings.app"'
        // 'openSettings'
        // 'executeFile "DF0:DocumentReader.app"'
        // 'executeFile "DF2:Tests.app"'
      ]));

      return resolve;
    },

    startWebDos () {
      // eslint-disable-next-line no-unreachable
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
        bootWindow.events.subscribe(({ name }) => {
          if (name === 'close') {
            resolve();
          }
        });
      });
    },

    prepareMemory () {
      this.core.modules.parser.memory.set('FIREBASE_API_KEY', '"' + process.env.FIREBASE_API_KEY + '"');
    },

    createBootScript (withWebDos) {
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

      function sleep (duration = 1000) {
        if (withWebDos) {
          return 'SLEEP ' + duration;
        }
        return '';
      }

      const withCloundMount = true;
      const floppyDisks = [
        'workbench13',
        'extras13'
      ];
      const cloudDisks = [
        'CDLAMMPEE',
        'CDNUXT'
      ];

      lines.push(
        sleep(1000),
        'Headline("Mount Disks…")',
        sleep(1000),
        ...floppyDisks.reduce((result, disk) => {
          result.push(`mountDisk "${disk}"`, sleep(1000));
          return result;
        }, []),
        'rearrangeIcons -root'
      );

      if (withCloundMount && process.env.FIREBASE_API_KEY && process.env.FIREBASE_URL) {
        lines.push(
          sleep(1000),
          'Headline("Mount Cloud Storages…")',
          sleep(1000),
          ...cloudDisks.reduce((result, disk) => {
            result.push(`cloudMount "${disk}" --api-key="${process.env.FIREBASE_API_KEY}" --url="${process.env.FIREBASE_URL}"`, sleep(1000));
            return result;
          }, [])
        );
      }

      lines.push(
        sleep(1000),
        'PRINT ""',
        'PRINT "<b>Waiting is user experience …</b>"'
      );

      return this.core.modules.files.fs.createTmpFile('BOOT.basic', {
        type: 'basic',
        content: lines
      });
    }

  }
};
</script>

<style lang="postcss">
:root {
  --color__core__text: #fff;
}

.wb-env-core {
  color: var(--color__core__text);

  & style {
    display: none;
  }

  & .core__inner {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  & .core__symbol-wrapper {
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  &.js--ready {
    & .core__symbol-wrapper {
      opacity: 1;
    }
  }

  & > div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  & .core__content {
    flex: 1;
    height: auto;
  }
}
</style>
