import { ref } from 'vue'

const state = ref({
    slidersCurrentIndex: [
        { images: 0, reviews: 0 },
        { images: 0, reviews: 0 },
        { images: 0, reviews: 0 },
        { images: 0, reviews: 0 }
    ]
})

export default () => {
    const getSlidersCurrentIndex             = (productIndex) => state.value.slidersCurrentIndex[productIndex]
    const incrementSliderCurrentIndexImages  = (productIndex, nbImages) => {
        state.value.slidersCurrentIndex[productIndex].images = state.value.slidersCurrentIndex[productIndex].images + 1 >= nbImages ? 0 : state.value.slidersCurrentIndex[productIndex].images + 1
    }
    const decrementSliderCurrentIndexImages  = (productIndex, nbImages) => {
        state.value.slidersCurrentIndex[productIndex].images = state.value.slidersCurrentIndex[productIndex].images - 1 < 0 ? nbImages - 1 : state.value.slidersCurrentIndex[productIndex].images - 1
    }
    const incrementSliderCurrentIndexReviews = (productIndex, nbImages) => {
        state.value.slidersCurrentIndex[productIndex].reviews = state.value.slidersCurrentIndex[productIndex].reviews + 1 >= nbImages ? 0 : state.value.slidersCurrentIndex[productIndex].reviews + 1
    }
    const decrementSliderCurrentIndexReviews = (productIndex, nbImages) => {
        state.value.slidersCurrentIndex[productIndex].reviews = state.value.slidersCurrentIndex[productIndex].reviews - 1 < 0 ? nbImages - 1 : state.value.slidersCurrentIndex[productIndex].reviews - 1
    }

    return {
        getSlidersCurrentIndex,
        incrementSliderCurrentIndexImages,
        decrementSliderCurrentIndexImages,
        incrementSliderCurrentIndexReviews,
        decrementSliderCurrentIndexReviews,
    }
}
