![Logo Asdoria](doc/asdoria.jpg)

<h1 align="center">Asdoria Product Comparator Plugin</h1>

<p align="center">Compare different products with each other</p>

## Installation

---
1. Add the repository to composer.json

```JSON
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

4. Import config in `config/packages/_sylius.yaml`
```yaml
imports:
    - { resource: "@AsdoriaSyliusProductComparatorPlugin/Resources/config/app/config.yaml"}
```

5. Add path in `config/packages/api_platform.yaml`
```yaml
api_platform:
    mapping:
        paths:
            - '%kernel.project_dir%/vendor/asdoria/sylius-product-comparator-plugin/src/Resources/config/api_resources'
```

6. Add serializer in `config/packages/framework.yaml`
```yaml
framework:
    [...]
    serializer:
        mapping:
            paths: ['%kernel.project_dir%/src/Resources/config/serialization']
```

7. Expose sylius_api in `config/routes/sylius_api.yaml`
```yaml
sylius_api:
    [...]
    options:
        expose: true
```

8. In `config/routes/sylius_shop.yaml`:
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

## Usage

1. Include `src/Resources/views/Comparator/_addToComparator.html.twig` with product
2. Include `src/Resources/views/Comparator/_fixedButton.html.twig` on the pages you want
3. See result at `http://your-shop/locale/comparator`
