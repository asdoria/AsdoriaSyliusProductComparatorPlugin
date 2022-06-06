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

3. Expose sylius_api in `config/routes/sylius_api.yaml`
```yaml
sylius_api:
    [...]
    options:
        expose: true
```

4. In `config/routes/sylius_shop.yaml`:
   1. Add comparator route
    ```yaml
    asdoria_product_comparator:
        resource: "@AsdoriaSyliusProductComparatorPlugin/Resources/config/routing.yaml"
    ```
    2. Expose `sylius_shop_product_index`
   ```yaml
   sylius_shop_product_index:
    path: /{_locale}/taxons/{slug}
    [...]
    options:
        expose: true
   ```

5. Add the following 4 lines to the auto-scripts in `composer.json`
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

1. Add the button to let the customer choose which products to compare

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
 You can choose which product attributes will be displayed in the comparator page by overriding `src/Resources/views/Shop/Comparator/index.html.twig` and setting new values into `availableAttributes: [value1, value2]`
The array contains the id of all attributes you want to show.
 
 You will find attributes' id on their edit page, by looking at the url (e.g. `admin/product-attributes/3/edit` is the T-shirt material with an id of 3)

Here's an override exemple :
```html
<!-- templates/bundles/AsdoriaSyliusProductComparatorPlugin/Shop/Comparator/index.html.twig-->
{% block content %}
    <div class="Comparator">
        <div class="Comparator-header">
            <h1 class="Comparator-title">
                {{ 'asdoria_sylius_comparator_bundle.ui.comparator'|trans }}
            </h1>
        </div>
        {% set config = {
            currencyCode: sylius.currencyCode,
            withTax: true,
            availableAttributes: [1, 3, 11]
        } %}
        <div id="vm-comparator" data-config="{{ config|serialize }}">
            <span class="Comparator-loader"></span>
        </div>
    </div>
{% endblock %}


```
`availableAttributes: [1, 3, 11]` states that 3 attributes will be compared :

- 1 : T-shirt Brand
- 3 : T-shirt Material
- 11 : Length
