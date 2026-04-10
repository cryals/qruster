import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: '🏠 Введение',
    },
    {
      type: 'category',
      label: '🚀 Начало работы',
      items: [
        'concept',
        'installation',
        'usage',
      ],
    },
    {
      type: 'category',
      label: '🏗️ Архитектура',
      items: [
        'architecture',
        'api',
      ],
    },
    {
      type: 'category',
      label: '💻 Разработка',
      items: [
        'development',
        'platforms',
      ],
    },
  ],
};

export default sidebars;
