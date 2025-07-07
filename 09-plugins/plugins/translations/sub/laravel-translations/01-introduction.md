---
title: Backstage Laravel Translations
---

# Translations for Laravel

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
- [Usage](#usage-with-installation)
    - [Add lang types](#add-lang-types)
    - [Scan For translations](#scan-for-translations)
    - [Translate scanned translations](#translate-scanned-translations)
    - [Using the the model translatable attributes feature](#using-the-the-model-translatable-attributes-feature)
- [Features](#features)


## Overview

Laravel-Translations is a powerful developer tool that simplifies the management, translation, and synchronization of multilingual content within Laravel applications. It integrates multiple translation providers, automates workflows like language addition and translation updates, and ensures high code quality through static analysis and testing.

**Why laravel-translations?**

This project helps developers build scalable, maintainable multilingual systems with ease. The core features include:

- 🧩 **🌐 Globe:** Support for multiple translation providers like Google Translate, DeepL, and AI, enabling flexible localization strategies.
- 🚀 **⚙️ Automation:** Automates adding new languages, scanning source files, and updating translations to streamline workflows.
- 🔍 **🛠️ Quality:** Integrates static analysis (PHPStan) and automated testing to maintain a robust codebase.
- 🔄 **🔧 Synchronization:** Manages language lifecycle events and keeps translation data consistent across the system.
- 🎯 **🧰 Extensibility:** Custom loaders, translation drivers, and models provide a flexible architecture for complex localization needs.

---

## Features

|      | Component            | Details                                                                                     |
| :--- | :------------------- | :------------------------------------------------------------------------------------------ |
| ⚙️  | **Architecture**     | <ul><li>Laravel package for managing translations</li><li>Uses service providers for integration</li><li>Follows Laravel's modular structure</li></ul> |
| 🔩 | **Code Quality**     | <ul><li>Type safety via PHPDoc and static analysis with PHPStan</li><li>Code style enforced through PHP-CS-Fixer</li><li>Includes baseline and multiple config files for quality checks</li></ul> |
| 📄 | **Documentation**    | <ul><li>README provides setup and usage instructions</li><li>Config files documented for PHPStan, PHPUnit</li><li>CI workflows include documentation updates</li></ul> |
| 🔌 | **Integrations**      | <ul><li>Laravel framework</li><li>PHPStan for static analysis</li><li>PHPUnit for testing</li><li>GitHub Actions for CI/CD</li></ul> |
| 🧩 | **Modularity**        | <ul><li>Separated configuration files for different tools</li><li>Uses Composer for dependency management</li><li>Modular test setup with distinct workflows</li></ul> |
| 🧪 | **Testing**           | <ul><li>Unit tests via PHPUnit (`phpunit.xml.dist`)</li><li>Static analysis checks with PHPStan</li><li>CI pipelines run tests automatically</li></ul> |
| ⚡️  | **Performance**       | <ul><li>Optimized static analysis with PHPStan baseline</li><li>CI workflows designed for efficient runs</li></ul> |
| 🛡️ | **Security**          | <ul><li>Code quality tools help prevent common issues</li><li>Dependabot auto-merge for dependency updates reduces vulnerabilities</li></ul> |
| 📦 | **Dependencies**      | <ul><li>Managed via `composer.json`</li><li>Includes PHPStan, PHPUnit, and other dev tools</li></ul> |

---

## Getting Started

### Prerequisites

This project requires the following dependencies:

- **Programming Language:** PHP
- **Package Manager:** Composer

### Installation

Build laravel-translations from the source and install dependencies:

1. **Clone the repository:**

    ```sh
    ❯ git clone https://github.com/backstagephp/laravel-translations
    ```

2. **Navigate to the project directory:**

    ```sh
    ❯ cd laravel-translations
    ```

3. **Install the dependencies:**

**Using [composer](https://www.php.net/):**

```sh
❯ composer install
```

### Usage (with installation)

Run the project with:

**Using [composer](https://getcomposer.org/):**

You can install the package via composer:

```bash
composer require backstage/laravel-translations
```

You can publish and run the migrations with:

```bash
php artisan vendor:publish --provider="Backstage\Translations\Laravel\TranslationServiceProvider"
php artisan migrate
```

### Add lang types

If you want to add a language use the following command:

```bash
php artisan translations:languages:add {locale} {label}
```

For example:

```bash
php artisan translations:languages:add nl Nederlands

translations:languages:add en English

translations:languages:add fr-BE Français // French specifically for Belgians
```

### Scan for translations

To scan for translations within your Laravel application, use the following command:

```bash
php artisan translations:scan
```

### Translate scanned translations

To translate the scanned translations, use the following command:

```bash
php artisan translations:translate
        {--all : Translate language strings for all languages}
        {--code= : Translate language strings for a specific language}
        {--update : Update and overwrite existing translations}
```

For example:

```bash
php artisan translations:translate --code=nl

php artisan translations:translate --code=en

php artisan translations:translate --code=fr-BE --update // overwrite existing translations

php artisan translations:translate // translate all languages
```

### Using the the model translatable attributes feature

To translate attributes within youre models, import the following to your model:

```php
use Backstage\Translations\Laravel\Contracts\TranslatesAttributes;
use Backstage\Translations\Laravel\Models\Concerns\HasTranslatableAttributes;
use Illuminate\Database\Eloquent\Model;

class TestTranslateModel extends Model implements TranslatesAttributes
{
    use HasTranslatableAttributes;
}
```

After that register the model inside the ``translations.php``:

```php
    'eloquent' => [
        'translatable-models' => [
            // Content::class,
            TestTranslateModel::class
        ],
    ],
```

Now add the translatable attributes to the model:

```php

use Backstage\Translations\Laravel\Contracts\TranslatesAttributes;
use Backstage\Translations\Laravel\Models\Concerns\HasTranslatableAttributes;
use Illuminate\Database\Eloquent\Model;

class TestTranslateModel extends Model implements TranslatesAttributes
{
    use HasTranslatableAttributes;

    public function getTranslatableAttributes(): array
    {
        return [
            'title',
            'description',
            'body',
            'metadata',
            'views',
        ];
    }
}
```

After this it's very important that you add the casts per translatable attribute:

```php

   protected $casts = [
        'title' => 'string',
        'description' => 'encrypted',
        'body' => 'array',
        'metadata' => 'array',
        'views' => 'integer',
    ];
```

After this is done, every time you save an entry, the (new) contents automatticly gets updates (queued). If you want to check every night if the translatable attributes are synced, use this command to schedule:

```bash

php artisan translations:sync # this will remove orphaned translations (if existing) and fills translations if they are missing

```

To retrieve the translatable attribute you use:

```php

$translatedDescription = $modelInstance->getTranslatedAttribute('description');

```

If a specific locale is needed, use:

```php

$translatedDescription = $modelInstance->getTranslatedAttribute(
    attribute: 'description',
    locale: 'de' // Can be any language existig in the DB (check translations:languages:add command)
 );

```

If needed to get all translated attributes, use:

```php

$translatedAttributes = $modelInstance->getTranslatedAttributes();

```

If needed to get all translated attributes a specific locale use:

```php

$translatedAttributes = $modelInstance->getTranslatedAttributes(
    locale: 'de' 
 );

```
