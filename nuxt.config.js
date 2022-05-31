import fs from 'fs';
import { resolve, join } from 'path';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import nuxtBabelPresetApp from '@nuxt/babel-preset-app';
import { joinURL } from 'ufo';
import pkg from './package.json';

const PKG_VERSION = process.env.nextRelease || pkg.version;
const isDev = process.env.NODE_ENV === 'development';

export default {
  dev: isDev,
  srcDir: 'src/',
  css: [
    '@/assets/css/fonts.pcss',
    '@/assets/css/var.pcss',
    '@/assets/css/base/markdown.pcss',
    '@/assets/css/base.pcss'
  ],

  env: {
    WB_VERSION: PKG_VERSION,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_URL: process.env.FIREBASE_URL
  },

  ssr: false,
  target: 'static',

  server: {
    host: getHost(),
    port: getPort(),
    timing: false,
    https: (function () {
      const dir = './env/cert';
      const key = join(dir, 'server.key');
      const crt = join(dir, 'server.crt');

      if (fs.existsSync(key) && fs.existsSync(crt)) {
        return { key: fs.readFileSync(key), cert: fs.readFileSync(crt) };
      } else {
        return null;
      }
    })()
  },

  modern: isDev ? false : 'client',

  build: {

    extend (config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map';
      }
      config.module.rules.push(
        {
          test: /\.md$/i,
          use: 'raw-loader'
        }
      );
      config.module.rules.push(
        {
          test: /\.ogg$/i,
          use: 'file-loader'
        }
      );
    },
    analyze: false,
    filenames: {
      app: ({ isDev }) => isDev ? '[name].js' : '[name].[chunkhash].js',
      chunk: ({ isDev }) => isDev ? '[name].js' : '[name].[chunkhash].js'
    },
    babel: {
      presets ({ isServer, isModern }) {
        const targets = isServer ? { node: 'current' } : { };
        return [
          [
            nuxtBabelPresetApp, {
              targets,
              useBuiltIns: isModern ? 'entry' : 'usage',
              corejs: { version: 3 }
            }
          ]
        ];
      }
    },

    postcss: {
      plugins: {
        'postcss-preset-env': {
          preserve: true,
          stage: 0,
          importFrom: 'src/globals/postcss.js',
          features: {
            'custom-properties': {
              disableDeprecationNotice: true
            },
            'nesting-rules': true
          }
        },
        'postcss-normalize': {},
        '@fullhuman/postcss-purgecss': {
          content: [
            'src/pages/**/*.vue',
            'src/layouts/**/*.vue',
            'src/components/**/*.vue',
            'src/assets/svg/**/*.svg'
          ],
          safelist: [
            'html', 'body', /^nuxt/, /js--/, /wb-/, /wb_/
          ]
        },
        'rucksack-css': {},
        cssnano: {
          preset: [
            'default', {
              discardDuplicates: false,
              mergeRules: false
            }
          ]
        }
      },
      order: 'cssnanoLast'
    },

    parallel: false
  },

  generate: {
    dir: getDistPath()
  },

  render: {
    crossorigin: 'anonymous',
    resourceHints: true,
    http2: { push: true }
  },

  router: {
    base: getBasePath(),
    prefetchLinks: true
  },

  plugins: [
    { src: '@/plugins/sw-client.js', mode: 'client' }
  ],

  extend (config) {
    if (hasBuildAnalyze()) {
      config.plugins.push(new BundleAnalyzerPlugin({
        reportFilename: resolve(`.reports/webpack/${config.name}.html`),
        statsFilename: resolve(`.reports/webpack/stats/${config.name}.json`),
        analyzerMode: 'static',
        generateStatsFile: true,
        openAnalyzer: false,
        logLevel: 'info',
        defaultSizes: 'gzip',
        statsOptions: 'normal'
      }));
    }
  },

  modules: [
    [
      '@nuxtjs/dotenv', { path: __dirname }
    ],
    '@/modules/svg',
    [
      'nuxt-polyfill', {
        features: [
          {
            require: 'requestidlecallback',
            detect: () => 'requestIdleCallback' in window
          }
        ]
      }
    ],
    [
      '@/modules/licence', {
        perChunkOutput: false,
        unacceptableLicenseTest: licenseType => (licenseType === 'GPL'),
        handleMissingLicenseText: (packageName) => {
          return 'NO LICENSE TEXT: ' + packageName;
        },
        licenseTextOverrides: {
          'regenerator-runtime': `MIT License

            Copyright (c) 2014-present, Facebook, Inc.

            Permission is hereby granted, free of charge, to any person obtaining a copy
            of this software and associated documentation files (the "Software"), to deal
            in the Software without restriction, including without limitation the rights
            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
            copies of the Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions:

            The above copyright notice and this permission notice shall be included in all
            copies or substantial portions of the Software.

            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
            IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
            AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
            LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
            OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.`,
          consola: 'MIT License',
          'intersection-observer': 'W3C Software and Document License',
          requestidlecallback: 'MIT License',
          'vue-browserupdate': 'MIT License',
          isarray: 'MIT License',
          '@firebase/app': 'Apache License 2.0',
          '@firebase/component': 'Apache License 2.0',
          '@firebase/logger': 'Apache License 2.0',
          '@firebase/util': 'Apache License 2.0',
          '@firebase/database': 'Apache License 2.0',
          'firebase/database': 'Apache License 2.0',
          'firebase/auth': 'Apache License 2.0',
          'firebase/app': 'Apache License 2.0'
        }
      }
    ]
  ],

  buildModules: [
    '@nuxt/postcss8',
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
    [
      '@nuxtjs/pwa', {
        workbox: {
          cachingExtensions: [
            '@/workbox/range-request.js'
          ],
          config: {
            CACHE_VERSION: getPWACacheVersion()
          }
        },
        manifest: {
          name: 'Lammpee.de',
          short_name: 'Lammpee.de',
          lang: 'de'
        }
      }
    ],
    [
      '@nuxtjs/sitemap', {
        path: 'sitemap.xml',
        hostname: getWebsiteHost(),
        cacheTime: 1000 * 60 * 15,
        gzip: false,
        exclude: [],
        routes: [],
        defaults: {
          changefreq: 'daily',
          priority: 1,
          lastmod: new Date(),
          lastmodrealtime: true
        }
      }
    ],
    [
      '@nuxtjs/robots', {
        UserAgent: '*',
        Disallow: '',
        Sitemap: joinURL(getWebsiteHost(), 'sitemap.xml')
      }
    ]
  ],

  head: {
    title: 'Lammpee',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },

      { hid: 'og:site_name', property: 'og:site_name', content: 'Lammpee' },
      { hid: 'og:type', property: 'og:type', content: 'website' },

      { name: 'title', content: 'Lammpee.de' },
      // { name: 'description', content: '' },
      { hid: 'og:title', property: 'og:title', content: 'Lammpee.de' },
      { hid: 'og:url', property: 'og:url', content: getWebsiteHost() },
      // { hid: 'og:description', property: 'og:description', content: '' },

      { hid: 'og:image', property: 'og:image', content: joinURL(getWebsiteHost().replace('https', 'http'), 'share.jpg') },
      { hid: 'og:image:secure_url', property: 'og:image:secure_url', content: joinURL(getWebsiteHost(), 'share.jpg') },
      { hid: 'og:image:width', property: 'og:image:width', content: 1200 },
      { hid: 'og:image:height', property: 'og:image:height', content: 630 },
      { hid: 'og:image:type', property: 'og:image:type', content: 'image/png' },
      { hid: 'theme-color', name: 'theme-color', content: '#000000' }
    ],
    link: [
      {
        rel: 'shortcut icon',
        type: 'image/png',
        href: 'favicon.png'
      }, {
        hid: 'preload-amiga-topaz-13',
        rel: 'preload',
        as: 'font',
        href: '@/assets/fonts/Amiga-Topaz-13/Amiga-Topaz-13.woff2',
        type: 'font/woff2'
      }, {
        hid: 'preload-amiga-topaz-13-console',
        rel: 'preload',
        as: 'font',
        href: '@/assets/fonts/Amiga-Topaz-13-Console/Amiga-Topaz-13-Console.woff2',
        type: 'font/woff2'
      }
    ]
  }
};

function getDistPath () {
  return process.env.npm_config_dist || process.env.DIST_PATH || 'dist';
}

function getBasePath () {
  return process.env.npm_config_base || process.env.BASE_PATH || '/';
}

function getPWACacheVersion () {
  return process.env.PWA_CACHE_VERSION || PKG_VERSION;
}

function getWebsiteHost () {
  return process.env.npm_config_website_host || process.env.WEBSITE_HOST || 'http://localhost:8050';
}

function getHost () {
  return process.env.npm_config_host || process.env.HOST || 'localhost';
}

function getPort () {
  return process.env.npm_config_port || process.env.PORT || 8050;
}

function hasBuildAnalyze () {
  return process.env.npm_config_build_analyze || process.env.BUILD_ANALYZE;
}
