/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./templates/**/*.html',                  // All HTML templates in the project
		'./nostramo/templates/nostramo/**/*.html',         // HTML templates specific to the nostramo app
		'./nostramo/static/nostramo/js/**/*.js',  // Any JavaScript files in the nostramo app
		'./nostramo/static/nostramo/css/**/*.css' // Any custom CSS files using Tailwind directives
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['JetBrains Mono', 'ui-sans-serif', 'system-ui'], // Default sans font
				mono: ['JetBrains Mono', 'monospace'], // Explicit mono font
			},
		},
	},
	plugins: [],
}

