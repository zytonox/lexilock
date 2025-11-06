import { getElements } from './elements.js';
import { useUIUpdater } from './ui-updater.js';

export const usePromptManager = () => {
	const element = getElements();
	const { updateUI } = useUIUpdater();

	const hidePrompt = () => {
		element.prompt.modal.classList.add('prompt_inactive');
		element.prompt.overlay.classList.add('overlay_inactive');
	};

	const clearAddedContexts = () => {
		localStorage.removeItem('Contexts');
		localStorage.removeItem('newData');

		updateUI();
		hidePrompt();
	};

	const setupPromptEventListeners = () => {
		element.prompt.confirmButton.addEventListener('click', clearAddedContexts);
		element.prompt.cancelButton.addEventListener('click', hidePrompt);
	};

	return {
		hidePrompt,
		clearAddedContexts,
		setupPromptEventListeners,
	};
};
