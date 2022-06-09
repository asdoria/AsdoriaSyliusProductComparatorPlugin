<p align="center">
    <img src="doc/asdoria.jpg" alt="Logo Asdoria">
</p>

<h1 align="center">Asdoria Product Comparator Plugin</h1>

<p align="center">Compare different products with each other</p>

<p align="center">
    <img src="doc/comparator.gif" alt="Comparator">
</p>

## Installation


1. run `composer require asdoria/sylius-product-comparator-plugin`


2. Import config and enable sylius_api in `config/packages/_sylius.yaml`
```yaml
imports:
    - { resource: "@AsdoriaSyliusProductComparatorPlugin/Resources/config/app/config.yaml"}

[...]

sylius_api:
    enabled: true
```

3. In `config/routes/sylius_shop.yaml`:
   1. Add comparator route
    ```yaml
    asdoria_product_comparator:
        resource: "@AsdoriaSyliusProductComparatorPlugin/Resources/config/routing.yaml"
    ```
    2. Expose `sylius_shop`
   ```yaml
    sylius_shop:
      resource: "@SyliusShopBundle/Resources/config/routing.yml"
        prefix: /{_locale}
      requirements:
        _locale: ^[A-Za-z]{2,4}(_([A-Za-z]{4}|[0-9]{3}))?(_([A-Za-z]{2}|[0-9]{3}))?$
      options:
        expose: true
   ```

4. Add the following 4 lines to the auto-scripts in `composer.json`
```JSON
"scripts": {
    [...],
    "auto-scripts": {
        [...]
        "fos:js-routing:dump --format=json --target=public/js/fos_js_routes.json": "symfony-cmd",
        "bazinga:js-translation:dump public/js --format=json": "symfony-cmd"
    }
},
```
   Now run them with `composer run auto-scripts`
### Styles

Add global `tailwind` variable if you want use a tailwind theme in `config/packages/twig.yaml`:
```yaml
twig:
    [...]
    globals:
        tailwind: true
```
To switch between Semantic UI and Tailwind CSS, change the value of this variable

## Usage

1. Run `mkdir -p templates/bundles/SyliusShopBundle/Product/Box/`
2. Run `cp -r vendor/sylius/sylius/src/Sylius/Bundle/ShopBundle/Resources/views/Product/Box/_content.html.twig templates/bundles/SyliusShopBundle/Product/Box/`

3. Add the button to let the customer choose which products to compare

Override the Box/_content template to include the  event `asdoria.shop.add_to_comparator.content` with `product` as the parameter

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

        [...]

</div>    
```
2. The fixed button redirecting to the comparator page is already included inside the event `sylius.shop.layout.before_content`

## Choose the products attributes to compare
 You can choose which product attributes will be displayed in the comparator page by add configuration into `config/packages/_sylius.yaml`
```yaml
asdoria_sylius_product_comparator:
     available_attributes:
       - t_shirt_brand
       - t_shirt_material
       - length
```
The array contains the code of all attributes you want to compare.

