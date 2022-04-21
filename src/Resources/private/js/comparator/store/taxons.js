import { computed, ref } from 'vue'

const state = ref({
    taxons: []
})

export default () => {
    const getTaxonByCode = (code) => computed(() => state.value.taxons.find(taxon => taxon.code === code ))
    const pushTaxon = (taxon) => state.value.taxons.push(taxon)

    return {
        getTaxonByCode,
        pushTaxon
    }
}
