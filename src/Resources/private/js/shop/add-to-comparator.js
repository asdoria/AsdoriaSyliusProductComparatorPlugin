import {getProductItems, removeInvalidItems, setProductItems} from "../comparator/helpers/local-storage-helper";
import {createStorageItem} from "../comparator/helpers/product-helper";
import { STORAGE_KEY } from '../comparator/common/constants/local-storage'

export default () => {
    document.querySelectorAll('a.js-add-to-comparator[data-product-code]')
        .forEach(i => init(i));
}

/**
 *
 * @param el
 */
const init = el => {
    const { productCode, transCompare, transLoading, transRemove } = el.dataset;

    let comparatorIds = getProductItems();

    if (comparatorIds.find(item => item.code === productCode)) {
        el.innerText = transRemove
    }

    el.addEventListener('click', async e => {
        e.preventDefault();

        comparatorIds = getProductItems();

        if (comparatorIds.find(item => item.code === productCode)) {
            el.innerText = transCompare
            setProductItems(comparatorIds.filter(item => item.code !== productCode))
            return
        }

        el.innerText = transLoading

        await addItem(comparatorIds, productCode)

        comparatorIds.sort((a, b) => a.createdAt - b.createdAt);

        setProductItems(comparatorIds);
        await removeInvalidItems();

        el.innerText = transRemove
    });
};

/**
 *
 * @param carry
 * @param code
 */
const addItem = async (carry, code) => {
    if (carry.find(item => item.code === code)) return;

    if (carry.length > 4) {
        carry.shift();
    }

    carry.push(await createStorageItem(code));
};
