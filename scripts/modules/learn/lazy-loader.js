import { getConfig } from './config.js';
import { useState } from './state.js';
import { useUtilities } from './utilities.js';
import { useRenderer } from './renderer.js';

let debounceCall = null;

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
		if (debounceCall) {
			document.removeEventListener('scroll', debounceCall);
			debounceCall = null;
		}
	};

	const setupLazyLoaderEventListeners = () => {
		debounceCall = debounce(checkIfNewContextsRequired, 100);
		document.addEventListener('scroll', debounceCall);
	};

	return {
		removeLazyLoader,
		setupLazyLoaderEventListeners,
	};
};
