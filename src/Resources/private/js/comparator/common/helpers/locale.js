export const getDocumentLocale = () => {

    const { locale } = document.body.dataset

    if (!locale) {
        return window.location.pathname.split("/").filter(Boolean).shift();
    }

    return locale;
}

// const htmlEle  = document.querySelector('html')
// const lang     = htmlEle.getAttribute('lang');
//
// if (!lang) {
//     console.warn('<html> element should implement "data-section" and "data-locale" to use the LocaleRouter')
// }
//
// return lang;
