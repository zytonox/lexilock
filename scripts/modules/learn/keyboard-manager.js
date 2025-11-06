import { getElements } from './elements.js';
import { useState } from './state.js';
import { useRenderer } from './renderer.js';
import { useTranslationManager } from './translation-manager.js';

export const useKeyboardManager = (viewManager, hintManager) => {
	const element = getElements();
	const state = useState();
	const { renderContexts } = useRenderer();
	const { toggleTranslation } = useTranslationManager();
	const { toggleHints } = hintManager;
	const { goToPreviousContext, goToNextContext, toggleView } = viewManager;

	const handleViewKeyDownEvent = event => {
		if (!state.toggle.isViewOn) return;

		if (event.key === 'ArrowLeft') {
			!element.view.input.matches(':focus-within') && goToPreviousContext();
		} else if (event.key === 'ArrowRight') {
			!element.view.input.matches(':focus-within') && goToNextContext();
		}
	};

	const setupKeyboardEventListeners = () => {
		element.view.input.addEventListener('keydown', event => {
			if (event.key === 'Enter') {
				element.view.input.value =
					element.view.input.value <= 0 ? 1 : element.view.input.value;
				element.view.input.value =
					element.view.input.value > state.context.count.total
						? state.context.count.total
						: element.view.input.value;

				state.context.count.processed = element.view.input.value - 1;

				renderContexts();
			}
		});

		document.addEventListener('keydown', event => {
			switch (event.key) {
				case 'h':
					toggleHints();
					break;
				case 't':
					toggleTranslation();
					break;
				case 'v':
					toggleView();
					break;
			}
		});

		document.addEventListener('keydown', function (event) {
			if (event.shiftKey && event.key === 'S') {
				const isDevelopment =
					window.location.protocol === 'http:' ||
					window.location.protocol === 'https:';

				if (isDevelopment) {
					window.location.href = '../../../pages/add.html';
				} else {
					window.location.href = '../pages/add.html';
				}
			}
		});
	};

	return {
		handleViewKeyDownEvent,
		setupKeyboardEventListeners,
	};
};
