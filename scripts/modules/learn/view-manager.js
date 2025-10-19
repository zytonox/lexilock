import { getConfig } from './config.js';
import { getElements } from './elements.js';
import { useState } from './state.js';
import { useRenderer } from './renderer.js';
import { useHintManager } from './hint-manager.js';
import { useLazyLoader } from './lazy-loader.js';
import { useKeyboardManager } from './keyboard-manager.js';

export const useViewManager = () => {
	const { CONFIG } = getConfig();
	const element = getElements();
	const state = useState();
	const { renderContexts } = useRenderer();
	const { removeHint, toggleHints } = useHintManager();
	const { debounceCall } = useLazyLoader();

	const toggleView = () => {
		removeHint();

		state.context.count.max = !state.toggle.isViewOn
			? 1
			: CONFIG.MAX_CONTEXT_COUNT;
		state.context.count.processed = 0;

		element.view.container.classList.toggle('menu__item_inactive');

		if (!state.toggle.isViewOn) {
			element.view.button.classList.add('menu__button_active');

			document.removeEventListener('scroll', debounceCall);
			document.addEventListener('keydown', handleViewKeyDownEvent);

			renderContexts();

			state.toggle.isViewOn = true;
		} else {
			element.view.button.classList.remove('menu__button_active');

			document.addEventListener('scroll', debounceCall);
			document.removeEventListener('keydown', handleViewKeyDownEvent);

			renderContexts();

			state.toggle.isViewOn = false;
		}

		setViewCounts();
	};

	const goToNextContext = () => {
		if (state.context.count.processed >= state.context.count.total) {
			state.context.count.processed = 0;
		}

		element.view.input.value = state.context.count.processed + 1;

		renderContexts();
	};

	const goToPreviousContext = () => {
		if (state.context.count.processed <= 1) {
			state.context.count.processed = state.context.count.total - 1;
		} else {
			state.context.count.processed -= 2;
		}

		element.view.input.value = state.context.count.processed + 1;

		renderContexts();
	};

	const setViewCounts = () => {
		element.view.input.value = state.context.count.processed;
		element.view.contextCount.innerText = '/ ' + state.context.count.total;

		state.view.inputMaxLength = String(state.context.count.total).length;
	};

	const setupViewEventListeners = () => {
		element.view.button.addEventListener('click', toggleView);

		element.view.input.addEventListener('input', () => {
			if (element.view.input.value.length > state.view.inputMaxLength) {
				element.view.input.value = element.view.input.value.slice(
					0,
					state.view.inputMaxLength
				);
			}
		});

		element.view.nextButton.addEventListener('click', goToNextContext);
		element.view.previousButton.addEventListener('click', goToPreviousContext);
	};

	const { handleViewKeyDownEvent } = useKeyboardManager(
		{
			toggleView,
			goToNextContext,
			goToPreviousContext,
		},
		{
			toggleHints,
		}
	);

	return {
		toggleView,
		goToNextContext,
		goToPreviousContext,
		setViewCounts,
		setupViewEventListeners,
	};
};
