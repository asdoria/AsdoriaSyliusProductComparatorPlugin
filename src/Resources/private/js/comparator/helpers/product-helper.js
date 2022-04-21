import Api from "../api/api";
import { getDocumentLocale } from '../common/helpers/locale'

export const getValidCodes = async codes => {
    const products = await Api.getProductsByCodes(codes);

    return products.map(({code}) => code);
}

export const createStorageItem = async code => {
    const products = await Api.getProductsByCodes([code], true);
    const [node]                    = products;

    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 4);

    return {
        code,
        createdAt: Date.now(),
        node,
        expireDate,
        locale: getDocumentLocale(),
    }
}
