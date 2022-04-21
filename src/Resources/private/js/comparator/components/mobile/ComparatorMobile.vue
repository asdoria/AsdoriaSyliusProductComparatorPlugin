<template>
    <div v-if="!products.data.length" class="px-4">
        <p class="pb-4 text-xl">{{ Translator.trans('app.comparator.no_products') }}</p>
        <button class="js-prev-page Comparator-link bg-base-orange text-white font-bold rounded-lg p-3 text-center">
            {{ Translator.trans('sylius.base.back') }}
        </button>
    </div>

    <div v-else class="o-full mb-8">
        <div class="text-xl text-left bg-base-blue p-8 text-white font-heading">
            {{ Translator.trans('app.comparator.header_title') }}
            <span class="w-6 h-6 rounded-full bg-white flex-flow-center mt-4">
                <i class="Icon-arrow-right text-base-blue block font-bold"></i>
            </span>
        </div>
    </div>
    <div class="overflow-x-auto max-w-full relative">
        <table class="Comparator-table pb-40 relative">
            <tbody ref="comparator">
            <ComparatorMobileHead :products="products"
                                  :removeProduct="remove"
                                  :currencyCode="currencyCode"
                                  :withTax="withTax"/>

            <tr v-if="hasRating" class="flex w-full relative">
                <td class="absolute left-0 right-0 text-center py-2">
                    <p class="sticky left-0 font-bold" style="width: calc(100vw - 48px)">
                        {{ Translator.trans('app.comparator.ratings') }}</p>
                </td>
                <td v-for="(product, index) in products.data" class="w-full pt-10 not-last:mr-2">
                    <Review :product="product" :index="index"/>
                </td>
            </tr>

            <tr class="flex w-full relative">
                <td class="absolute left-0 right-0 text-center py-2">
                    <p class="sticky left-0 font-bold" style="width: calc(100vw - 48px)">
                        {{ Translator.trans('app.comparator.description') }}</p>
                </td>
                <td v-for="product in products.data" class="w-full pt-10 not-last:mr-2">
                    <div class="px-4 py-3 leading-none">
                        <div class="js-comparator-string-to-html line-clamp-3"
                           :data-string-value="product.description"></div>
                    </div>
                </td>
            </tr>

            <tr class="flex w-full relative">
                <td class="absolute left-0 right-0 text-center py-2">
                    <p class="sticky left-0 font-bold" style="width: calc(100vw - 48px)">
                        {{ Translator.trans('app.comparator.main_taxon') }}</p>
                </td>
                <td v-for="product in products.data" class="w-full pt-10 not-last:mr-2">
                    <a class="Button Comparator-link text-left block px-4 py-3 leading-none capitalize"
                       :href="getTaxonInfosByLocale(product.mainTaxon).url">
                        {{ getTaxonInfosByLocale(product.mainTaxon).name }}
                    </a>
                </td>
            </tr>

            <tr class="flex w-full relative">
                <td class="absolute left-0 right-0 text-center py-2">
                    <p class="sticky left-0 font-bold" style="width: calc(100vw - 48px)">
                        {{ Translator.trans('app.comparator.product_taxons') }}</p>
                </td>
                <td v-for="product in products.data" class="w-full pt-10 not-last:mr-2">
                    <div class="px-4 py-3 leading-none">
                        <a v-for="(taxon, index) in product.productTaxons" :href="getTaxonInfosByLocale(taxon).url"
                           class="Button Comparator-link text-left capitalize inline-block px-0 pt-0 pb-1">
                            {{ getTaxonInfosByLocale(taxon).name }}
                            <span v-if="index !== product.productTaxons.length - 1" class="pr-1">|</span>
                        </a>
                    </div>
                </td>
            </tr>

            <tr v-for="attribute in attributes.data" class="Comparator-attribute flex w-full relative">
                <td class="Comparator-attribute-left absolute left-0 right-0 text-center py-2">
                    <p class="sticky left-0 font-bold" style="width: calc(100vw - 48px)">
                        {{ getAttributeNameByLocale(attribute) }}</p>
                </td>

                <td v-for="product in products.data"
                    class="Comparator-attribute-product w-full text-left pt-10 not-last:mr-2">
                    <div v-if="Array.isArray(getAttributeValue(attribute.code, product))"
                         v-for="val in getAttributeValue(attribute.code, product)">
                        <div class="js-comparator-string-to-html px-4 py-3 leading-none"
                           :data-string-value="getAttributeValueByLocale(val)"></div>
                    </div>
                    <div v-else class="js-comparator-string-to-html px-4 py-3 leading-none"
                       :data-string-value="getAttributeValue(attribute.code, product)"></div>
                </td>
            </tr>

            <tr class="flex w-full relative">
                <td class="Comparator-selection-left absolute left-0 right-0 py-2"></td>
                <td v-for="product in products.data"
                    class="Comparator-selection-product w-full pt-10 not-last:mr-2 px-4">
                    <a class="Button Comparator-button font-bold rounded-lg block px-4 py-3 text-center" href="#">
                        {{ Translator.trans('app.comparator.add_to_selection') }}
                    </a>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import useFetchProducts from '../../modules/fetch-products'
import useFetchAttributes from '../../modules/fetch-attributes'
import useProductHelper from '../../modules/product-helper'
import useLocalStorageProducts from '../../modules/local-storage-products'
import { onMounted, ref, onUpdated } from 'vue'
import useStore from '../../store/store'
import Review from '../Review'
import ComparatorMobileHead from './ComparatorMobileHead'

export default {
    name: 'ComparatorMobile',
    components: {
        ComparatorMobileHead,
        Review,
    },
    props: {
        currencyCode: String,
        withTax: Boolean,
        hasRating: Boolean
    },
    setup ({ currencyCode, withTax, hasRating }) {

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
