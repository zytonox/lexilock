const element = {
	title: document.querySelector('title'),
	header: document.querySelector('header'),
	data: {
		button: document.querySelector('.menu__data-toggle'),
		contextMenu: document.querySelector('.menu__data-context-menu'),
		optionButtons: [],
	},
	hint: {
		button: document.querySelector('.menu__hint-toggle'),
	},
	translate: {
		button: document.querySelector('.menu__translate-toggle'),
	},
	filter: {
		button: document.querySelector('.menu__filter-toggle'),
		contextMenu: document.querySelector('.menu__filter-context-menu'),
		wordButton: document.querySelector('.menu__filter-word'),
		collocationButton: document.querySelector('.menu__filter-collocation'),
		idiomButton: document.querySelector('.menu__filter-idiom'),
		phrasalButton: document.querySelector('.menu__filter-phrasal'),
	},
	view: {
		button: document.querySelector('.menu__view-toggle'),
		container: document.querySelector('.menu__view-container'),
		input: document.querySelector('.menu__view-count-input'),
		contextCount: document.querySelector('.menu__view-count'),
		previousButton: document.querySelector('.menu__view-navigation-previous'),
		nextButton: document.querySelector('.menu__view-navigation-next'),
	},
	container: document.querySelector('.container'),
};
element.filter.typeButtons = [
	element.filter.wordButton,
	element.filter.collocationButton,
	element.filter.idiomButton,
	element.filter.phrasalButton,
];
element.contextMenuButtons = [element.data.button, element.filter.button];

export const getElements = () => element;
