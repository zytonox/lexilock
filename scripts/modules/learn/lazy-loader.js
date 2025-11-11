import { getConfig } from './config.js';
import { useState } from './state.js';
import { useUtilities } from '../../utilities/browser-utilities.js';
import { useRenderer } from './renderer.js';

let debouncedScrollHandler = null;

export const useLazyLoader = () => {
	const { CONFIG } = getConfig();
	const state = useState();
	const { isScrollAtBottom, debounce } = useUtilities();
	const { renderContexts } = useRenderer();

	const checkIfNewContextsRequired = () => {
		const isEveryContextProcessed =
			state.context.count.processed === state.context.count.total;

		if (!isEveryContextProcessed && isScrollAtBottom(CONFIG.SCROLL_THRESHOLD)) {
			renderContexts(true);
		}
	};

	const removeLazyLoader = () => {
		if (debouncedScrollHandler) {
			document.removeEventListener('scroll', debouncedScrollHandler);
			debouncedScrollHandler.cancel();
			debouncedScrollHandler = null;
		}
	};

	const setupLazyLoaderEventListeners = () => {
		debouncedScrollHandler = debounce(checkIfNewContextsRequired, 100);
		document.addEventListener('scroll', debouncedScrollHandler);
	};

	return {
		removeLazyLoader,
		setupLazyLoaderEventListeners,
	};
};
