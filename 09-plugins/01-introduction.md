---
title: Plugins
---

# Plugins

To help you get started quickly, we provide a set of plugins and packages that were specifically created for Backstage. You can simply install them in your project.

## Building your own

If your plugin required migrations use the following tag to automaticly publish and migrate the migrations:
`backstage-migrations`.

```php
/**
 * Bootstrap any package services.
 */
public function boot(): void
{
    $this->publishesMigrations([
        __DIR__.'/../database/migrations' => database_path('migrations'),
    ], 'backstage-migrations');
}
```

## List of plugins

-   [Media Field](https://github.com/backstagephp/media-field)
-   [Uploadcare Field](https://github.com/backstagephp/uploadcare-field)
-   [Translations](/09-plugins/plugins/translations/01-introduction.html)
