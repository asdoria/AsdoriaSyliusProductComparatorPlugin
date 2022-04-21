<template>
    <div class="Comparator-tooltip py-3 leading-none" :class="isTablet() && 'mx-4'">
        <div v-if="reviews.length">
            <span class="Comparator-tooltip-trigger">
                <template v-for="i in 5">
                    <i :class="i - 1 < product.averageRating ? 'text-yellow-500':'opacity-50'"
                       class="Icon-star"></i>
                </template>
                {{ product.averageRating }}/5
            </span>
            <div class="Comparator-tooltip-target">
                <i v-if="product.reviews.length > 1" class="Icon-angle-left cursor-pointer"
                   @click="decrementSliderCurrentIndexReviews(index, product.reviews.length)"></i>
                <div class="flex-grow mx-4">
                    <div class="mb-4">
                        <template v-for="i in 5">
                            <i :class="i - 1 < reviews[getSlidersCurrentIndex(index).reviews].rating ? 'text-yellow-500':'opacity-50'"
                               class="Icon-star"></i>
                        </template> -
                        <span class="italic">{{ reviews[getSlidersCurrentIndex(index).reviews].title }}</span>
                        <hr class="mt-1">
                    </div>
                    <p>"{{ reviews[getSlidersCurrentIndex(index).reviews].comment }}"</p>
                </div>
                <i v-if="product.reviews.length > 1" class="Icon-angle-right cursor-pointer"
                   @click="incrementSliderCurrentIndexReviews(index, product.reviews.length)"></i>
            </div>
        </div>
    </div>
</template>

<script>
import { isTablet } from '../common/utils/viewport'
import { onBeforeMount, ref } from 'vue'
import Api from '../api/api'
import useStore from '../store/store'

export default {
    name: 'Review',
    props: {
        product: Object,
        index: Number
    },
    setup ({ product, index }) {
        const reviews = ref([])

        onBeforeMount(() => {
            product.reviews.forEach(reviewUrl => {
                Api.getProductReview(reviewUrl).then(res => {
                    reviews.value.push(res)
                })
            })
        })

        const {
                  getSlidersCurrentIndex,
                  incrementSliderCurrentIndexReviews,
                  decrementSliderCurrentIndexReviews
              } = useStore().sliders()

        return {
            reviews,
            index,
            getSlidersCurrentIndex,
            incrementSliderCurrentIndexReviews,
            decrementSliderCurrentIndexReviews,
            isTablet
        }
    }
}
</script>
