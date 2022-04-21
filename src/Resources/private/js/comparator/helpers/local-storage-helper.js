import {getValidCodes} from "./product-helper";

const STORAGE_KEY = 'sylius_comparator';

export const getProductItems = () => JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');

export const setProductItems = items => window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

export const removeInvalidItems = async () => {
    const items      = getProductItems();
    const validCodes = await getValidCodes(items.map(({code}) => code));

    setProductItems(items.filter(({code}) => validCodes.includes(code)))
}
