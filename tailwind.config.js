const theme       = require('./tailwind-config/theme')
const corePlugins = require('./tailwind-config/core-plugins')

module.exports = {
    theme,
    plugins: [],
    corePlugins,
    content: [
        './src/Resources/views/**/*.html.twig',
        './src/Resources/private/js/**/*.{js,vue}',
    ]
}
