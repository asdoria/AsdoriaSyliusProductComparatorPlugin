import { computed, ref } from 'vue'

const state = ref({
    attributes: []
})

export default () => {
    const getAttributeById = (id) => computed(() => state.value.attributes.find(attribute => attribute.id === id ))
    const pushAttribute = (attribute) => state.value.attributes.push(attribute)

    const setAttributes = (attributes) => state.value.attributes = attributes
    const getAttributes = () => computed(() => state.value.attributes)

    return {
        getAttributeById,
        pushAttribute,
        setAttributes,
        getAttributes
    }
}
