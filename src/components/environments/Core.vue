<template>
  <wb-env-screen class="wb-env-core" :boot-sequence="screenBootSequence" :class="styleClasses" :options="screenOptions" v-bind="screen">
    <div class="core__inner">
      <wb-env-molecule-header :show-cover="!ready" :items="headerItems" />
      <div ref="content" class="core__content">
        <template v-if="ready">
          <wb-env-window-wrapper :wrapper="windowsModule.contentWrapper" :clamp-y="false">
            <wb-env-symbol-wrapper
              class="core__symbol-wrapper"
              :clamp-symbols="true"
              :show-storage-bar="false"
              :parent-layout="layout"
              :wrapper="symbolsModule.defaultWrapper"
            />
          </wb-env-window-wrapper>
          <wb-env-error v-if="error" v-bind="error" @close="onClickError" />
        </template>
      </div>
    </div>
  </wb-env-screen>
</template>

<story
  name="Core"
  group="Environments"
  knobs="{}">
  <Core />
</story>

<script>
import { ipoint } from '@js-basics/vector';
import { BOOT_SEQUENCE, CONFIG_NAMES as CORE_CONFIG_NAME } from '../../web-workbench/classes/Core';
import domEvents from '../../web-workbench/services/domEvents';
import { WINDOW_POSITION } from '../../web-workbench/classes/WindowWrapper';
import Screen from '@/web-workbench/classes/modules/Screen';

import WbEnvScreen from '@/components/environments/Screen';
import WbEnvError from '@/components/environments/Error';
import WbEnvMoleculeHeader from '@/components/environments/molecules/Header';
import WbEnvWindowWrapper from '@/components/environments/WindowWrapper';
import WbEnvSymbolWrapper from '@/components/environments/SymbolWrapper';

export default {
  components: {
    WbEnvScreen,
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
    console.log('???', this.core, this.core.modules);
    return {
      error: null,
      symbolsModule: this.core.modules.symbols,
      windowsModule: this.core.modules.windows,
      filesModule: this.core.modules.files,

      layout: {
        position: ipoint(0, 0),
        size: ipoint(0, 0)
      },

      ready: false,
      wait: false,

      activeDisks: [],

      webWorkbenchConfig: {
        [CORE_CONFIG_NAME.SCREEN_1084_FRAME]: true,
        [CORE_CONFIG_NAME.SCREEN_SCANLINES]: false
      },
      screenOptions: {
        screenActive: true
      },
      bootSequence: BOOT_SEQUENCE.SEQUENCE_5
    };
  },

  computed: {

    screenBootSequence () {
      return this.error ? BOOT_SEQUENCE.SEQUENCE_1 : this.bootSequence;
    },

    screen () {
      return {
        frameActive: this.webWorkbenchConfig[CORE_CONFIG_NAME.SCREEN_1084_FRAME],
        hasScanline: this.webWorkbenchConfig[CORE_CONFIG_NAME.SCREEN_SCANLINES]
      };
    },

    hasFrame () {
      return this.webWorkbenchConfig[CORE_CONFIG_NAME.SCREEN_1084_FRAME];
    },

    styleClasses () {
      return {
        'js--waiting': this.waiting
      };
    },
    waiting () {
      return this.core.executionCounter > 0;
    },
    headerItems () {
      return this.windowsModule.contextMenu.activeItems;
    }
  },

  watch: {
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
    this.subscribtions = [
      domEvents.resize.subscribe(this.onResize)
    ];

    this.core.addModule(Screen, {
      contentEl: this.$refs.content
    });
    this.core.setup().then((core) => {
      this.webWorkbenchConfig = core.config.observable;
      this.subscribtions.push(core.errorObserver.subscribe((err) => {
        this.setError(err);
      }));
      return core;
    }).then(this.onReady).catch((err) => {
      this.setError(err);
    });
  },

  destroyed () {
    this.activeDisks.forEach(file => this.core.modules.files.fs.removeFloppyDisk(file));
    this.core.modules.windows.clear();
    this.subscribtions.forEach(subscription => subscription.unsubscribe());
  },

  methods: {

    onResize () {
      this.layout.size = ipoint(this.$el.offsetWidth, this.$el.offsetHeight);
      this.core.modules.screen.updateContentLayout(this.$refs.content);
    },

    onClickError () {
      this.error = null;
    },
    setError (error) {
      console.error(error);
      const data = {
        input: 'Press left mouse button or touch to continue.',
        text: error.message,
        stack: null,
        code: `#${Math.floor(Math.random() * 99999999)}.${Math.floor(Math.random() * 99999999)}`
      };
      this.error = data;
    },

    async onReady (core) {
      this.ready = true;
      this.onResize();

      const examples = (await import('@/web-workbench/disks/examples')).default;
      const workbench13 = (await import('@/web-workbench/disks/workbench13')).default;
      this.activeDisks = await Promise.all([
        this.filesModule.fs.addFloppyDisk(examples({ core })),
        this.filesModule.fs.addFloppyDisk(workbench13({ core }))
      ]);

      this.$nextTick(() => {
        this.symbolsModule.defaultWrapper.rearrangeIcons({ root: true });
      });

      // Cloud
      if (process.env.FIREBASE_API_KEY && process.env.FIREBASE_URL) {
        await core.executeCommand(`cloudMount "CD0" --apiKey="${process.env.FIREBASE_API_KEY}" --url="${process.env.FIREBASE_URL}"`);
      }
      // await core.executeCommand('cloudAuth -login --email="lammpee@gmail.com" --password="XXXX" --storage="CD0"');

      // Windows
      // eslint-disable-next-line promise/catch-or-return
      // Promise.all([

      //   // core.executeCommand('openDialog "File saved." "test"'),
      //   // core.executeCommand('executeFile "DF0:Cloud.info"')
      //   // core.executeCommand('executeFile "DF0:Editor.info"')
      //   // core.executeCommand('executeFile "DF0:Calculator.info"')
      //   // core.executeCommand('executeFile "DF0:Clock.info"')
      //   // core.executeCommand('saveFileDialog')
      //   // core.executeCommand('openFileDialog')
      //   // core.executeCommand('openDialog "File saved."'),
      //   // core.executeCommand('openDialog "File could not be saved."')
      //   // core.executeCommand('openDirectory "HD0:"'),
      //   // core.executeCommand('makefile "RAM:Test.info" --data="' + (await btoa(JSON.stringify({
      //   //   test: 2000,
      //   //   test2: 'Convallis rutrum unde cubilia cupidatat euismod quis doloribus nam etiam, per placerat cras exercitation, totam, a doloremque! Scelerisque torquent tempus.'
      //   // }))) + '" ')
      // ]);

      // Windows
      // await Promise.all([
      //   core.executeCommand('openDirectory "RAM:"'), core.executeCommand('openDirectory "TMP:"')
      // ]);

      // this.core.modules.windows.contentWrapper.setWindowPositions(WINDOW_POSITION.SPLIT_VERTICAL);

      // [

      //   {
      //     title: 'Cloud',
      //     component: WbModuleFilesCloud,
      //     componentData: {
      //       core
      //     },
      //     options: {
      //       scrollX: false,
      //       scrollY: false,
      //       scale: false
      //     }
      //   }
      //   // {
      //   //   title: 'Debug',
      //   //   component: WbModuleCoreDebug,
      //   //   componentData: {
      //   //     core
      //   //   },
      //   //   options: {
      //   //     scrollX: false,
      //   //     scrollY: false
      //   //   }
      //   // }
      //   // {
      //   //   title: 'Console',
      //   //   component: WbComponentsConsole,
      //   //   componentData: {
      //   //     startCommand: 'openDialog "Ok to Initialize volume\nRAM DISK\n(all data will be erased) ?" --title="Dialog Title" --apply="Yes" --abort="No" -prompt'
      //   //   },
      //   //   layout: {
      //   //     position: ipoint(400, 400),
      //   //     size: ipoint(640, 400)
      //   //   },
      //   //   scrollX: false
      //   // }
      // ].map(window => this.windowsModule.addWindow(window, { full: false })).forEach((window) => {
      //   // window.wrapper.centerWindow(window);
      // });
    }
  }
};
</script>

<style lang="postcss">
.wb-env-core {
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

  & > * {
    width: 100%;
  }

  & * {
    cursor: url("~assets/img/cursor/pointer.png"), auto;
  }

  &.js--waiting {
    & * {
      cursor: url("~assets/img/cursor/wait.png"), auto;
    }
  }

  & .core__symbol-wrapper {
    width: 100%;
    height: 100%;
  }

  & .core__content {
    flex: 1;
    height: auto;
  }
}
</style>
