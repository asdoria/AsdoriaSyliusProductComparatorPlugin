import axios from 'axios'
import useStore from '../store/store'
import { router as LocaleRouter } from '../routing/LocaleRouter'
import { ROUTES_FOS } from '../routing/routes'

const { getAttributeById, pushAttribute } = useStore().attributes()
const { getTaxonByCode, pushTaxon }         = useStore().taxons()

const config = {
    headers: {
        accept: 'application/ld+json',
    }
}

export default class Api {
    /**
     *
     * @param codes
     * @param withMainTaxon
     * @returns {Promise<*[]>}
     */
    static async getProductsByCodes (codes, withMainTaxon = false) {
        let products = []

        for (const code of codes) {
            const productRoute = LocaleRouter.generate(ROUTES_FOS._API_PRODUCT_ITEM, { code })
            const { data }     = await axios.get(productRoute, config)

            if (withMainTaxon) {
                data.mainTaxon = await Api.getProductTaxon(data.mainTaxon)
            }

            const secondaryTaxons = await this.getProductSecondaryTaxons(data.productTaxons)
            data.productTaxons    = secondaryTaxons

            const attributes = await this.getProductAttributes(data.attributes)
            data.attributes  = attributes

            const variants = await this.getProductVariants(data.variants)
            data.variants  = variants

            products.push(data)
        }

        return products
    }

    static async getProductImage (apiUrl) {
        try {
            const { data } = await axios.get(apiUrl, config) ?? null

            return data
        } catch (e) {
            return null
        }
    }

    static async getProductTaxon (apiUrl) {
        try {
            const { data } = await axios.get(apiUrl, config)

            const taxonInStore = getTaxonByCode(data.code).value
            if (taxonInStore) {
                return taxonInStore
            }

            pushTaxon(data)

            return data
        } catch (e) {
            return null
        }
    }

    static async getProductSecondaryTaxons (apiUrls) {
        try {
            let secondaryTaxons = []
            for (const apiUrl of apiUrls) {
                // get taxon api url
                const { data } = await axios.get(apiUrl, config)

                // get taxon code
                const { data: { code: taxonCode = null } } = await axios.get(data.taxon, config)

                // get taxon
                const taxonInStore = getTaxonByCode(taxonCode).value

                if (taxonInStore) {
                    secondaryTaxons.push(taxonInStore)
                    continue
                }

                const taxonRoute = LocaleRouter.generate(ROUTES_FOS._API_TAXON_ITEM, { code: taxonCode })
                const res        = await axios.get(taxonRoute, config)
                secondaryTaxons.push(res.data)

                // add taxon in store
                pushTaxon(res.data)
            }
            return secondaryTaxons
        } catch (e) {
            return null
        }
    }

    static async getProductAttributes (apiUrls) {
        try {
            let attributes = []
            for (const apiUrl of apiUrls) {
                const attributeInStore = getAttributeById(apiUrl.attribute).value
                let dataAttribute = attributeInStore
                if (!attributeInStore) {
                    const { data } = await axios.get(apiUrl.attribute, config)
                    dataAttribute = {
                        id: data['@id'],
                        configuration: data.configuration,
                        translations: data.translations,
                        position: data.position
                    }
                    pushAttribute(dataAttribute)
                }

                if (dataAttribute.configuration.choices) {
                    const selectedValues = [];
                    [...apiUrl.value].forEach(apiVal => {
                        const { configuration: { choices: { [apiVal]: value } } } = dataAttribute
                        selectedValues.push(value)
                    })
                    apiUrl.value = selectedValues
                }

                const attribute = {
                    id: apiUrl.id,
                    code: dataAttribute.id,
                    translations: dataAttribute.translations,
                    value: apiUrl.value,
                    position: dataAttribute.position
                }

                attributes.push(attribute)
            }

            return attributes.sort((a, b) => { return a.position - b.position })
        } catch (e) {
            return null
        }
    }

    static async getProductVariants (apiUrls) {
        try {
            let variants = []
            for (const apiUrl of apiUrls) {
                const { data } = await axios.get(apiUrl, config)
                variants.push(data)
            }
            return variants
        } catch (e) {
            return null
        }
    }

    static async getProductReview (apiUrl) {
        try {
            const { data } = await axios.get(apiUrl, config)

            return data
        } catch (e) {
            return null
        }
    }
}
