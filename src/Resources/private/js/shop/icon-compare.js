import {getProductItems} from "../comparator/helpers/local-storage-helper";

let baseContent = null;

const init        = () =>  {
    const icon    = getIcon();
    if (!icon) return;
    baseContent = icon.nextElementSibling.textContent;
}

const getIcon       = () => document.querySelector('.Icon-compare');
const targetElement = () => getIcon().nextElementSibling

export default () => {
    init();
    updatedNbr()
};

export const updatedNbr  = () =>  {
    if(!baseContent) return;
    const txt         = targetElement();
    const products    = getProductItems();
    txt.textContent   = baseContent + '('+products.length+')'
}
