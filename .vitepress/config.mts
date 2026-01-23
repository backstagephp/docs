import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Backstage",
  description: "CMS done the Laravel way",
  themeConfig: {
    search: {
      provider: 'local',
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Quick start', link: '/quick-start' },
          { text: 'Installation', link: '/installation' },
          { text: 'Upgrade', link: '/upgrade' }
        ]
      },
      {
        text: 'Content',
        items: [
          {
            text: 'Introduction', link: '/01-content/01-introduction',
            items: [
              { text: 'Urls', link: '/01-content/02-urls' },
              { text: 'Query scopes', link: '/01-content/03-scopes' },
            ]
          },
          {
            text: 'Types', link: '/02-types/01-introduction',
            items: [
              { text: 'Configuring Types', link: '/02-types/02-configuring-types' },
            ]
          },
          { text: 'Fields', link: '/03-fields/01-introduction' },
          { text: 'Blocks', link: '/04-blocks/01-introduction' },
          { text: 'Forms', link: '/05-forms/01-introduction' },
          { text: 'Menu', link: '/08-menu/01-introduction' },
        ]
      },
      {
        text: 'Advanced',
        items: [
          { text: 'Settings', link: '/06-settings/01-introduction' },
          { text: 'Sites & domains', link: '/07-sites/01-introduction' },
        ]
      },
      {
        text: 'Extending Backstage',
        items: [
          {
            text: 'Plugins', link: '/09-plugins/01-introduction', items: [
              {
                text: 'Mails', link: '/09-plugins/plugins/mails/01-introduction'
              },
              {
                text: 'Translations', link: '/09-plugins/plugins/translations/index.md', collapsed: true, items: [
                  {
                    text: "Installation", link: '/09-plugins/plugins/translations/installation',
                  },
                  {
                    text: "Usage", link: '/09-plugins/plugins/translations/usage',
                  },
                  {
                    text: "Filament Interface", link: '/09-plugins/plugins/translations/filament-interface',
                  },
                  {
                    text: "API Reference", link: '/09-plugins/plugins/translations/api-reference',
                  }
                ]
              }
            ]
          },
          {
            text: 'Laravel Translations', link: '/09-plugins/plugins/laravel-translations/index.md', collapsed: true, items: [
              {
                text: "Installation", link: '/09-plugins/plugins/laravel-translations/installation',
              },
              {
                text: "Configuration", link: '/09-plugins/plugins/laravel-translations/configuration',
              },
              {
                text: "Basic Usage", link: '/09-plugins/plugins/laravel-translations/basic-usage',
              },
              {
                text: "Model Attributes", link: '/09-plugins/plugins/laravel-translations/model-attributes',
              },
              {
                text: "Translation Providers", link: '/09-plugins/plugins/laravel-translations/providers',
              },
              {
                text: "Commands", link: '/09-plugins/plugins/laravel-translations/commands',
              },
              {
                text: "Advanced Usage", link: '/09-plugins/plugins/laravel-translations/advanced-usage',
              }
            ]
          }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/backstagephp' }
    ]
  }
})
