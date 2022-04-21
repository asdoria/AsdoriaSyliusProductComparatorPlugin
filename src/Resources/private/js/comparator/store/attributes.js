import { computed, ref } from 'vue'

const state = ref({
    attributes: []
})

export default () => {
    const getAttributeById = (id) => computed(() => state.value.attributes.find(attribute => attribute.id === id ))
    const pushAttribute = (attribute) => state.value.attributes.push(attribute)

    return {
        getAttributeById,
        pushAttribute
    }
}
