import { AddToComparator, PrevPage } from './shop/index'
import { init as initLocaleRouter } from './comparator/routing/LocaleRouter'

document.addEventListener('DOMContentLoaded', async () => {
    await initLocaleRouter()
    AddToComparator()
    PrevPage()
})
