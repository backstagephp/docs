---
title: Quick start
---

# Welcome, Backstage

The CMS build for Laravel developers.

## Install

See [install](/installation) for installing Backstage in your Laravel project.

## Quickstart

Backstage is build on top of Filament. 

### 1. Create a user

```bash
php artisan make:filament-user
```

### 2. Login

Open /backstage and login. If this is your first user you need to make a new site. Create one on /backstage/new.

### 3. (optional) Create a content type

Types / New type

Create a [type](/02-types/01-introduction) with [fields](03-fields/01-introduction).

<video controls src="/quickstart/create-type.mp4"></video>

### 4. Create content with the new type

Content / New content / [type]

<video controls src="/quickstart/create-content.mp4"></video>

### 5. Create a blade file

Create a blade file located in `/resources/views/types/[type-slug].blade.php`.

```blade
<!-- resources/views/types/company.blade.php -->
<x-page>
    
    Welcome, {{ $content->field('name') }}.
    
</x-page>
```