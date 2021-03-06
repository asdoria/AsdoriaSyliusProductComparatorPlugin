import { router as LocaleRouter } from '../routing/LocaleRouter';
import { ROUTES_CATALOG, ROUTES_FOS } from '../routing/routes';
import { getDocumentLocale } from '../common/helpers/locale';

export default function useProductHelper() {
    /**
     *
     * @param attributeCode
     * @param product
     * @returns {null}
     */
    function getAttributeValue(attributeId, product) {
        if (!product.attributes) return null;

        const _locale = getDocumentLocale()
        const { value = null } = product.attributes.find(attr => attr.attribute === attributeId && attr.localeCode === _locale) || {};

        return value;
    }

    function getAttributeValueByLocale(attributeValue) {
        if (!attributeValue) return null;

        const _locale = getDocumentLocale();
        return attributeValue[_locale];
    }

    function getAttributeNameByLocale(attribute) {
        if (!attribute) return null;
        try {
            const { name } = attribute;
            return name;
        } catch (e) {
            return null;
        }
    }

    /**
     *
     * @param group
     * @param product
     * @returns {*}
     */
    function getPictograms(group, product) {
        if (!product.productPictograms) return null;

        const pictograms = product.productPictograms.filter(pict => pict.group === group) || [];

        return pictograms.sort((a, b) => a.position - b.position);
    }

    /**
     *
     * @param productImg
     * @returns {string|*}
     */
    function getImageUrl(productImg) {
        if (!productImg || !productImg.path) return '/assets/shop/img/200x200.png';
        const disabledSegmentPaths = ['media', 'image']
        return LocaleRouter.generate(ROUTES_FOS._LIIP_FILTER, {
            'filter': 'sylius_shop_product_thumbnail',
            'path': productImg.path.split('/').filter(n => n && !disabledSegmentPaths.includes(n)).join('/')
        });
    }

    function getProductNameByLocale(product) {
        try {
            if (!product) return null;
            const { name } = product;
            return name;
        } catch (e) {
            return ''
        }

    }

    /**
     *
     * @param product
     * @returns {*}
     */
    function getProductUrl(product) {
        try {
            if (!product) return null;

            const { slug } = product;
            return LocaleRouter.generate(ROUTES_CATALOG.PRODUCT_SHOW, { slug });
        } catch (e) {
            return '#'
        }
    }

    function getTaxonInfosByLocale(taxon) {
        try {
            if (!taxon) return null;

            const { name, slug }       = taxon;
            const url     = LocaleRouter.generate(ROUTES_CATALOG.PRODUCT_INDEX, { slug });

            return {
                name,
                url
            };
        } catch (e) {
            return {
                name: '',
                url: '#'
            }
        }
    }

    /**
     *
     * @param variants
     */
    function getVariant({ variants = [] }) {
        const [variant, ..._] = Object.values(variants);

        return variant;
    }

    /**
     *
     * @param product
     */
    function getPrice(product) {
        const { price } = getVariant(product);
        const {
                  currency,
                  current
              }         = price;

        return currency && current ? `${current / 100} ${currency}` : price;
    }

    return {
        getAttributeValue,
        getAttributeValueByLocale,
        getAttributeNameByLocale,
        getPictograms,
        getImageUrl,
        getProductNameByLocale,
        getProductUrl,
        getTaxonInfosByLocale,
        getPrice,
    };
}
