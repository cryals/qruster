import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: '🏠 Introduction',
    },
    {
      type: 'category',
      label: '🚀 Getting Started',
      items: [
        'concept',
        'installation',
        'usage',
      ],
    },
    {
      type: 'category',
      label: '🏗️ Architecture',
      items: [
        'architecture',
        'api',
      ],
    },
    {
      type: 'category',
      label: '💻 Development',
      items: [
        'development',
        'platforms',
      ],
    },
  ],
};

export default sidebars;
