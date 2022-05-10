<template>
    <div v-if="!products.length" class="Comparator-no-product">
        <p class="Comparator-no-product__p">{{ Translator.trans('asdoria_sylius_comparator_bundle.ui.no_product') }}</p>
        <button class="js-prev-page Comparator-button ui button orange">
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
                    <td v-for="(product, index) in products" class="Comparator-data-product">
                        <Review :product="product" :index="index"/>
                    </td>
                </tr>

                <tr>
                    <td class="Comparator-data-left">
                        <p class="Comparator-data-name text bold" style="width: calc(100vw - 48px)">
                            {{ Translator.trans('asdoria_sylius_comparator_bundle.ui.description') }}</p>
                    </td>
                    <td v-for="product in products" class="Comparator-data-product">
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
                    <td v-for="product in products" class="Comparator-data-product">
                        <a class="Button Comparator-link Comparator-link__main-taxon Comparator-data-value link black"
                           :href="getTaxonInfosByLocale(product.mainTaxon) ? getTaxonInfosByLocale(product.mainTaxon).url : '#'">
                            {{ getTaxonInfosByLocale(product.mainTaxon) ? getTaxonInfosByLocale(product.mainTaxon).name : 'Loading...' }}
                        </a>
                    </td>
                </tr>

                <tr>
                    <td class="Comparator-data-left">
                        <p class="Comparator-data-name text bold" style="width: calc(100vw - 48px)">
                            {{ Translator.trans('asdoria_sylius_comparator_bundle.ui.secondary_taxons') }}</p>
                    </td>
                    <td v-for="product in products" class="Comparator-data-product">
                        <div class="Comparator-data-value">
                            <a v-for="(taxon, index) in product.productTaxons"
                               :href="getTaxonInfosByLocale(taxon) ? getTaxonInfosByLocale(taxon).url : '#'"
                               class="Button Comparator-link Comparator-link__secondary-taxons link black">
                                {{ getTaxonInfosByLocale(taxon) ? getTaxonInfosByLocale(taxon).name : 'Loading...' }}
                                <span v-if="index !== product.productTaxons.length - 1" class="text black marged-right-small">|</span>
                            </a>
                        </div>
                    </td>
                </tr>

                <tr v-for="attribute in attributes" class="Comparator-attribute">
                    <td class="Comparator-attribute-left Comparator-data-left">
                        <p class="Comparator-data-name text bold" style="width: calc(100vw - 48px)">
                            {{ getAttributeNameByLocale(attribute) }}</p>
                    </td>

                    <td v-for="product in products"
                        class="Comparator-attribute-product Comparator-data-product">
                        <div v-if="Array.isArray(getAttributeValue(attribute.id, product))"
                             v-for="val in getAttributeValue(attribute.id, product)">
                            <div class="js-comparator-string-to-html Comparator-data-value"
                                 :data-string-value="getAttributeValueByLocale(val)"></div>
                        </div>
                        <div v-else class="js-comparator-string-to-html Comparator-data-value"
                             :data-string-value="getAttributeValue(attribute.id, product)"></div>
                    </td>
                </tr>

                <tr>
                    <td class="Comparator-selection-left"></td>
                    <td v-for="product in products"
                        class="Comparator-selection-product">
                        <a class="Button Comparator-button ui orange fluid button" :href="getProductUrl(product)">
                            {{ Translator.trans('asdoria_sylius_comparator_bundle.ui.go_to_product') }}
                        </a>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </template>
</template>

<script>
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
        attributes: Array
    },
    setup ({ currencyCode, withTax, hasRating, attributes }) {

        const {
                  store: storage,
                  removeProduct: removeProductFromLocalStorage,
                  clean: cleanStorage,
                  updateProductNode,
                  getProductInformations
              } = useLocalStorageProducts()

        function remove (code) {
            removeProductFromLocalStorage(code)
        }

        [...storage.products].forEach(product => {
            getProductInformations(product, attributes)
        })

        const {
                  getSlidersCurrentIndex,
                  incrementSliderCurrentIndexImages,
                  decrementSliderCurrentIndexImages
              } = useStore().sliders();

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
            attributes,
            products: storage.products,
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
