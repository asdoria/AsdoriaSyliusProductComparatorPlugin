<template>
    <template v-if="!isTablet()">
        <div v-if="!products.length" class="Comparator-no-product">
            <p class="Comparator-no-product__p">{{
                    Translator.trans('asdoria_sylius_comparator_bundle.ui.no_product')
                }}</p>
            <button class="js-prev-page Comparator-button ui button orange">
                {{ Translator.trans('asdoria_sylius_comparator_bundle.ui.back') }}
            </button>
        </div>
        <table v-else class="Comparator-table ui celled table">

            <ComparatorHead :products="products"
                            :removeProduct="remove"
                            :currencyCode="currencyCode"
                            :withTax="withTax"/>

            <tbody>
            <tr>
                <td class="Comparator-data-features ui basic inverted blue padded segment small header">
                    <p class="Comparator-data-features__p text upper bold">
                        {{ Translator.trans('asdoria_sylius_comparator_bundle.ui.features') }}</p>
                </td>
                <td v-for="product in products"></td>
            </tr>

            <tr v-if="hasRating">
                <td>
                    <p class="Comparator-data-name text bold">{{
                            Translator.trans('asdoria_sylius_comparator_bundle.ui.ratings')
                        }}</p>
                </td>
                <td v-for="(product, index) in products">
                    <Review :product="product" :index="index"/>
                </td>
            </tr>

            <tr>
                <td>
                    <p class="Comparator-data-name text bold">{{
                            Translator.trans('asdoria_sylius_comparator_bundle.ui.description')
                        }}</p>
                </td>
                <td v-for="product in products">
                    <div class="Comparator-data-value">
                        <p class="js-comparator-string-to-html line-clamp-3"
                           :data-string-value="product.description"></p>
                    </div>
                </td>
            </tr>

            <tr>
                <td>
                    <p class="Comparator-data-name text bold">{{
                            Translator.trans('asdoria_sylius_comparator_bundle.ui.main_taxon')
                        }}</p>
                </td>
                <td v-for="product in products">
                    <a class="Button Comparator-link Comparator-link__main-taxon Comparator-data-value link black"
                       :href="getTaxonInfosByLocale(product.mainTaxon).url">
                        {{ getTaxonInfosByLocale(product.mainTaxon).name }}
                    </a>
                </td>
            </tr>

            <tr>
                <td>
                    <p class="Comparator-data-name text bold">{{
                            Translator.trans('asdoria_sylius_comparator_bundle.ui.secondary_taxons')
                        }}</p>
                </td>
                <td v-for="product in products">
                    <template v-if="typeof product.productTaxons[0] === 'object'">
                        <div class="Comparator-data-value">
                            <a v-for="(taxon, index) in product.productTaxons"
                               :href="getTaxonInfosByLocale(taxon).url"
                               class="Button Comparator-link Comparator-link__secondary-taxons link black">
                                {{ getTaxonInfosByLocale(taxon).name }}
                                <span v-if="index !== product.productTaxons.length - 1" class="text black marged-right-small">|</span>
                            </a>
                        </div>
                    </template>
                    <template v-else>
                        <span class="Comparator-loader"></span>
                    </template>
                </td>
            </tr>

            <!--<tr>-->
            <!--    <td>-->
            <!--        <p class="Comparator-data-name text bold">{{ Translator.trans('app.comparator.product_variants') }}</p>-->
            <!--    </td>-->
            <!--    <td v-for="product in products.data">-->
            <!--        <div class="Comparator-data-value">-->
            <!--            <p v-for="variant in product.variants">{{ variant.code }}</p>-->
            <!--        </div>-->
            <!--    </td>-->
            <!--</tr>-->

            <tr v-for="attribute in attributes"
                class="Comparator-attribute">
                <td class="Comparator-attribute-left">
                    <p class="Comparator-data-name text bold">{{ getAttributeNameByLocale(attribute) }}</p>
                </td>

                <td v-for="product in products" class="Comparator-attribute-product">
                    <div v-if="Array.isArray(getAttributeValue(attribute.id, product))"
                         v-for="val in getAttributeValue(attribute.id, product)" class="Comparator-data-value">
                        <p class="js-comparator-string-to-html"
                           :data-string-value="getAttributeValueByLocale(val)"></p>
                    </div>
                    <p v-else class="js-comparator-string-to-html Comparator-data-value"
                       :data-string-value="getAttributeValue(attribute.id, product)"></p>
                </td>
            </tr>

            <tr>
                <td class="Comparator-selection-left"></td>
                <td v-for="product in products" class="Comparator-selection-product">
                    <a class="Button Comparator-button ui orange fluid button"
                       :href="getProductUrl(product)">
                        {{ Translator.trans('asdoria_sylius_comparator_bundle.ui.go_to_product') }}
                    </a>
                </td>
            </tr>

            </tbody>
        </table>
    </template>

    <template v-else>
        <ComparatorMobile :currencyCode="currencyCode" :withTax="withTax" :hasRating="hasRating"
                          :attributes="attributes"/>
    </template>

</template>

<script>
import { isTablet } from '../common/utils/viewport';
import useLocalStorageProducts from '../modules/local-storage-products';
import useProductHelper from '../modules/product-helper';
import ComparatorHead from './ComparatorHead';
import ComparatorMobile from './mobile/ComparatorMobile';
import Review from './Review';
import { onUpdated } from 'vue';
import useStore from '../store/store';
import Api from '../api/api';


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
        attributes: Array
    },
    setup({
        currencyCode,
        withTax,
        attributes
    }) {
        const {
                  store: storage,
                  removeProduct: removeProductFromLocalStorage,
                  clean: cleanStorage,
                  updateProductNode,
                  getProductInformations
              } = useLocalStorageProducts();

        function remove(code) {
            removeProductFromLocalStorage(code);
        }

        [...storage.products].forEach(product => {
            getProductInformations(product, attributes)
        })

        let hasRating = false;
        storage.products.forEach(({reviews}) => {
            hasRating = reviews.length > 0;
        });

        const {
                  getSlidersCurrentIndex,
                  incrementSliderCurrentIndexImages,
                  decrementSliderCurrentIndexImages
              } = useStore()
            .sliders();

        onUpdated(() => {
            const domEls = document.querySelectorAll('.js-comparator-string-to-html');
            [...domEls].forEach(domEl => {
                const { stringValue } = domEl.dataset;
                domEl.innerHTML       = stringValue ?? '';
            });
        });

        return {
            currencyCode,
            withTax,
            attributes,
            products: storage.products,
            hasRating,
            remove,
            Translator,
            isTablet,
            getSlidersCurrentIndex,
            decrementSliderCurrentIndexImages,
            incrementSliderCurrentIndexImages,
            ...useProductHelper()
        };

    }
};
</script>

