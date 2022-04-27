import {init as initRouter} from './Router';
import { getDocumentLocale } from '../common/helpers/locale'

class LocaleRouter {
    static locale;
    static router;

    static async init() {
        if (LocaleRouter.router) return;

        LocaleRouter.router = await initRouter()
        LocaleRouter.setLocale(getDocumentLocale())
    }

    /**
     *
     * @param locale
     */
    static setLocale(locale) {
        LocaleRouter.locale = locale;
    }

    /**
     *
     * @returns locale
     */
    static getLocale() {
        return LocaleRouter.locale;
    }

    /**
     *
     * @param routeName
     * @param params
     * @param hasLocaleSuffix
     * @returns {*}
     */
    generate(routeName, params = {}, hasLocaleSuffix = false) {
        const route = LocaleRouter.router.getRoute(routeName);

        if (route.requirements._locale) {
            params._locale = LocaleRouter.getLocale();
        }

        return LocaleRouter.router.generate(
            this.replaceRouteNameParams(routeName) + (hasLocaleSuffix ? '.' + LocaleRouter.locale : ''),
            params,
            true
        );
    }

    /**
     *
     * @param routeName
     * @returns {*}
     */
    replaceRouteNameParams(routeName) {
        if (routeName.includes('%locale%')) {
            routeName = routeName.replace('%locale%', LocaleRouter.locale)
        }

        return routeName;
    }

    getRoute(route) {
        return LocaleRouter.router.getRoute(route)
    }
}


const router = new LocaleRouter();
const init = () => LocaleRouter.init()

export {
    init,
    router
}
