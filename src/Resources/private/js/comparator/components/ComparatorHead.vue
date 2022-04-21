<template>
    <thead>
    <tr>
        <th class="text-xl text-left bg-base-blue p-8 text-white text-lg font-heading align-top" :style="getWidthCell">
            {{Translator.trans('app.comparator.header_title')}}
            <span class="w-6 h-6 rounded-full bg-white flex-flow-center mt-4">
                <i class="Icon-arrow-right text-base-blue block font-bold"></i>
            </span>
        </th>
        <th v-for="(product, index) in products.data"
            class="text-md p-5 text-center"
            :style="getWidthCell">
            <button @click="() => {removeProduct(product.code)}" class="mb-8">
                <i class="Icon-close text-xl font-bold"></i>
            </button>
            <div class="flex items-center" :class="product.images.length > 1 ? 'justify-between' : 'justify-around'">
                <i v-if="product.images.length > 1" class="Icon-angle-left cursor-pointer text-3xl" @click="decrementSliderCurrentIndexImages(index, product.images.length)"></i>
                <a :href="getProductUrl(product)" class="Comparator-image-wrapper p-2 bg-white block">
                    <img :src="getImageUrl(product.images[getSlidersCurrentIndex(index).images])"
                         :alt="product.name"
                         class="object-cover mx-auto h-full">
                </a>
                <i v-if="product.images.length > 1" class="Icon-angle-right cursor-pointer text-3xl" @click="incrementSliderCurrentIndexImages(index, product.images.length)"></i>
            </div>
            <div data-height-group="comparator-title-product">
                <a class="Comparator-link block font-bold mb-2" :href="getProductUrl(product)">{{ product.name }}</a>
                <p class="text-xs pb-4 font-light">{{ product.code }}</p>
            </div>
            <p class="bg-base-gray rounded-lg py-2">
                {{ Object.values(product.variants)[0].price/100 }}
                {{ currencyCode }}
                {{ withTax ? Translator.trans('app.comparator.ttc') : Translator.trans('app.comparator.ht') }}
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
                width: 100 / ([...this.products.data].length + 1) + '%',
            }
        }
    },
    setup ({ currencyCode, withTax }) {
        const { getProductUrl, getPrice, getImageUrl } = useProductHelper();

        const { getSlidersCurrentIndex, incrementSliderCurrentIndexImages, decrementSliderCurrentIndexImages } = useStore().sliders()

        return {
            currencyCode,
            withTax,
            getSlidersCurrentIndex,
            incrementSliderCurrentIndexImages,
            decrementSliderCurrentIndexImages,
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
