<template>
    <thead>
    <tr>
        <th class="Comparator-subheader ui basic top aligned padded inverted blue segment medium header" :style="getWidthCell">
            {{Translator.trans('asdoria_sylius_comparator_bundle.ui.header_title')}}
            <div class="Comparator-subheader-content__div">
                <i class="Icon-arrow-right icon arrow alternate circle right"></i>
            </div>
        </th>
        <th v-for="(product, index) in products"
            class="Comparator-head-product center aligned"
            :style="getWidthCell">
            <button @click="() => {removeProduct(product.code)}" class="Comparator-head-product__button marged-bottom" :aria-label="Translator.trans('asdoria_sylius_comparator_bundle.ui.remove')">
                <i class="Icon-close icon close"></i>
            </button>
            <div class="Comparator-head-product-slider" :class="product.images.length > 1 ? 'justify-between' : 'justify-around'">
                <i v-if="product.images.length > 1" class="Icon-angle-left Comparator-head-product-slider__controls icon chevron left" @click="decrementSliderCurrentIndexImages(index, product.images.length)"></i>
                <a :href="getProductUrl(product)" class="Comparator-head-product-slider__content">
                    <img :src="getImageUrl(product.images[getSlidersCurrentIndex(index).images])"
                         :alt="product.name" class="Comparator-product-image">
                </a>
                <i v-if="product.images.length > 1" class="Icon-angle-right Comparator-head-product-slider__controls icon chevron right" @click="incrementSliderCurrentIndexImages(index, product.images.length)"></i>
            </div>
            <div data-height-group="comparator-title-product">
                <a class="Comparator-link link black" :href="getProductUrl(product)">{{ getProductNameByLocale(product) }}</a>
                <p class="Comparator-head-product-code text very small light">{{ product.code }}</p>
            </div>
            <p class="Comparator-head-product-price ui tertiary segment">
                {{ Object.values(product.variants)[0].price/100 }}
                {{ currencyCode }}
                {{ withTax ? Translator.trans('asdoria_sylius_comparator_bundle.ui.ttc') : Translator.trans('asdoria_sylius_comparator_bundle.ui.ht') }}
            </p>
        </th>
    </tr>
    </thead>
</template>

<script>
import useProductHelper from '../modules/product-helper'
import useStore from '../store/store'

export default {
    name: 'ComparatorHead',
    props: {
        products: Object,
        removeProduct: Function,
        currencyCode: String,
        withTax: Boolean
    },
    computed: {
        getWidthCell () {
            return {
                width: 100 / ([...this.products].length + 1) + '%',
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
