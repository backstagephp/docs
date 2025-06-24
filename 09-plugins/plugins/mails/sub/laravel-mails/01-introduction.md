---
title: Backstage Laravel Mails
---

# 

## Installation

You can install the package via composer:

```bash
composer require backstage/laravel-mails
```

You can publish and run the migrations with:

```bash
php artisan vendor:publish --tag="mails-migrations"
php artisan migrate
```

Add the API key of your email service provider to the `config/services.php` file in your Laravel project, currently we only support Postmark and Mailgun:

```php
'postmark' => [
    'token' => env('POSTMARK_TOKEN'),
],

'mailgun' => [
    'domain' => env('MAILGUN_DOMAIN'),
    'secret' => env('MAILGUN_SECRET'),
    'webhook_signing_key' => env('MAILGUN_WEBHOOK_SIGNING_KEY'),
    'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    'scheme' => 'https',
]
```

When done, run this command with the slug of your service provider:

```bash
php artisan mail:webhooks [service] // where [service] is your provider, e.g. postmark or mailgun
```

And for changing the configuration you can publish the config file with:

```bash
php artisan vendor:publish --tag="mails-config"
```

This is the contents of the published config file:

```php
// Eloquent model to use for sent emails

'models' => [
    'mail' => Mail::class,
    'event' => MailEvent::class,
    'attachment' => MailAttachment::class,
],

// Table names for saving sent emails and polymorphic relations to database

'database' => [
    'tables' => [
        'mails' => 'mails',
        'attachments' => 'mail_attachments',
        'events' => 'mail_events',
        'polymorph' => 'mailables',
    ],

    'pruning' => [
        'enabled' => true,
        'after' => 30, // days
    ],
],

'headers' => [
    'uuid' => 'X-Mails-UUID',

    'associate' => 'X-Mails-Associated-Models',
],

'webhooks' => [
    'routes' => [
        'prefix' => 'webhooks/mails',
    ],

    'queue' => env('MAILS_QUEUE_WEBHOOKS', false),
],

// Logging mails
'logging' => [

    // Enable logging of all sent mails to database

    'enabled' => env('MAILS_LOGGING_ENABLED', true),

    // Specify attributes to log in database

    'attributes' => [
        'subject',
        'from',
        'to',
        'reply_to',
        'cc',
        'bcc',
        'html',
        'text',
    ],

    // Encrypt all attributes saved to database

    'encrypted' => env('MAILS_ENCRYPTED', true),

    // Track following events using webhooks from email provider

    'tracking' => [
        'bounces' => true,
        'clicks' => true,
        'complaints' => true,
        'deliveries' => true,
        'opens' => true,
    ],

    // Enable saving mail attachments to disk

    'attachments' => [
        'enabled' => env('MAILS_LOGGING_ATTACHMENTS_ENABLED', true),
        'disk' => env('FILESYSTEM_DISK', 'local'),
        'root' => 'mails/attachments',
    ],
],

// Notifications for important mail events

'notifications' => [
    'mail' => [
        'to' => ['test@example.com'],
    ],

    'discord' => [
        // 'to' => ['1234567890'],
    ],

    'slack' => [
        // 'to' => ['https://hooks.slack.com/services/...'],
    ],

    'telegram' => [
        // 'to' => ['1234567890'],
    ],
],

'events' => [
    'soft_bounced' => [
        'notify' => ['mail'],
    ],

    'hard_bounced' => [
        'notify' => ['mail'],
    ],

    'bouncerate' => [
        'notify' => [],

        'retain' => 30, // days

        'treshold' => 1, // %
    ],

    'deliveryrate' => [
        'treshold' => 99,
    ],

    'complained' => [
        //
    ],

    'unsent' => [
        //
    ],
]
```

## Usage

### Logging

When you send emails within Laravel using the `Mail` Facade or using a `Mailable`, Laravel Mails will log the email sending and all events that are incoming from your email service provider.

### Relate emails to Eloquent models

...

### Resend a logged email

...

### Get notified of important events such as bounces, high bounce rate or spam complaints

...

### Prune logged emails

...

## Events

Depending on the mail provider, we send these events comming in from the webhooks of the email service provider.

```php
Vormkracht10\Mails\Events\MailAccepted::class,
Vormkracht10\Mails\Events\MailClicked::class,
Vormkracht10\Mails\Events\MailComplained::class,
Vormkracht10\Mails\Events\MailDelivered::class,
Vormkracht10\Mails\Events\MailEvent::class,
Vormkracht10\Mails\Events\MailEventLogged::class,
Vormkracht10\Mails\Events\MailHardBounced::class,
Vormkracht10\Mails\Events\MailOpened::class,
Vormkracht10\Mails\Events\MailResent::class,
Vormkracht10\Mails\Events\MailSoftBounced::class,
Vormkracht10\Mails\Events\MailUnsubscribed::class,
```