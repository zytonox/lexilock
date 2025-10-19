import { getConfig } from './config.js';
import { getElements } from './elements.js';
import { useState } from './state.js';
import { useButtonManager } from './button-manager.js';
import { useHintManager } from './hint-manager.js';
import { runVocabularyAction } from './vocabulary-actions.js';

export const useContextMenuManager = () => {
	const { UI } = getConfig();
	const element = getElements();
	const state = useState();
	const { resetButtonStyles, getButtonText } = useButtonManager();
	const { removeHint } = useHintManager();

	const toggleContextMenu = event => {
		removeHint();

		const buttonElement = event.target;
		const contextMenuElement = buttonElement.nextElementSibling;

		const buttonName = getButtonText(buttonElement, 'name');
		const buttonCount = getButtonText(buttonElement, 'count');

		if (contextMenuElement.classList.contains('menu__item_inactive')) {
			hideAllContexMenus();

			contextMenuElement.classList.remove('menu__item_inactive');

			buttonElement.classList.add('menu__button_active');
			if (!state.isMobile) {
				buttonElement.style.borderBottomRightRadius = '0';
				buttonElement.style.borderBottomLeftRadius = '0';
			} else {
				buttonElement.style.borderTopRightRadius = '0';
				buttonElement.style.borderTopLeftRadius = '0';
			}
			buttonElement.children[1].innerText = !state.isMobile
				? `${buttonName} (${buttonCount})`
				: ` (${buttonCount})`;
		} else {
			hideContextMenu(buttonElement);
		}

		event.stopPropagation();
	};

	const hideContextMenu = buttonElement => {
		const contextMenuElement = buttonElement.nextElementSibling;

		if (contextMenuElement.classList.contains('menu__item_inactive')) return;

		contextMenuElement.classList.add('menu__item_inactive');

		if (
			contextMenuElement.classList[1] === 'menu__filter-context-menu' &&
			state.filter.activeType
		) {
			runVocabularyAction(state.filter.activeType, 'setFilterButtonText');
			buttonElement.style.borderRadius = UI.BORDER_RADIUS;
			return;
		}

		resetButtonStyles(buttonElement);
	};

	const hideAllContexMenus = () => {
		element.contextMenuButtons.forEach(currentContextMenuButtonElement =>
			hideContextMenu(currentContextMenuButtonElement)
		);
	};

	const setupContextMenuEventListeners = () => {
		element.contextMenuButtons.forEach(currentContextMenuButtonElement =>
			currentContextMenuButtonElement.addEventListener(
				'click',
				toggleContextMenu
			)
		);

		document.addEventListener('click', hideAllContexMenus);
	};

	return {
		toggleContextMenu,
		setupContextMenuEventListeners,
	};
};
