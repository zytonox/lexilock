import { getConfig } from './config.js';
import { getElements } from './elements.js';
import { useState } from './state.js';

export const useButtonManager = () => {
	const { UI } = getConfig();
	const element = getElements();
	const state = useState();

	const setButtonText = () => {
		element.data.button.children[1].innerText = !state.isMobile
			? UI.DATA_BUTTON_NAME
			: '';
		element.filter.button.children[1].innerText = !state.isMobile
			? UI.FILTER_BUTTON_NAME
			: '';

		element.filter.wordButton.innerText = `${UI.WORD_BUTTON_NAME} (${state.vocabulary.count.word})`;
		element.filter.collocationButton.innerText = `${UI.COLLOCATION_BUTTON_NAME} (${state.vocabulary.count.collocation})`;
		element.filter.idiomButton.innerText = `${UI.IDIOM_BUTTON_NAME} (${state.vocabulary.count.idiom})`;
		element.filter.phrasalButton.innerText = `${UI.PHRASAL_BUTTON_NAME} (${state.vocabulary.count.phrasal})`;
	};

	const getButtonText = (buttonElement, text) => {
		if (!buttonElement) return null;

		let buttonName;
		let buttonCount;

		const contextMenu = buttonElement.nextElementSibling;
		switch (contextMenu.classList[1]) {
			case 'menu__data-context-menu':
				buttonName = UI.DATA_BUTTON_NAME;
				buttonCount = state.data.count.total;
				break;
			case 'menu__filter-context-menu':
				buttonName = UI.FILTER_BUTTON_NAME;
				buttonCount = state.vocabulary.count.total;
				break;
			default:
				return null;
		}

		switch (text) {
			case 'name':
				return buttonName;
			case 'count':
				return buttonCount;
			default:
				return null;
		}
	};

	const resetButtonStyles = buttonElement => {
		buttonElement.children[1].innerText = !state.isMobile
			? getButtonText(buttonElement, 'name')
			: '';
		buttonElement.style.borderRadius = UI.BORDER_RADIUS;
		buttonElement.classList.remove('menu__button_active');
	};

	const setContextMenuButtonText = buttonElement => {
		const contexMenuElement = buttonElement.nextElementSibling;

		const buttonName = getButtonText(buttonElement, 'name');
		const buttonCount = getButtonText(buttonElement, 'count');

		if (!contexMenuElement.classList.contains('menu__item_inactive')) {
			buttonElement.children[1].innerText = !state.isMobile
				? `${buttonName} (${buttonCount})`
				: ` (${buttonCount})`;
		} else {
			buttonElement.children[1].innerText = !state.isMobile ? buttonName : '';
		}
	};

	return {
		setButtonText,
		getButtonText,
		resetButtonStyles,
		setContextMenuButtonText,
	};
};
