import { join, resolve } from 'pathe';
import { defineNuxtConfig } from 'nuxt/config';
import { joinURL, withHttps } from 'ufo';
import { readPackage } from 'read-pkg';
import { config } from 'dotenv-mono';
import svgLoader from 'vite-svg-loader';
import viteMkcert from 'vite-plugin-mkcert';
import { existsSync } from 'fs';

config();

const buildTimestamp = Date.now();
const isDev = process.env.NODE_ENV === 'development';

const pkg = await readPackage({ cwd: resolve(process.cwd(), '../..') });

function getAliases() {
  return Object.fromEntries(
    Object.entries({
      ['@web-workbench/core']: 'core',
      ['@web-workbench/disk-workbench13']: 'disk-workbench13',
      ['@web-workbench/disk-extras13']: 'disk-extras13',
      ['@web-workbench/disk-synthesizer']: 'disk-synthesizer',
      ['@web-workbench/disk-moon-city']: 'disk-moon-city',
      ['@web-workbench/disk-debug']: 'disk-debug'
    })
      .map(([name, packageName]) => {
        return [
          [name, resolve(__dirname, '../', packageName)],
          [join(name, '*'), resolve(__dirname, '../', packageName, '*')]
        ];
      })
      .flat()
  );
}

export default defineNuxtConfig({
  compatibilityDate: '2024-07-07',

  dev: isDev,

  srcDir: './src',

  css: ['@web-workbench/core/style.pcss'],

  imports: {
    autoImport: false
  },

  runtimeConfig: {
    public: {
      version: pkg.version,
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        url: process.env.FIREBASE_URL
      }
    }
  },

  ssr: true,

  devServer: {
    port: getPort(),
    host: getHost(),
    https: getHttps()
  },

  alias: {
    ...getAliases()
  },
  build: {
    transpile: ['rxjs']
  },

  vite: {
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: `_nuxt/${buildTimestamp}/[hash].js`,
          entryFileNames: `_nuxt/${buildTimestamp}/[hash].js`,
          assetFileNames: `_nuxt/${buildTimestamp}/[hash].[ext]`
        }
      }
    },
    assetsInclude: ['**/*.md'],
    plugins: [
      viteMkcert({
        savePath: './.certs',
        force: !getHttps()
      }),
      svgLoader({
        defaultImport: 'component'
      })
    ]
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
      // '@fullhuman/postcss-purgecss': {
      //   content: [
      //     'src/pages/**/*.vue',
      //     'src/layouts/**/*.vue',
      //     'src/components/**/*.vue',
      //     'src/assets/svg/**/*.svg'
      //   ],
      //   safelist: [
      //     'html', 'body', /^nuxt/, /js--/, /wb-/, /wb_/
      //   ]
      // },
      'rucksack-css': {},
      cssnano: {
        preset: [
          'default',
          {
            discardDuplicates: false,
            mergeRules: false
          }
        ]
      }
    },
    order: 'cssnanoLast'
  },

  critters: {
    config: {
      reduceInlineStyles: false,
      inlineFonts: true
    }
  },

  app: {
    baseURL: getBaseUrl(),
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'Lammpee',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },

        { key: 'og:site_name', property: 'og:site_name', content: 'Lammpee' },
        { key: 'og:type', property: 'og:type', content: 'website' },

        { name: 'title', content: 'Lammpee.de' },
        { name: 'description', content: 'Old operating system as homepage.' },
        // { name: 'description', content: '' },
        { key: 'og:title', property: 'og:title', content: 'Lammpee.de' },
        {
          name: 'og:description',
          content: 'Old operating system as homepage.'
        },
        {
          key: 'og:url',
          property: 'og:url',
          content: joinURL(getWebsiteHost(), getBaseUrl())
        },

        {
          key: 'og:image',
          property: 'og:image',
          content: withHttps(
            joinURL(getWebsiteHost(), getBaseUrl(), 'share.jpg')
          )
        },
        {
          key: 'og:image:secure_url',
          property: 'og:image:secure_url',
          content: joinURL(getWebsiteHost(), getBaseUrl(), 'share.jpg')
        },
        { key: 'og:image:width', property: 'og:image:width', content: 1200 },
        { key: 'og:image:height', property: 'og:image:height', content: 630 },
        {
          key: 'og:image:type',
          property: 'og:image:type',
          content: 'image/jpeg'
        },
        { key: 'theme-color', name: 'theme-color', content: '#000000' }
      ]
    }
  },

  modules: [
    '@nuxt/eslint',
    '@nuxtjs/critters',
    [
      '@nuxtjs/sitemap',
      {
        path: 'sitemap.xml',
        hostname: joinURL(getWebsiteHost(), getBaseUrl()),
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
      '@nuxtjs/robots',
      {
        UserAgent: '*',
        Disallow: '',
        Sitemap: joinURL(getWebsiteHost(), getBaseUrl(), 'sitemap.xml')
      }
    ]
  ],

  typescript: {
    typeCheck: true
  }
});

function getBaseUrl() {
  return process.env.npm_config_base_url || process.env.BASE_URL || '/';
}

function getWebsiteHost() {
  return (
    process.env.npm_config_website_host ||
    process.env.WEBSITE_HOST ||
    'http://localhost:8050'
  );
}

function getHost() {
  return process.env.npm_config_host || process.env.HOST || 'localhost';
}

function getPort() {
  return Number(process.env.npm_config_port || process.env.PORT || 8050);
}

function getHttps() {
  if (existsSync('./.certs/cert.pem') && existsSync('./.certs/dev.pem')) {
    return {
      cert: './.certs/cert.pem',
      key: './.certs/dev.pem'
    };
  }
  return false;
}
