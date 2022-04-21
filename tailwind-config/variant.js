/**
 * @see https://tailwindcss.com/docs/plugins/#adding-variants
 * @param addVariant
 * @param e
 */
module.exports = ({ addVariant, e }) => {
    addVariant('children', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
            return `.${e(`children${separator}${className}`)} > *`
        })
    })
    addVariant('not-first', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
            return `.${e(`not-first${separator}${className}`)}:not(:first-child)`
        })
    })
    addVariant('not-last', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
            return `.${e(`not-last${separator}${className}`)}:not(:last-child)`
        })
    })
    addVariant('odd', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
            return `.${e(`odd${separator}${className}`)}:nth-child(odd)`
        })
    })
    addVariant('even', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
            return `.${e(`even${separator}${className}`)}:nth-child(even)`
        })
    })
}
