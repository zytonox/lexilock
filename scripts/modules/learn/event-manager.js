import { useHintManager } from './hint-manager.js';
import { useTranslationManager } from './translation-manager.js';
import { useFilterManager } from './filter-manager.js';
import { useViewManager } from './view-manager.js';
import { useContextMenuManager } from './context-menu-manager.js';
import { useLazyLoader } from './lazy-loader.js';
import { useResponsiveManager } from './responsive-manager.js';
import { useKeyboardManager } from './keyboard-manager.js';

export const setupEvents = () => {
	const { toggleHints, setupHintEventListeners } = useHintManager();
	const { setupTranslationEventListeners } = useTranslationManager();
	const setupFilterEventListeners = useFilterManager();
	const {
		toggleView,
		goToPreviousContext,
		goToNextContext,
		setupViewEventListeners,
	} = useViewManager();
	const { setupContextMenuEventListeners } = useContextMenuManager();
	const { setupLazyLoaderEventListeners } = useLazyLoader();
	const setupResponsiveEventListeners = useResponsiveManager();
	const { setupKeyboardEventListeners } = useKeyboardManager(
		{
			toggleView,
			goToNextContext,
			goToPreviousContext,
		},
		{
			toggleHints,
		}
	);

	setupHintEventListeners();
	setupTranslationEventListeners();
	setupFilterEventListeners();
	setupViewEventListeners();
	setupContextMenuEventListeners();
	setupLazyLoaderEventListeners();
	setupResponsiveEventListeners();
	setupKeyboardEventListeners();
};
