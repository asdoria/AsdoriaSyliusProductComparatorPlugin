import {updatedNbr} from './icon-compare'
import {getProductItems, removeInvalidItems, setProductItems} from "../comparator/helpers/local-storage-helper";
import {createStorageItem} from "../comparator/helpers/product-helper";

export default () => {
    document.querySelectorAll('a.js-add-to-comparator[data-product-code]')
        .forEach(i => init(i));
}

/**
 *
 * @param el
 */
const init = el => {
    const { productCode } = el.dataset;

    let comparatorIds = getProductItems();

    if (comparatorIds.find(item => item.code === productCode)) {
        el.innerText = Translator.trans('asdoria_sylius_comparator_bundle.ui.added')
    }

    el.addEventListener('click', async e => {
        e.preventDefault();
        el.innerText = Translator.trans('asdoria_sylius_comparator_bundle.ui.loading')

        comparatorIds = getProductItems();

        await addItem(comparatorIds, productCode)

        comparatorIds.sort((a, b) => a.createdAt - b.createdAt);

        setProductItems(comparatorIds);
        await removeInvalidItems();

        updatedNbr()
        el.innerText = Translator.trans('asdoria_sylius_comparator_bundle.ui.added')
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
