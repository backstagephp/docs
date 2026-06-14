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

## `stage()`

The `stage()` helper is the main entry point. Without arguments it returns the helpers instance:

```php
stage();              // Backstage\Helpers\Support\Helpers
stage()->site();      // current Site
stage()->content();   // current Content
```

You can also resolve a binding directly by name, with optional dot-notation for properties:

```php
stage('site');         // current Site
stage('content.title'); // shorthand for stage()->content()->title
stage('language');     // current Language
```

If the binding is not registered (for example, on a request that did not resolve content), `stage('site')` returns `null`. Calling `stage()->site()` without arguments outside a content response throws an exception.

### Looking up a specific record

Both `site()` and `content()` accept lookup arguments:

```php
stage()->site('main');                       // Site where slug = 'main'
stage()->site($id, 'ulid');                  // Site where ulid = $id

stage()->content('about');                   // Content where slug = 'about' (current locale)
stage()->content('about', locale: 'nl');     // Content where slug = 'about' and language_code = 'nl'

// Scope a content lookup to a specific site
stage()->content('about', site: 'main');                 // by site slug
stage()->content('about', site: $site, siteColumn: 'id'); // by Site instance + column
```

When `$slug` is `null`, the call returns the request-bound record (equivalent to `app('site')` / `app('content')`).

### Menus

`stage()->menu()` resolves a menu by its `slug` (`$name`), scoped to the current site and locale, and returns it as a **nested array tree** — plain data, not Eloquent models — ready to render in a Blade view:

```php
stage()->menu();                    // 'main' menu for the current site + locale
stage()->menu('footer');            // a named menu
stage()->menu('main', $site, 'nl'); // explicit site + locale
```

The menu is matched on `menus.slug = $name`, then narrowed to the resolved `site_ulid` and `language_code` (both columns live on the `menus` table). So a `main` menu can exist per site/locale without the slug having to encode them — and if no menu matches that slug for the current site and locale, the helper returns the empty shape described below.

Each node is an array:

```php
[
    'name'       => 'Product',
    'url'        => '#',     // resolved link: linked content URL, else the manual URL, else '#'
    'target'     => null,
    'is_action'  => false,   // target starts with 'action'
    'is_primary' => false,   // target === 'action-primary'
    'children'   => [ /* same shape, nested to any depth */ ],
]
```

Items are loaded through the adjacency-list tree, ordered by `position`. Any linked content is eager-loaded with only the columns needed to build its URL, so resolving a menu is just the slug lookup plus one tree query.

#### Diverging navigation and actions

By default (`$diverge = true`) the top-level items are split into navigation links and action buttons — actions being items whose `target` starts with `action`. A component can destructure them in one call:

```php
// app/View/Components/Section/Navigation.php
[$this->navigation, $this->actions] = stage()->menu('main');
```

Pass `diverge: false` to get a single flat collection of root nodes instead — useful for a footer that has no actions:

```php
$this->footerMenu = stage()->menu('footer', diverge: false);
```

When no site can be resolved, the helper returns the matching empty shape (`[collect(), collect()]` when diverging, otherwise an empty collection), so the destructure never fails.

Rendering then just walks the arrays:

```blade
@foreach($navigation as $item)
    @if(count($item['children']))
        <button type="button">{{ $item['name'] }}</button>
        <ul>
            @foreach($item['children'] as $child)
                <li><a href="{{ $child['url'] }}">{{ $child['name'] }}</a></li>
            @endforeach
        </ul>
    @else
        <a href="{{ $item['url'] }}">{{ $item['name'] }}</a>
    @endif
@endforeach
```

> The `active` state is deliberately **not** part of the array — it depends on the current request, so resolve it in the view layer (e.g. an `isActive()` method on the component).

### Field options

`stage()->fieldOptions()` returns the `options` array configured on a field, looked up by its `model_key` and `slug`. It replaces the brittle chain of fetching the field and reaching into `config['options']` by hand:

```php
// Before — explodes if the field is missing or has no options
$statusOptions = Field::where('model_key', 'property')->where('slug', 'status')->first()->config['options'];

// After
$statusOptions = stage()->fieldOptions('property', 'status');
```

The helper never throws. If no field matches the given `model_key` + `slug`, or the matched field has no `options` configured, it reports the problem through Laravel's `report()` handler (a `RuntimeException`, so you get a full stack trace in your logs) and returns an empty array:

```php
stage()->fieldOptions('property', 'status'); // ['draft' => 'Draft', 'published' => 'Published', ...]
stage()->fieldOptions('property', 'missing'); // [] — exception reported, request continues
```

Because the fallback is always `[]`, it is safe to feed straight into a Blade loop or a select without guarding the call.

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
        <x-hero :title="stage()->content()->title" />
    @endcontent
@endsite

{{-- Pull a sibling page by slug --}}
@php($about = stage()->content('about'))

<a href="{{ $about->url }}">{{ $about->title }}</a>
```

```php
// In a controller
public function show()
{
    $site    = stage()->site();
    $content = stage()->content();

    return view('page', compact('site', 'content'));
}
```

## `props()` (separate package)

The [`backstage/props`](https://github.com/backstagephp/props) package exposes a parallel `props()` helper backed by the `backstage.props` container binding. It is meant for project-specific UX additions that should not live in core.

```php
props();          // Backstage\Props\Helpers\Support\Helpers
props()->ping();  // example helper exposed by props ('pong')
```

Like `stage()`, the `props()` helper also accepts a binding name (with optional dot-notation), e.g. `props('something.value')`, returning `null` when the binding is not registered.

Use `stage()` for everything provided by core; reach for `props()` only when you have registered your own helpers in the props package.

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
