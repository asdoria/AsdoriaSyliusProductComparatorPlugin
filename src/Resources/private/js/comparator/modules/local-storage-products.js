import { reactive } from 'vue'
import {setProductItems} from "../helpers/local-storage-helper";
import useProductHelper from '../modules/product-helper';
import Api from '../api/api';

const {
            getTaxonInfosByLocale
      } = useProductHelper()

const STORAGE_KEY = 'sylius_comparator';

export const getProducts = () => JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || [];

export default function useLocalStorageProducts () {
    const store = reactive({
        products: [],
    })

    store.products = getProducts();

    /**
     *
     * @returns {*[]}
     */
    function getCodes () {
        return store.products.map(({code}) => code)
    }

    /**
     *
     * @param code
     */
    function removeProduct (code) {
        const index = store.products.findIndex(p => p.code === code)

        store.products.splice(index, 1)

        updateLocalStorage()
    }

    /**
     *
     */
    function updateLocalStorage () {
        setProductItems(store.products)
    }

    /**
     *
     * @param code
     * @param node
     */
    function updateProductNode(code, node) {
        const product = store.products.find((product) => product.code === code);

        product.node = node;

        const expireDate = new Date();
        expireDate.setHours(expireDate.getHours() + 4);

        product.expireDate = expireDate;

        updateLocalStorage();
    }

    /**
     *
     * @param products
     */
    function clean(products) {
        const codes           = products.map(({code}) => code);
        const storageCodes    = getCodes();
        const emptyProducts = storageCodes.filter(code => !codes.includes(code));

        emptyProducts.forEach(code => removeProduct(code))
    }

    function getProductInformations(product, attributes) {
        Api.getProductTaxon(product.mainTaxon).then(res => {
            product.mainTaxon = res
        })

        Api.getProductSecondaryTaxons(product.productTaxons).then(res => {
            product.productTaxons = res
        })

        Api.getProductVariants(product.variants).then(res => {
            product.variants = res
        })

        const attributesId = attributes.map(attr => attr.id)
        const productAttributes = product.attributes.filter(attr => attributesId.includes(attr.id))
        Api.getProductAttributes(productAttributes).then(res => {
            product.attributes = res
            console.log(product);
        })
    }

    return {
        store,
        getCodes,
        removeProduct,
        clean,
        updateProductNode,
        getProductInformations
    }
}
