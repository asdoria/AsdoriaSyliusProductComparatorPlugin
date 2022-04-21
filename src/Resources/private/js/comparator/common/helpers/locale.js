export const getDocumentLocale = () => {
    const { locale } = document.body.dataset

    if (!locale) {
        console.warn('<body> element should implement "data-section" and "data-locale" to use the LocaleRouter')
    }

    return locale;
}
