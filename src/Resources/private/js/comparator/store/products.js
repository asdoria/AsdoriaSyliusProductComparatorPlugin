import { computed, ref } from 'vue'

const state = ref({
    products: []
})

export default () => {
    const getProductById = (id) => computed(() => state.value.products.find(product => product.id === id ))
    const pushProduct = (product) => state.value.products.push(product)

    const setProducts = (products) => state.value.products = products
    const getProducts = () => computed(() => state.value.products)

    return {
        getProductById,
        pushProduct,
        setProducts,
        getProducts
    }
}
