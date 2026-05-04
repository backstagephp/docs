---
title: Helpers
---

# Helpers

Backstage ships a small set of runtime helpers that give you the current site, content and language inside any request, plus a few Blade directives for conditional rendering. They live in `packages/core` and are always available — no installation step required.

## Request bindings

For every request that resolves to a piece of content, the `BindSite` middleware (registered automatically on the `web` group) populates three container bindings:

- `content` — the current `Backstage\Models\Content` instance
- `site` — the related `Backstage\Models\Site`
- `language` — the related language

The bindings are registered with `app()->scoped(...)`, so they are reset between requests under Octane and other long-lived workers.

## `backstage()`

The `backstage()` helper is the main entry point. Without arguments it returns the helpers instance:

```php
backstage();              // Backstage\Helpers\Support\Helpers
backstage()->site();      // current Site
backstage()->content();   // current Content
```

You can also resolve a binding directly by name, with optional dot-notation for properties:

```php
backstage('site');         // current Site
backstage('content.title'); // shorthand for backstage()->content()->title
backstage('language');     // current Language
```

If the binding is not registered (for example, on a request that did not resolve content), `backstage('site')` returns `null`. Calling `backstage()->site()` without arguments outside a content response throws an exception.

### Looking up a specific record

Both `site()` and `content()` accept lookup arguments:

```php
backstage()->site('main');                       // Site where slug = 'main'
backstage()->site($id, 'ulid');                  // Site where ulid = $id

backstage()->content('about');                   // Content where slug = 'about' (current locale)
backstage()->content('about', locale: 'nl');     // Content where slug = 'about' and language_code = 'nl'

// Scope a content lookup to a specific site
backstage()->content('about', site: 'main');                 // by site slug
backstage()->content('about', site: $site, siteColumn: 'id'); // by Site instance + column
```

When `$slug` is `null`, the call returns the request-bound record (equivalent to `app('site')` / `app('content')`).

## Blade directives

### `@site`

Render a block only when the current site has a given slug:

```blade
@site('main')
    <p>Welcome to the main site.</p>
@endsite
```

### `@content`

Render a block only when the current content has a given slug:

```blade
@content('home')
    <h1>{{ backstage()->site()->name }}</h1>
@endcontent
```

Both directives compile to a check against `hasSlug(...)` on the bound model, so they only work inside requests where `BindSite` has populated the container.

## Examples

```blade
{{-- Show a hero only on the homepage of the main site --}}
@site('main')
    @content('home')
        <x-hero :title="backstage()->content()->title" />
    @endcontent
@endsite

{{-- Pull a sibling page by slug --}}
@php($about = backstage()->content('about'))

<a href="{{ $about->url }}">{{ $about->title }}</a>
```

```php
// In a controller
public function show()
{
    $site    = backstage()->site();
    $content = backstage()->content();

    return view('page', compact('site', 'content'));
}
```

## `props()` (separate package)

The [`backstage/props`](https://github.com/backstagephp/props) package exposes a parallel `props()` helper backed by the `backstage.props` container binding. It is meant for project-specific UX additions that should not live in core.

```php
props();          // Backstage\Props\Helpers\Support\Helpers
props()->ping();  // example helper exposed by props ('pong')
```

Like `backstage()`, the `props()` helper also accepts a binding name (with optional dot-notation), e.g. `props('something.value')`, returning `null` when the binding is not registered.

Use `backstage()` for everything provided by core; reach for `props()` only when you have registered your own helpers in the props package.

### Adding your own helpers

`backstage/props` is the package front-enders own. Add reusable Blade/template helpers here — never in `backstage/cms`. Every new helper is two changes inside the props package:

1. A utility trait under `Helpers/Support/Utilities/` containing the method.
2. The matching method signature on the `PropsHelpers` contract.

Both are required: the trait makes the helper callable, the contract keeps `props()` typed and signals to other developers what is available.

#### 1. Create a utility trait

```php
// src/Helpers/Support/Utilities/MenuUtility.php
namespace Backstage\Props\Helpers\Support\Utilities;

use Backstage\Models\Menu;

trait MenuUtility
{
    public function menu(string $slug): ?Menu
    {
        return Menu::where('slug', $slug)->first();
    }
}
```

The trait inherits the `$app` container property from `DefaultUtility`, so `$this->app->getLocale()` and `$this->retrieveBinding('site')` are available.

#### 2. Update the contract

The contract is the source of truth for what `props()` can do. Add the method signature:

```php
// src/Helpers/Contracts/PropsHelpers.php
namespace Backstage\Props\Helpers\Contracts;

use Backstage\Models\Menu;

interface PropsHelpers
{
    public function ping(): string;

    public function menu(string $slug): ?Menu;
}
```

#### 3. Compose the trait into `Helpers`

```php
// src/Helpers/Support/Helpers.php
class Helpers implements PropsHelpers
{
    use Utilities\DefaultUtility;
    use Utilities\PingUtility;
    use Utilities\MenuUtility; // ← new
}
```

The helper is now available everywhere `props()` resolves:

```blade
{{ props()->menu('main')?->title }}
```

```php
$menu = props()->menu('footer');
```

#### Conventions

- **One trait per topic** — `MenuUtility`, `NavigationUtility`, `BreadcrumbUtility` etc. Keep `Helpers` a one-line composition.
- **Always update the contract.** Skipping it works at runtime but breaks IDE completion and static analysis, and makes it harder for the next front-ender to see what is available.
- **Use `$this->retrieveBinding('site')`** (not `app('site')`) when a helper needs a request-bound model, so the "outside of a content response" exception is thrown consistently.
- **Never add helpers to `backstage/cms`.** Core's `CoreHelpers` contract is reserved for framework-level lookups (`site()`, `content()`); everything UX-shaped belongs in props.
