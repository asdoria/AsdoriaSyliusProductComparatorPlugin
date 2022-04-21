import { VM_COMPARATOR } from './comparator/common/selectors/vueInstances'
import Comparator from './comparator/components/Comparator'
import { createApp } from 'vue'
import { init as initLocaleRouter } from './comparator/routing/LocaleRouter'

document.addEventListener('DOMContentLoaded', async () => {
    await initLocaleRouter()
    if (!VM_COMPARATOR) return

    const config                                         = JSON.parse(VM_COMPARATOR.dataset.config)
    const { currencyCode, withTax, availableAttributes } = config

    createApp(Comparator, {
        currencyCode,
        withTax,
        availableAttributes
    }).mount(VM_COMPARATOR)
})
