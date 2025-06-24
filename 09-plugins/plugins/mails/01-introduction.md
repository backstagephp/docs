---
title: Backstage Mails
---

# Mails for Filament

## Before using

Please read this documentation first: [Laravel Mails docs](/09-plugins/plugins/mails/sub/laravel-mails/01-introduction.html)

## Installation

You can install the package via composer:

```bash
composer require backstage/filament-mails
```

You can publish and run the migrations with:

```bash
php artisan vendor:publish --tag="mails-migrations"
php artisan migrate
```

You can publish the config file with:

```bash
php artisan vendor:publish --tag="mails-config"
php artisan vendor:publish --tag="filament-mails-config"
```

Optionally, you can publish the views using

```bash
php artisan vendor:publish --tag="filament-mails-views"
```

Add the routes to the PanelProvider using the `routes()` method, like this:

```php
use Vormkracht10\FilamentMails\Facades\FilamentMails;

public function panel(Panel $panel): Panel
{
    return $panel
        ->routes(fn () => FilamentMails::routes());
}
```

Then add the plugin to your `PanelProvider`

```php
use Vormkracht10\FilamentMails\FilamentMailsPlugin;

public function panel(Panel $panel): Panel
{
    return $panel
        ->plugin(FilamentMailsPlugin::make());
}
```

### Tenant middleware and route protection

If you want to protect the mail routes with your (tenant) middleware, you can do so by adding the routes to the `tenantRoutes`:

```php
use Vormkracht10\FilamentMails\FilamentMailsPlugin;
use Vormkracht10\FilamentMails\Facades\FilamentMails;

public function panel(Panel $panel): Panel
{
    return $panel
        ->plugin(FilamentMailsPlugin::make())
        ->tenantRoutes(fn() => FilamentMails::routes());
}
```

> [!IMPORTANT]
> For setting up the webhooks to register mail events, please look into the README of [Laravel Mails](https://github.com/backstagephp/laravel-mails), the underlying package that powers this package.

### Configuration

Sometimes you want to customize the resource, like configuring which users or roles may access the resource. You can do this by overriding the `MailResource` or `EventResource` classes in the `filament-mails` config file. Make sure your custom resource extends the original resource.

```php
return [
    'resources' => [
        'mail' => \App\Filament\Resources\MailResource::class,
        'event' => \App\Filament\Resources\EventResource::class,
        'suppression' => \App\Filament\Resources\SuppressionResource::class
    ],
];
```

## Features and screenshots

### List with all sent emails and statistics

The package provides a clear overview of all emails, including statistics and the ability to filter the data.
![Filament Mails](https://raw.githubusercontent.com/backstagephp/filament-mails/main/docs/mails-list.png)

### Resending emails

You can resend emails to the same or another recipient(s). This is useful when your email has bounced and you want to resend it.
![Filament Mails](https://raw.githubusercontent.com/backstagephp/filament-mails/main/docs/mail-resend.png)

### Information

You can view all relevant information about the email, such as the subject, the body, the attachments, the from address, the to address(es), the cc address(es), the bcc address(es), the reply to address, metadata and much more.
![Filament Mails](https://raw.githubusercontent.com/backstagephp/filament-mails/main/docs/mail-sender-information.png)
![Filament Mails](https://raw.githubusercontent.com/backstagephp/filament-mails/main/docs/mail-statistics.png)
![Filament Mails](https://raw.githubusercontent.com/backstagephp/filament-mails/main/docs/mail-events.png)
![Filament Mails](https://raw.githubusercontent.com/backstagephp/filament-mails/main/docs/mail-attachments.png)

### Preview email

The package provides a preview of the email. This is useful to quickly check if the email is correct.
![Filament Mails](https://raw.githubusercontent.com/backstagephp/filament-mails/main/docs/mail-preview.png)

We also provide the raw HTML and plain text of the email.
![Filament Mails](https://raw.githubusercontent.com/backstagephp/filament-mails/main/docs/mail-raw-html.png)

### Events

The package also logs all events that are fired when an email is sent. This is useful to track the email sending process.
![Filament Mails](https://raw.githubusercontent.com/backstagephp/filament-mails/main/docs/events-list.png)
![Filament Mails](https://raw.githubusercontent.com/backstagephp/filament-mails/main/docs/event-details.png)