---
title: Backstage Translations
---

# Translations for Filament

## Before using

Please read this documentation first: [Laravel Translations docs](/09-plugins/plugins/translations/sub/laravel-translations/01-introduction.html)

## Installation

You can install the package via composer:

```bash
composer require backstage/translations
```

You can publish and run the migrations with:

```bash
php artisan vendor:publish --provider="Backstage\Translations\Laravel\TranslationServiceProvider"
php artisan vendor:publish --provider="Backstage\Translations\Filament\TranslationServiceProvider"
php artisan migrate
```

You can publish the config file with:

```bash
php artisan vendor:publish --tag="translations-config"
php artisan vendor:publish --tag="backstage-translations-config"
```

Optionally, you can publish the views using

```bash
php artisan vendor:publish --tag="backstage-translations-views"
```

Add the TranslationsPlugin to the desired panel provider:

```php
use Backstage\Translations\Filament\TranslationsPlugin;

$panel
    ->plugins([
        TranslationsPlugin::make(),
    ]);
```

Optionally, you can disable the language switcher and rely on the ``default`` language:
 ```php
use Backstage\Translations\Filament\TranslationsPlugin;

$panel
    ->plugins([
        TranslationsPlugin::make()
            ->languageSwitcherDisabled(),
    ]);
```

If you want to show only the language switcher in a panel, you can set the `canManageTranslations` to `false`:

 ```php
use Backstage\Translations\Filament\TranslationsPlugin;

$panel
    ->plugins([
        TranslationsPlugin::make()
            ->userCanManageTranslations(false),
    ]);
```
