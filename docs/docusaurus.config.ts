import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Media Downloader',
  tagline: 'Universal selfhosted media downloader supporting 20+ platforms',
  favicon: 'img/favicon.ico',

  url: 'https://cryals.github.io',
  baseUrl: '/qruster/',

  organizationName: 'cryals',
  projectName: 'qruster',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
      },
      ru: {
        label: 'Русский',
        direction: 'ltr',
        htmlLang: 'ru-RU',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/cryals/qruster/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    navbar: {
      title: 'Media Downloader',
      logo: {
        alt: 'Media Downloader Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/cryals/qruster',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/concept',
            },
            {
              label: 'Installation',
              to: '/installation',
            },
            {
              label: 'API Reference',
              to: '/api',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/cryals/qruster',
            },
            {
              label: 'Issues',
              href: 'https://github.com/cryals/qruster/issues',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Supported Platforms',
              to: '/platforms',
            },
            {
              label: 'Development Guide',
              to: '/development',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Media Downloader. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['rust', 'typescript', 'bash', 'json', 'toml'],
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    algolia: undefined,
  } satisfies Preset.ThemeConfig,
};

export default config;
