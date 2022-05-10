<p align="center">
    <img src="doc/asdoria.jpg" alt="Logo Asdoria">
</p>

<h1 align="center">Asdoria Product Comparator Plugin</h1>

<p align="center">Compare different products with each other</p>

<p align="center">
    <img src="doc/comparator.gif" alt="Comparator">
</p>

## Installation

1. Add the repository and the following auto-scripts to `composer.json`
```JSON
"scripts": {
    [...],
    "auto-scripts": {
        "cache:clear": "symfony-cmd",
        "fos:js-routing:dump --format=json --target=public/js/fos_js_routes.json": "symfony-cmd",
        "bazinga:js-translation:dump public/js --format=json": "symfony-cmd",
        "assets:install %PUBLIC_DIR%": "symfony-cmd",
        "sylius:theme:assets:install %PUBLIC_DIR%": "symfony-cmd",
        "doctrine:migration:migrate -q": "symfony-cmd"
    }
},
"repositories": [
    {
        "type": "git",
        "url": "https://github.com/asdoria/AsdoriaSyliusProductComparatorPlugin.git"
    }
],
```

2. run `composer require asdoria/sylius-product-comparator-plugin`

3. Add the bundle in `config/bundles.php`
```PHP
Asdoria\SyliusProductComparatorPlugin\AsdoriaSyliusProductComparatorPlugin::class => ['all' => true],
```

4. Import config and enabled sylius_api in `config/packages/_sylius.yaml`
```yaml
imports:
    - { resource: "@AsdoriaSyliusProductComparatorPlugin/Resources/config/app/config.yaml"}

[...]

sylius_api:
    enabled: true
```

5. Expose sylius_api in `config/routes/sylius_api.yaml`
```yaml
sylius_api:
    [...]
    options:
        expose: true
```

6. In `config/routes/sylius_shop.yaml`:
   1. Add comparator route
    ```yaml
    asdoria_product_comparator:
        resource: "@AsdoriaSyliusProductComparatorPlugin/Resources/config/routing.yaml"
    ```
    2. Expose `sylius_shop_product_index`
   ```yaml
   sylius_shop_product_index:
    path: /{_locale}/taxons/{slug}
    methods: [GET]
    defaults:
        _controller: sylius.controller.product:indexAction
        _sylius:
            template: "@SyliusShop/Product/index.html.twig"
            grid: asdoria_shop_product
    requirements:
        slug: .+
        _locale: ^[A-Za-z]{2,4}(_([A-Za-z]{4}|[0-9]{3}))?(_([A-Za-z]{2}|[0-9]{3}))?$
    options:
        expose: true
   ```

### Styles

Add global `tailwind` in `config/packages/twig.yaml`:
```yaml
twig:
    [...]
    globals:
        tailwind: true
```
To switch between Semantic UI and Tailwind CSS, change the value of this variable

## Usage

1. Include event `asdoria.shop.add_to_comparator.content` with product inside product context (see exemple below)
```html
<!-- templates/bundles/SyliusShopBundle/Product/Box/_content.html.twig -->

{% import "@SyliusShop/Common/Macro/money.html.twig" as money %}

<div class="ui fluid card" {{ sylius_test_html_attribute('product') }}>
    <a href="{{ path('sylius_shop_product_show', {'slug': product.slug, '_locale': product.translation.locale}) }}" class="blurring dimmable image">
        <div class="ui dimmer">
            <div class="content">
                <div class="center">
                    <div class="ui inverted button">{{ 'sylius.ui.view_more'|trans }}</div>
                </div>
            </div>
        </div>
        {% include '@SyliusShop/Product/_mainImage.html.twig' with {'product': product} %}
    </a>
    {{ sylius_template_event('asdoria.shop.add_to_comparator.content', {'product': product}) }}
    <div class="content" {{ sylius_test_html_attribute('product-content') }}>
        <a href="{{ path('sylius_shop_product_show', {'slug': product.slug, '_locale': product.translation.locale}) }}" class="header sylius-product-name" {{ sylius_test_html_attribute('product-name', product.name) }}>{{ product.name }}</a>
        {% if not product.enabledVariants.empty() %}
            <div class="sylius-product-price" {{ sylius_test_html_attribute('product-price') }}>{{ money.calculatePrice(product|sylius_resolve_variant) }}</div>
        {% endif %}
    </div>
</div>
```
2. fixed button is already include inside event `sylius.shop.layout.before_content`
