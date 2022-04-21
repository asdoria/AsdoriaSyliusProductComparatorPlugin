import { router as LocaleRouter } from '../routing/LocaleRouter'
import { ROUTES_CATALOG, ROUTES_FOS } from '../routing/routes'

export default function useProductHelper () {
    /**
     *
     * @param attributeCode
     * @param product
     * @returns {null}
     */
    function getAttributeValue (attributeCode, product) {
        if (!product.attributes) return null

        const { value = null } = product.attributes.find(attr => attr.code === attributeCode) || {}
        return value
    }

    function getAttributeValueByLocale (attributeValue) {
        if (!attributeValue) return null

        const _locale = LocaleRouter.getLocale()
        return attributeValue[_locale]
    }

    function getAttributeNameByLocale (attribute) {
        if (!attribute) return null
        try {
            const _locale                                   = LocaleRouter.getLocale()
            const { translations: { [_locale]: { name } } } = attribute
            return name
        } catch (e) {
            return null
        }
    }

    /**
     *
     * @param group
     * @param product
     * @returns {*}
     */
    function getPictograms (group, product) {
        if (!product.productPictograms) return null

        const pictograms = product.productPictograms.filter(pict => pict.group === group) || []

        return pictograms.sort((a, b) => a.position - b.position)
    }

    /**
     *
     * @param productImg
     * @returns {string|*}
     */
    function getImageUrl (productImg) {
        if (!productImg || !productImg.path) return 'http://placehold.it/200x200'

        return LocaleRouter.generate(ROUTES_FOS._LIIP_FILTER, {
            'filter': 'sylius_shop_product_thumbnail',
            'path': productImg.path
        })
    }

    /**
     *
     * @param product
     * @returns {*}
     */
    function getProductUrl (product) {
        if (!product) return null

        const _locale                                         = LocaleRouter.getLocale()
        const { translations: { [_locale]: { slug: slug } } } = product
        return LocaleRouter.generate(ROUTES_CATALOG.PRODUCT_SHOW, { slug, _locale })
    }

    function getTaxonInfosByLocale (taxon) {
        if (!taxon) return null

        const _locale                                         = LocaleRouter.getLocale()
        const { translations: { [_locale]: { name, slug } } } = taxon
        const url                                             = LocaleRouter.generate(ROUTES_CATALOG.PRODUCT_INDEX, {
            slug,
            _locale
        })
        return { name, url }
    }

    /**
     *
     * @param variants
     */
    function getVariant ({ variants = [] }) {
        const [variant, ..._] = Object.values(variants)

        return variant
    }

    /**
     *
     * @param product
     */
    function getPrice (product) {
        const { price }             = getVariant(product)
        const { currency, current } = price

        return currency && current ? `${ current / 100 } ${ currency }` : price
    }

    return {
        getAttributeValue,
        getAttributeValueByLocale,
        getAttributeNameByLocale,
        getPictograms,
        getImageUrl,
        getProductUrl,
        getTaxonInfosByLocale,
        getPrice,
    }
}
