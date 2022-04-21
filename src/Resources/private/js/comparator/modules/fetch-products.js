import { onMounted, reactive } from 'vue'
import Api from '../api/api'
import { getDocumentLocale } from '../common/helpers/locale'

export default function useFetchProducts (storage, callback = () => {}) {
    const state = reactive({
        data: [],
    });

    onMounted(async () => {
        const codes = storage
            .filter(p => !p.node || p.expireDate < Date.now() || p.locale !== getDocumentLocale())
            .map(p => p.code);

        if (!codes.length) {
            state.data = storage.map(({node}) => node || {});

            callback(state.data);
            return;
        }

        const products = await Api.getProductsByCodes(codes, true);

        state.data = storage.map(async s => {
            const fetchedProduct = products.find(p => p.code === s.code);

            if (codes.includes(s.code) && !fetchedProduct) {
                return null;
            }

            if (!fetchedProduct) {
                return s.node;
            }

            let secondaryTaxons = await Api.getProductSecondaryTaxons(fetchedProduct.productTaxons ?? '')

            let attributes = await Api.getProductAttributes(fetchedProduct.attributes ?? '')

            let variants = await Api.getProductVariants(fetchedProduct.variants ?? '')

            return {
                ...fetchedProduct,
                mainTaxon: await Api.getProductTaxon(fetchedProduct.mainTaxon ?? ''),
                productTaxons: secondaryTaxons,
                attributes,
                variants
            };
        }).filter(p => p);

        callback(state.data)
    })

    /**
     *
     * @param code
     */
    function removeProduct (code) {
        const index = state.data.findIndex(p => p.code === code)

        state.data.splice(index, 1)
    }

    return {
        state,
        removeProduct,
    }
}


