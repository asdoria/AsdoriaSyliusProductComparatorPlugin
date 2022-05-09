import { VM_COMPARATOR } from './comparator/common/selectors/vueInstances'
import Comparator from './comparator/components/Comparator'
import { createApp, reactive, watch } from 'vue';
import { init as initLocaleRouter } from './comparator/routing/LocaleRouter'
import useFetchAttributes from './comparator/modules/fetch-attributes';
import { getProducts } from './comparator/modules/local-storage-products';

const  guessAttributes = (availableAttributes) => {
    return getProducts().reduce((acc, product) => {
            const { attributes } = product.node
            if (!attributes) return acc

            attributes
                .filter(({id}) => availableAttributes.includes(id))
                .forEach((attr) => {
                    if (acc.find(a => a.code === attr.code)) return
                    acc.push(attr)
                })

            return acc
        }, [])
}

document.addEventListener('DOMContentLoaded', async () => {
    await initLocaleRouter()
    if (!VM_COMPARATOR) return

    const config                                         = JSON.parse(VM_COMPARATOR.dataset.config)
    const { currencyCode, withTax, availableAttributes } = config

    createApp(Comparator, {
        currencyCode,
        withTax,
        attributes: guessAttributes(availableAttributes)
    }).mount(VM_COMPARATOR)
})
