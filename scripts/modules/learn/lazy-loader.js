import { getConfig } from './config.js';
import { useState } from './state.js';
import { useUtilities } from './utilities.js';
import { useRenderer } from './renderer.js';

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

	const debounceCall = debounce(checkIfNewContextsRequired, 100);

	const setupLazyLoaderEventListeners = () => {
		document.addEventListener('scroll', debounceCall);
	};

	return {
		debounceCall,
		setupLazyLoaderEventListeners,
	};
};
