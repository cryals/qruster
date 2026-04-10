import {themes as prismThemes} from 'prism-react-renderer';
import type {PluginConfig} from '@docusaurus/types';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'qruster',
  tagline: 'Universal selfhosted media downloader supporting 20+ platforms',
  favicon: 'img/favicon.ico',

  url: 'https://cryals.github.io',
  baseUrl: '/qruster/',

  organizationName: 'cryals',
  projectName: 'qruster',

  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
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

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'ru',
        path: 'ru-docs',
        routeBasePath: 'ru',
        sidebarPath: './sidebars.ru.ts',
        editUrl: 'https://github.com/cryals/qruster/tree/main/docs/',
      },
    ] satisfies PluginConfig,
  ],

  themeConfig: {
    image: 'img/social-card.png',
    navbar: {
      title: 'qruster',
      logo: {
        alt: 'qruster logo',
        src: 'img/logo.png',
      },
      items: [
        {
          to: '/',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'dropdown',
          label: 'Language',
          position: 'right',
          items: [
            {
              label: 'English',
              href: '/qruster/',
            },
            {
              label: 'Русский',
              href: '/qruster/ru/',
            },
          ],
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
              to: '/',
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
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    algolia: undefined,
  } satisfies Preset.ThemeConfig,
};

export default config;
