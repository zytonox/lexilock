import { useInputValidator } from './input-validator.js';
import { useVocabularyManager } from './vocabulary-manager.js';
import { useDataProcessor } from './data-processor.js';
import { usePromptManager } from './prompt-manager.js';
import { useUIUpdater } from './ui-updater.js';
import { useKeyboardManager } from './keyboard-manager.js';

export const setupEvents = () => {
	const { setupInputEventListeners } = useInputValidator();
	const { setupVocabularyEventListeners } = useVocabularyManager();
	const setupDataProcessorEventListeners = useDataProcessor();
	const { setupPromptEventListeners } = usePromptManager();
	const { setupUIEventListeners } = useUIUpdater();
	const setupKeyboardEventListeners = useKeyboardManager();

	setupInputEventListeners();
	setupVocabularyEventListeners();
	setupDataProcessorEventListeners();
	setupPromptEventListeners();
	setupUIEventListeners();
	setupKeyboardEventListeners();
};
