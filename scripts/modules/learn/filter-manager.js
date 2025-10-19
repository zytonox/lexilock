import { getElements } from './elements.js';
import { useState } from './state.js';
import { useRenderer } from './renderer.js';
import { useButtonManager } from './button-manager.js';
import { useHintManager } from './hint-manager.js';
import { useViewManager } from './view-manager.js';
import { runVocabularyAction } from './vocabulary-actions.js';

export const useFilterManager = () => {
	const element = getElements();
	const state = useState();
	const { renderContexts } = useRenderer();
	const { resetButtonStyles } = useButtonManager();
	const { removeHint } = useHintManager();
	const { setViewCounts } = useViewManager();

	const activateFilterTypeButton = () => {
		element.filter.typeButtons.forEach(currentFlterTypeButtonElement => {
			currentFlterTypeButtonElement.classList.remove('menu__button_active');
		});

		if (state.filter.activeType) {
			const activeFilterTypeButtonElement = document.querySelector(
				`.menu__filter-${state.filter.activeType}`
			);
			activeFilterTypeButtonElement.classList.add('menu__button_active');
		}
	};

	const setupFilterEventListeners = () => {
		element.filter.typeButtons.forEach(currentFilterTypeButtonElement => {
			currentFilterTypeButtonElement.addEventListener('click', () => {
				removeHint();

				const buttonTypeSplit =
					currentFilterTypeButtonElement.classList[2].split('-');
				const buttonType = buttonTypeSplit[buttonTypeSplit.length - 1];

				state.context.count.processed = 0;

				if (state.filter.activeType !== buttonType) {
					state.filter.activeType = buttonType;

					runVocabularyAction(state.filter.activeType, 'setActiveContext');

					renderContexts();

					runVocabularyAction(state.filter.activeType, 'setFilterButtonText');
					activateFilterTypeButton();
				} else {
					resetButtonStyles(element.filter.button);

					state.filter.activeType = null;

					state.context.active = state.data.active;
					state.context.count.total = state.data.active.length;
					renderContexts();

					activateFilterTypeButton();
				}

				setViewCounts();

				window.scrollTo(0, 0);
			});
		});
	};

	return setupFilterEventListeners;
};
