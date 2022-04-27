import Routing from '~/public/bundles/fosjsrouting/js/router.min.js'
import axios from 'axios'
import { getDocumentLocale } from '../common/helpers/locale'

class Router {
    static routing

    constructor () {
        if (!Router.instance) {
            Router.routing = Routing
            Router.instance = this
        }

        return Router.instance
    }

    static async init() {
        const { data: { routes } } = await axios.get('/js/fos_js_routes.json')
        Router.routing.setRoutes(routes)

        return Router.instance
    }

    /**
     *
     * @param route  string
     * @param params object
     * @returns {*}
     */
    generate (route, params = {}) {
        const routeName = Router.routing.generate(route, params, false)
        return routeName
    }

    getRoute(route) {
      return Router.routing.getRoute(route)
    }
}

const router = new Router();
const init = () => Router.init()

export {
    init,
    router
}
