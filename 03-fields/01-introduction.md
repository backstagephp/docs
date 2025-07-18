---
title: Fields
---

# Fields

Fields are configurable (custom) Filament form fields that can be used in [Content](/01-content/01-introduction), [Forms](/05-forms/01-introduction) and [Settings](/06-settings/01-introduction). We provide a set of fields that can be used out of the box, but you can also create your own fields.

### Displaying a field in blade
```php
// resources/page.blade.php
{{ $content->field('name') }}
```

![field-example](./field-example.png)

Most of the fields are based on the Filament fields, but we might miss some configuration options. If you need a specific configuration option, you can create your own field or submit a PR to add the configuration option to the field.

## Setup

If you want to have your custom fields available in backstage, register them by adding the fields to `config/backstage.php`.

```php
return [
    // ...

    'fields' => [

    ]
];
```

Then this component should be available in the Settings field relation manager:

![field-specific-example](./field-specific-example.png)

To see how to create a field, check the [Creating a field](/03-fields/02-creating-a-field.md) page.

### Relation field
Types -> Add field -> Field type "Select".

Under Field specific select "Relationship"-type in options, add a relation:
Resource: Content
Column (name in dropdown): Name
Add filter:
Column: Type_Slug
Operator: Equal
Value: [slug-of-type] e.g. 'members'.

### Scope content select based on language

Here is an example to scope the select options of a field by content and language.
![Session language filter](field-scoped-by-language.png)