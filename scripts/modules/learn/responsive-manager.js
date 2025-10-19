import { getConfig } from './config.js';
import { getElements } from './elements.js';
import { useState } from './state.js';
import { useButtonManager } from './button-manager.js';
import { useHintManager } from './hint-manager.js';
import { runVocabularyAction } from './vocabulary-actions.js';

export const useResponsiveManager = () => {
	const { UI, MEDIA_QUERY } = getConfig();
	const element = getElements();
	const state = useState();
	const { setContextMenuButtonText } = useButtonManager();
	const { removeHint } = useHintManager();

	const adaptBordersOnChange = buttonElement => {
		if (
			!buttonElement.nextElementSibling.classList.contains(
				'menu__item_inactive'
			)
		) {
			buttonElement.style.borderTopRightRadius = !state.isMobile
				? UI.BORDER_RADIUS
				: '0';
			buttonElement.style.borderTopLeftRadius = !state.isMobile
				? UI.BORDER_RADIUS
				: '0';
			buttonElement.style.borderBottomRightRadius = !state.isMobile
				? '0'
				: UI.BORDER_RADIUS;
			buttonElement.style.borderBottomLeftRadius = !state.isMobile
				? '0'
				: UI.BORDER_RADIUS;
		}
	};

	const setupResponsiveEventListeners = () => {
		MEDIA_QUERY.addEventListener('change', event => {
			state.isMobile = event.matches;

			removeHint();

			setContextMenuButtonText(element.data.button);

			if (!state.filter.activeType) {
				setContextMenuButtonText(element.filter.button);
			} else {
				runVocabularyAction(state.filter.activeType, 'setFilterButtonText');
			}

			adaptBordersOnChange(element.filter.button);
			adaptBordersOnChange(element.data.button);
		});
	};

	return setupResponsiveEventListeners;
};
