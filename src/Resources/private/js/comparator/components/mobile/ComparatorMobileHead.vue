<template>
    <tr class="flex w-full relative">
        <td class="absolute left-0 right-0 bg-gray-700 text-white text-center py-2">
            <p class="sticky left-0 font-bold" style="width: calc(100vw - 48px)">
                {{ Translator.trans('app.comparator.specifications') }}</p>
        </td>
        <td v-for="(product, index) in products.data"
            class="w-full not-last:mr-2 bg-gray-50 text-md text-left p-5 text-center pt-12 flex flex-col">
            <button @click="removeProduct(product.code)" class="mb-8">
                <i class="Icon-close text-xl font-bold"></i>
            </button>
            <div class="flex flex-col items-center flex-1">
                <a :href="getProductUrl(product)" class="p-2 bg-white block flex flex-col">
                    <img :src="getImageUrl(product.images[getSlidersCurrentIndex(index).images])"
                         :alt="product.name"
                         class="object-cover w-full h-full">
                </a>
                <div class="flex justify-around">
                    <i v-if="product.images.length > 1" class="Icon-angle-left cursor-pointer text-3xl" @click="decrementSliderCurrentIndexImages(index, product.images.length)"></i>
                    <i v-if="product.images.length > 1" class="Icon-angle-right cursor-pointer text-3xl" @click="incrementSliderCurrentIndexImages(index, product.images.length)"></i>
                </div>
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
