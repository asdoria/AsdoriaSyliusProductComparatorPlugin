<template>
    <template v-if="!isTablet()">
        <div v-if="!products.data.length" class="px-4">
            <p class="pb-4 text-xl">{{ Translator.trans('app.comparator.no_products') }}</p>
            <button class="js-prev-page Comparator-link bg-base-orange text-white font-bold rounded-lg p-3 text-center">
                {{ Translator.trans('sylius.base.back') }}
            </button>
        </div>
        <table class="Comparator-table border border-light-gray pb-40">

            <ComparatorHead :products="products"
                            :removeProduct="remove"
                            :currencyCode="currencyCode"
                            :withTax="withTax"/>

            <tbody>
            <tr>
                <td class="bg-base-blue text-white px-8 align-top">
                    <p class="py-3 leading-none uppercase font-bold">
                        {{ Translator.trans('app.comparator.features') }}</p>
                </td>
                <td v-for="product in products.data" class="px-8 align-top"></td>
            </tr>

            <tr v-if="hasRating">
                <td class="px-8 align-top">
                    <p class="py-3 leading-none font-bold">{{ Translator.trans('app.comparator.ratings') }}</p>
                </td>
                <td v-for="(product, index) in products.data" class="px-8 align-top">
                    <Review :product="product" :index="index"/>
                </td>
            </tr>

            <tr>
                <td class="px-8 align-top">
                    <p class="py-3 leading-none font-bold">{{
                            Translator.trans('app.comparator.description')
                        }}</p>
                </td>
                <td v-for="product in products.data" class="px-8 align-top">
                    <div class="py-3 leading-none">
                        <p class="js-comparator-string-to-html line-clamp-3"
                           :data-string-value="product.description"></p>
                    </div>
                </td>
            </tr>

            <tr>
                <td class="px-8 align-top">
                    <p class="py-3 leading-none font-bold">{{
                            Translator.trans('app.comparator.main_taxon')
                        }}</p>
                </td>
                <td v-for="product in products.data" class="px-8 align-top">
                    <a class="Button Comparator-link text-left block px-0 py-3 leading-none capitalize"
                       :href="getTaxonInfosByLocale(product.mainTaxon).url">
                        {{ getTaxonInfosByLocale(product.mainTaxon).name }}
                    </a>
                </td>
            </tr>

            <tr>
                <td class="px-8 align-top">
                    <p class="py-3 leading-none font-bold">{{
                            Translator.trans('app.comparator.product_taxons')
                        }}</p>
                </td>
                <td v-for="product in products.data" class="px-8 align-top">
                    <div class="py-3 leading-none">
                        <a v-for="(taxon, index) in product.productTaxons"
                           :href="getTaxonInfosByLocale(taxon).url"
                           class="Button Comparator-link text-left capitalize inline-block px-0 pt-0 pb-1">
                            {{ getTaxonInfosByLocale(taxon).name }}
                            <span v-if="index !== product.productTaxons.length - 1"
                                  class="pr-1 text-black">|</span>
                        </a>
                    </div>
                </td>
            </tr>

            <!--                    <tr>-->
            <!--                        <td class="px-8 align-top">-->
            <!--                            <p class="py-3 leading-none font-bold">{{ Translator.trans('app.comparator.product_variants') }}</p>-->
            <!--                        </td>-->
            <!--                        <td v-for="product in products.data" class="px-8 align-top">-->
            <!--                            <div class="py-3 leading-none">-->
            <!--                                <p v-for="variant in product.variants">{{ variant.code }}</p>-->
            <!--                            </div>-->
            <!--                        </td>-->
            <!--                    </tr>-->

            <tr v-for="attribute in attributes.data.filter(attr => availableAttributes.includes(attr.id))"
                class="Comparator-attribute">
                <td class="Comparator-attribute-left px-8 align-top">
                    <p class="py-3 leading-none font-bold">{{ getAttributeNameByLocale(attribute) }}</p>
                </td>

                <td v-for="product in products.data" class="Comparator-attribute-product px-8 align-top">
                    <div v-if="Array.isArray(getAttributeValue(attribute.code, product))"
                         v-for="val in getAttributeValue(attribute.code, product)" class="py-3 leading-none">
                        <p class="js-comparator-string-to-html"
                           :data-string-value="getAttributeValueByLocale(val)"></p>
                    </div>
                    <p v-else class="js-comparator-string-to-html py-3 leading-none"
                       :data-string-value="getAttributeValue(attribute.code, product)"></p>
                </td>
            </tr>

            <tr>
                <td class="Comparator-selection-left px-8 align-top"></td>
                <td v-for="product in products.data" class="Comparator-selection-product p-8 align-top">
                    <a class="Button Comparator-button bg-base-orange text-white font-bold rounded-lg block p-3 text-center"
                       href="#">
                        {{ Translator.trans('app.comparator.add_to_selection') }}
                    </a>
                </td>
            </tr>

            </tbody>
        </table>
    </template>

    <template v-else>
        <ComparatorMobile :currencyCode="currencyCode" :withTax="withTax" :hasRating="hasRating"/>
    </template>

</template>

<script>
import { isTablet } from '../common/utils/viewport'
import useLocalStorageProducts from '../modules/local-storage-products'
import useFetchProducts from '../modules/fetch-products'
import useFetchAttributes from '../modules/fetch-attributes'
import useProductHelper from '../modules/product-helper'
import ComparatorHead from './ComparatorHead'
import ComparatorMobile from './mobile/ComparatorMobile'
import Review from './Review'
import { onUpdated, ref, watch } from 'vue'
import useStore from '../store/store'

export default {
    name: 'Comparator',
    components: {
        ComparatorHead,
        ComparatorMobile,
        Review,
    },
    props: {
        currencyCode: String,
        withTax: Boolean,
        availableAttributes: Array
    },
    setup ({ currencyCode, withTax, availableAttributes }) {
        const {
                  store: storage,
                  removeProduct: removeProductFromLocalStorage,
                  clean: cleanStorage,
                  updateProductNode
              } = useLocalStorageProducts()

        const { state: products, removeProduct } = useFetchProducts(storage.products, (products) => {
            cleanStorage(products)
            products.forEach(p => updateProductNode(p.code, p))
        })

        function remove (code) {
            removeProduct(code)
            removeProductFromLocalStorage(code)
        }

        const attributes = useFetchAttributes(products)

        let hasRating = false
        storage.products.forEach(product => {
            hasRating = product.node.reviews.length > 0
        })

        const {
                  getSlidersCurrentIndex,
                  incrementSliderCurrentIndexImages,
                  decrementSliderCurrentIndexImages
              } = useStore().sliders()

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
            availableAttributes,
            products,
            attributes,
            hasRating,
            remove,
            Translator,
            isTablet,
            getSlidersCurrentIndex,
            decrementSliderCurrentIndexImages,
            incrementSliderCurrentIndexImages,
            ...useProductHelper()
        }

    }
}
</script>

