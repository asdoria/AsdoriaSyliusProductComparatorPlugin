<template>
    <div class="Comparator-tooltip Comparator-data-value" :class="isTablet() && 'mx-4'">
        <div v-if="reviews.length">
            <span class="Comparator-tooltip-trigger">
                <template v-for="i in 5">
                    <i :class="i - 1 < product.averageRating ? 'text-yellow-500 text yellow':'opacity-50'"
                       class="Icon-star icon star marged-none"></i>
                </template>
                {{ Math.round(product.averageRating) }}/5
            </span>
            <div class="Comparator-tooltip-target Comparator-review-slider">
                <i v-if="reviews.length > 1" class="Icon-angle-left Comparator-review-slider__controls icon chevron left"
                   @click="decrementSliderCurrentIndexReviews(index, reviews.length)"></i>
                <div class="Comparator-review-slider__content">
                    <div class="Comparator-review-slider__div">
                        <template v-for="i in 5">
                            <i :class="i - 1 < reviews[getSlidersCurrentIndex(index).reviews].rating ? 'text-yellow-500 text yellow':'opacity-50'"
                               class="Icon-star icon star marged-none"></i>
                        </template> -
                        <span class="Comparator-review-slider__span">{{ reviews[getSlidersCurrentIndex(index).reviews].title }}</span>
                        <hr>
                    </div>
                    <p>"{{ reviews[getSlidersCurrentIndex(index).reviews].comment }}"</p>
                </div>
                <i v-if="reviews.length > 1" class="Icon-angle-right Comparator-review-slider__controls icon chevron right"
                   @click="incrementSliderCurrentIndexReviews(index, reviews.length)"></i>
            </div>
        </div>
    </div>
</template>

<script>
import { isTablet } from '../common/utils/viewport'
import { onBeforeMount, ref } from 'vue';
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
                    if (res.status === 'accepted') {
                        reviews.value.push(res)
                    }
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
