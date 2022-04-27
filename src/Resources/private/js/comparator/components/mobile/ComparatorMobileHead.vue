<template>
    <tr>
        <td class="Comparator-data-left">
            <p class="Comparator-data-name text bold" style="width: calc(100vw - 48px)">
                {{ Translator.trans('asdoria_sylius_comparator_bundle.ui.specifications') }}</p>
        </td>
        <td v-for="(product, index) in products.data"
            class="Comparator-data-product center aligned">
            <button @click="removeProduct(product.code)" class="Comparator-data-product__button marged-bottom">
                <i class="Icon-close icon close"></i>
            </button>
            <div class="Comparator-data-product-slider">
                <a :href="getProductUrl(product)" class="Comparator-data-product-slider__content">
                    <img :src="getImageUrl(product.images[getSlidersCurrentIndex(index).images])"
                         :alt="product.name" class="Comparator-product-image">
                </a>
                <div class="Comparator-data-product-slider__controls">
                    <i v-if="product.images.length > 1" class="Icon-angle-left" @click="decrementSliderCurrentIndexImages(index, product.images.length)"></i>
                    <i v-if="product.images.length > 1" class="Icon-angle-right" @click="incrementSliderCurrentIndexImages(index, product.images.length)"></i>
                </div>
            </div>
            <div data-height-group="comparator-title-product">
                <a class="Comparator-link link black" :href="getProductUrl(product)">{{ getProductNameByLocale(product) }}</a>
                <p class="Comparator-data-product-code text very small light">{{ product.code }}</p>
            </div>
            <p class="Comparator-data-product-price ui tertiary segment">
                {{ Object.values(product.variants)[0].price/100 }}
                {{ currencyCode }}
                {{ withTax ? Translator.trans('asdoria_sylius_comparator_bundle.ui.ttc') : Translator.trans('asdoria_sylius_comparator_bundle.ui.ht') }}
            </p>
        </td>
    </tr>
</template>

<script>
import useProductHelper from '../../modules/product-helper'
import useStore from '../../store/store'

export default {
    name: 'ComparatorMobileHead',
    data () {
        return {
            widthCell: null
        }
    },
    props: {
        products: Object,
        removeProduct: Function,
        currencyCode: String,
        withTax: Boolean
    },
    computed: {
        getWidthCell () {
            return {
                width: 100 / ([...this.products.data].length + 1) + '%'
            }
        }
    },
    setup ({ currencyCode, withTax }) {
        const { getProductNameByLocale, getProductUrl, getPrice, getImageUrl } = useProductHelper();

        const { getSlidersCurrentIndex, incrementSliderCurrentIndexImages, decrementSliderCurrentIndexImages } = useStore().sliders()

        return {
            currencyCode,
            withTax,
            getSlidersCurrentIndex,
            incrementSliderCurrentIndexImages,
            decrementSliderCurrentIndexImages,
            getProductNameByLocale,
            getProductUrl,
            getPrice,
            getImageUrl,
            Translator,
        }
    },
}
</script>

<style scoped>

</style>
