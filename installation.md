---
title: Install
---

# Welcome, Backstage

The CMS build for Laravel developers.

### Install

You can install backstage in any (new) Laravel project or start from scratch. The easiest way to start is install our [Backstage Installer](https://github.com/backstagephp/installer).

```bash
composer global require backstage/installer
```

After that you can use the `backstage` commando to make a new site.

```bash
backstage new my-site
```

## Advanced installation

#### Step 1. Create a new Laravel app.

```bash
laravel new my-website
```

#### Step 2. Require backstage/cms

```bash
composer require backstage/cms
```

Note: For now you may have to update composer.json to:
```json
    "repositories": {
        "laravel-redirects": {
            "type": "vcs",
            "url": "git@github.com:backstagephp/laravel-redirects.git"
        },
        "filament-redirects": {
            "type": "vcs",
            "url": "git@github.com:backstagephp/redirects.git"
        },
        "backstage/media": {
            "type": "vcs",
            "url": "git@github.com:backstagephp/media.git"
        },
        "backstage/fields": {
            "type": "vcs",
            "url": "git@github.com:backstagephp/fields.git"
        },
        "backstage": {
            "type": "vcs",
            "url": "git@github.com:backstagephp/core.git"
        }
    },
    "minimum-stability": "dev",
```

#### Step 3. Run migrations and add default settings and content

```bash
php artisan backstage:install
```

#### Step 4. (Optional) Remove or comment the default Laravel routes:

```php
// routes/web.php

// Route::get('/', function () {
//    return view('welcome');
//});
```

### Advanced setup

You can publish the migrations with:

```bash
php artisan vendor:publish --tag="backstage-migrations"
php artisan migrate
```

You can publish the config file with:

```bash
php artisan vendor:publish --tag="backstage-config"
```