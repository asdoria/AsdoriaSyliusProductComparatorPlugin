import { reactive, watch } from 'vue'

export default function useFetchAttributes (products) {
    const state = reactive({
        data: [],
    })

    watch(() => products.data, (value) => {
        if (!products.data) return

        state.data = products.data.reduce((acc, product) => {
            if (!product.attributes) return acc

            product.attributes.forEach((attr) => {
                if (acc.find(a => a.code === attr.code)) return

                acc.push(attr)
            })

            return acc
        }, [])
    })

    return state
}
