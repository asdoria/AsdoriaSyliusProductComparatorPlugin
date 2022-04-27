<template>
    <div v-if="!products.data.length" class="Comparator-no-product">
        <p class="Comparator-no-product__p">{{ Translator.trans('asdoria_sylius_comparator_bundle.ui.no_product') }}</p>
        <button class="js-prev-page Comparator-button">
            {{ Translator.trans('asdoria_sylius_comparator_bundle.ui.back') }}
        </button>
    </div>

    <template v-else>
        <div class="Comparator-subheader ui basic inverted blue padded segment small header">
            <div class="Comparator-subheader-content">
                {{ Translator.trans('asdoria_sylius_comparator_bundle.ui.header_title') }}
                <div class="Comparator-subheader-content__div">
                    <i class="Icon-arrow-right icon arrow alternate circle right"></i>
                </div>
            </div>
        </div>
        <div class="Comparator-content">
            <table class="Comparator-table ui celled unstackable table">
                <tbody>
                <ComparatorMobileHead :products="products"
                                      :removeProduct="remove"
                                      :currencyCode="currencyCode"
                                      :withTax="withTax"/>

                <tr v-if="hasRating">
                    <td class="Comparator-data-left">
                        <p class="Comparator-data-name text bold" style="width: calc(100vw - 48px)">
                            {{ Translator.trans('asdoria_sylius_comparator_bundle.ui.ratings') }}</p>
                    </td>
                    <td v-for="(product, index) in products.data" class="Comparator-data-product">
                        <Review :product="product" :index="index"/>
                    </td>
                </tr>

                <tr>
                    <td class="Comparator-data-left">
                        <p class="Comparator-data-name text bold" style="width: calc(100vw - 48px)">
                            {{ Translator.trans('asdoria_sylius_comparator_bundle.ui.description') }}</p>
                    </td>
                    <td v-for="product in products.data" class="Comparator-data-product">
                        <div class="Comparator-data-value">
                            <div class="js-comparator-string-to-html line-clamp-3"
                                 :data-string-value="product.description"></div>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td class="Comparator-data-left">
                        <p class="Comparator-data-name text bold" style="width: calc(100vw - 48px)">
                            {{ Translator.trans('asdoria_sylius_comparator_bundle.ui.main_taxon') }}</p>
                    </td>
                    <td v-for="product in products.data" class="Comparator-data-product">
                        <a class="Button Comparator-link Comparator-link__main-taxon Comparator-data-value link black"
                           :href="getTaxonInfosByLocale(product.mainTaxon).url">
                            {{ getTaxonInfosByLocale(product.mainTaxon).name }}
                        </a>
                    </td>
                </tr>

                <tr>
                    <td class="Comparator-data-left">
                        <p class="Comparator-data-name text bold" style="width: calc(100vw - 48px)">
                            {{ Translator.trans('asdoria_sylius_comparator_bundle.ui.secondary_taxons') }}</p>
                    </td>
                    <td v-for="product in products.data" class="Comparator-data-product">
                        <div class="Comparator-data-value">
                            <a v-for="(taxon, index) in product.productTaxons" :href="getTaxonInfosByLocale(taxon).url"
                               class="Button Comparator-link Comparator-link__secondary-taxons link black">
                                {{ getTaxonInfosByLocale(taxon).name }}
                                <span v-if="index !== product.productTaxons.length - 1" class="text black marged-right-small">|</span>
                            </a>
                        </div>
                    </td>
                </tr>

                <tr v-for="attribute in attributes.data.filter(attr => availableAttributes.includes(attr.id))" class="Comparator-attribute">
                    <td class="Comparator-attribute-left Comparator-data-left">
                        <p class="Comparator-data-name text bold" style="width: calc(100vw - 48px)">
                            {{ getAttributeNameByLocale(attribute) }}</p>
                    </td>

                    <td v-for="product in products.data"
                        class="Comparator-attribute-product Comparator-data-product">
                        <div v-if="Array.isArray(getAttributeValue(attribute.code, product))"
                             v-for="val in getAttributeValue(attribute.code, product)">
                            <div class="js-comparator-string-to-html Comparator-data-value"
                                 :data-string-value="getAttributeValueByLocale(val)"></div>
                        </div>
                        <div v-else class="js-comparator-string-to-html Comparator-data-value"
                             :data-string-value="getAttributeValue(attribute.code, product)"></div>
                    </td>
                </tr>

                <tr>
                    <td class="Comparator-selection-left"></td>
                    <td v-for="product in products.data"
                        class="Comparator-selection-product">
                        <a class="Button Comparator-button ui orange fluid button" href="#">
                            {{ Translator.trans('asdoria_sylius_comparator_bundle.ui.add_to_selection') }}
                        </a>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </template>
</template>

<script>
import useFetchProducts from '../../modules/fetch-products'
import useFetchAttributes from '../../modules/fetch-attributes'
import useProductHelper from '../../modules/product-helper'
import useLocalStorageProducts from '../../modules/local-storage-products'
import { onUpdated } from 'vue';
import useStore from '../../store/store'
import Review from '../Review'
import ComparatorMobileHead from './ComparatorMobileHead'

export default {
    name: 'ComparatorMobile',
    components: {
        ComparatorMobileHead,
        Review
    },
    props: {
        currencyCode: String,
        withTax: Boolean,
        hasRating: Boolean,
        availableAttributes: Array
    },
    setup ({ currencyCode, withTax, hasRating, availableAttributes }) {

        const {
                  store: storage,
                  removeProduct: removeProductFromLocalStorage,
                  clean: cleanStorage,
                  updateProductNode
              } = useLocalStorageProducts()

        const {
                  getSlidersCurrentIndex,
                  incrementSliderCurrentIndexImages,
                  decrementSliderCurrentIndexImages
              } = useStore().sliders()

        const { state: products, removeProduct } = useFetchProducts(storage.products, (products) => {
            cleanStorage(products)
            products.forEach(p => updateProductNode(p.code, p))
        })

        const attributes = useFetchAttributes(products)

        function remove (code) {
            removeProduct(code)
            removeProductFromLocalStorage(code)
        }

        onUpdated(() => {
            const domEls = document.querySelectorAll('.js-comparator-string-to-html');
            [...domEls].forEach(domEl => {
                const { stringValue } = domEl.dataset
                domEl.innerHTML       = stringValue ?? ''
            })
        })

        return {
            currencyCode,
            withTax,
            hasRating,
            availableAttributes,
            products,
            attributes,
            ...useProductHelper(),
            remove,
            Translator,
            getSlidersCurrentIndex,
            incrementSliderCurrentIndexImages,
            decrementSliderCurrentIndexImages
        }
    }
}
</script>

<style lang="scss">
.Comparator-table {
    border-collapse: separate;
}
</style>
