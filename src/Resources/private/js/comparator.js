import { VM_COMPARATOR } from './comparator/common/selectors/vueInstances';
import Comparator from './comparator/components/Comparator';
import { createApp, reactive, watch } from 'vue';
import { init as initLocaleRouter, router as LocaleRouter } from './comparator/routing/LocaleRouter';
import { getProducts } from './comparator/modules/local-storage-products';
import { getDocumentLocale } from './comparator/common/helpers/locale';
import Api from './comparator/api/api';

const getAvailableAttributes = (attributes, availableAttributes, currentLocale) => attributes
    .filter(attr => availableAttributes.includes(Number(attr.attribute.split('/').slice(-1).toString())))
    .filter(({ localeCode }) => currentLocale === localeCode);

const guessAttributes = async (availableAttributes) => {
    const dataResponse = [];

    for (const product of getProducts()) {
        const { attributes } = product;
        if (attributes) {
            const filteredAttributes = getAvailableAttributes(attributes, availableAttributes, getDocumentLocale());
            const temp               = await Api.getAttributes(filteredAttributes);
            for (const attr of temp) {
                if (!dataResponse.find(({ id }) => id === attr.id)) {
                    dataResponse.push(attr);
                }
            }
        }
    }
    return dataResponse;
};

document.addEventListener('DOMContentLoaded', async () => {
    await initLocaleRouter();
    if (!VM_COMPARATOR) return;

    const config = JSON.parse(VM_COMPARATOR.dataset.config);
    const {
              currencyCode,
              withTax,
              availableAttributes
          }      = config;

    const attributes = await guessAttributes(availableAttributes);

    createApp(Comparator, {
        currencyCode,
        withTax,
        attributes
    })
        .mount(VM_COMPARATOR);
});
