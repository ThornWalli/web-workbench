// process.env.DEBUG = 'nuxt:*';

const path = require('path');
const fs = require('fs');

const PKG_VERSION = require('./package.json').version;
const isDev = process.env.NODE_ENV === 'development';

const envPath = path.join(__dirname, 'env', 'env.json');

let env = {};
if (fs.existsSync(envPath)) {
  env = JSON.parse(fs.readFileSync(envPath, 'utf8'));
}

module.exports = {
  dev: isDev,
  srcDir: 'src/',
  css: [
    '@/assets/css/var.pcss',
    '@/assets/css/base/markdown.pcss',
    '@/assets/css/base.pcss'
  ],

  env: {
    WB_VERSION: PKG_VERSION,
    FIREBASE_API_KEY: env.FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
    FIREBASE_URL: env.FIREBASE_URL || process.env.FIREBASE_URL
  },

  mode: 'spa',

  features: {
    store: false,
    layouts: true,
    meta: true,
    middleware: true,
    transitions: true,
    deprecations: false,
    validate: true,
    asyncData: false,
    fetch: true,
    clientOnline: true,
    clientPrefetch: true,
    clientUseUrl: true,
    componentAliases: true,
    componentClientOnly: true
  },

  server: {
    host: getServerHost(),
    port: getServerPort(),
    timing: false,
    https: (function () {
      const dir = './env/cert';
      const key = path.join(dir, 'server.key');
      const crt = path.join(dir, 'server.crt');

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
    },
    analyze: false,
    filenames: {
      app: ({ isDev }) => isDev ? '[name].js' : '[name].[chunkhash].js',
      chunk: ({ isDev }) => isDev ? '[name].js' : '[name].[chunkhash].js'
    },
    babel: {
      presets ({ isServer, isModern }) {
        const targets = isServer ? { node: 'current' } : { ie: 11 };
        return [
          [
            require.resolve('@nuxt/babel-preset-app'), {
              targets,
              useBuiltIns: isModern ? 'entry' : 'usage'
            }
          ]
        ];
      }
    },
    postcss: {
      plugins: {
        'postcss-custom-media': {
          importFrom: [
            'src/globals/postcss.js'
          ]
        },
        'postcss-nesting': {},
        'postcss-normalize': {},
        'postcss-url': {},
        'postcss-object-fit-images': {},
        '@fullhuman/postcss-purgecss': {
          content: [
            'src/pages/**/*.vue',
            'src/layouts/**/*.vue',
            'src/components/**/*.vue',
            'src/assets/svg/**/*.svg'
          ],
          whitelist: [
            'html', 'body'
          ],
          whitelistPatterns: [
            /nuxt-/, /js--/, /wb-/
          ]
        },
        'postcss-momentum-scrolling': [
          'scroll'
        ],
        'rucksack-css': {},
        lost: {
          gutter: '15px',
          flexbox: 'flex',
          cycle: 'auto'
        }
      },
      preset: {
        stage: 0,
        features: {
          'custom-media-queries': false,
          'nesting-rules': false
        },
        importFrom: 'src/globals/postcss.js'
      }
    },

    parallel: false,
    transpile: [],
    crossorigin: 'anonymous'
  },

  generate: {
    dir: getDistPath()
  },

  render: {
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

  modules: [
    '@/modules/svg',
    '@/modules/analyzer',
    '@nuxtjs/axios',
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
    ],
    [
      'nuxt-font-loader-strategy', {
        ignoreLighthouse: true,
        ignoredEffectiveTypes: [
          '2g', 'slow-2g'
        ],
        fonts: [
          {
            fileExtensions: [
              'woff2', 'woff'
            ],
            fontFamily: 'Amiga Topaz 13',
            fontFaces: [
              {
                preload: true,
                src: '@/assets/fonts/Amiga-Topaz-13/Amiga-Topaz-13',
                fontWeight: 400,
                fontStyle: 'normal'
              },
              {
                src: '@/assets/fonts/Amiga-Topaz-13/Amiga-Topaz-13',
                fontWeight: 700,
                fontStyle: 'normal'
              }
            ]
          },
          {
            fileExtensions: [
              'woff2', 'woff'
            ],
            fontFamily: 'Amiga Topaz 13 Console',
            fontFaces: [
              {
                preload: true,
                src: '@/assets/fonts/Amiga-Topaz-13-Console/Amiga-Topaz-13-Console',
                fontWeight: 400,
                fontStyle: 'normal'
              },
              {
                src: '@/assets/fonts/Amiga-Topaz-13-Console/Amiga-Topaz-13-Console',
                fontWeight: 700,
                fontStyle: 'normal'
              }
            ]
          }
        ]
      }
    ]
  ],

  buildModules: [
    [
      '@nuxtjs/pwa', {
        workbox: {
          cachingExtensions: [
            '@/workbox/range-request.js'
          ],
          config: {
            CACHE_VERSION: PKG_VERSION
          }
        },
        manifest: {
          name: 'Lammpee - Web-Workbench 1.3',
          lang: 'de'
        }
      }
    ],
    [
      '@nuxtjs/sitemap', {
        path: 'sitemap.xml',
        hostname: getHost(),
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
        Sitemap: getHost() + '/sitemap.xml'
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
      { hid: 'og:url', property: 'og:url', content: getHost() + '/' },
      // { hid: 'og:description', property: 'og:description', content: '' },

      { hid: 'og:image', property: 'og:image', content: getHost().replace('https', 'http') + '/share.jpg' },
      { hid: 'og:image:secure_url', property: 'og:image:secure_url', content: getHost() + '/share.jpg' },
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

function getHost () {
  return process.env.npm_config_host || process.env.HOST || 'http://localhost:8050';
}

function getServerHost () {
  return process.env.npm_config_server_host || process.env.SERVER_HOST || 'localhost';
}

function getServerPort () {
  return process.env.npm_config_server_port || process.env.SERVER_PORT || 8050;
}
