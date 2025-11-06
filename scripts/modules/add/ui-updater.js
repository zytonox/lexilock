import { getElements } from './elements.js';

export const useUIUpdater = () => {
	const element = getElements();

	const updateUI = () => {
		const isNewData = localStorage.getItem('newData');
		element.context.clearButton.disabled = !isNewData;

		const newDataLength = localStorage.getItem('Contexts');
		element.title.innerText = !newDataLength
			? 'LexiLock: Add'
			: 'LexiLock: Add ' + `(${newDataLength})`;
		element.context.clearButton.innerText =
			newDataLength < 2 ? 'Clear Context' : 'Clear Contexts';
	};

	const toggleRemoveButtonActivity = (firstVocabularyItemElement, state) => {
		const firstVocabularyItemRemoveButton =
			firstVocabularyItemElement.children[4];
		firstVocabularyItemRemoveButton.disabled = state;
	};

	const displayMessage = () => {
		element.message.innerText = 'New data has been copied to clipboard';

		setTimeout(() => {
			element.message.innerText = '';
		}, 5000);
	};

	const setupUIEventListeners = () => {
		element.context.clearButton.addEventListener('click', event => {
			event.preventDefault();

			element.prompt.modal.classList.remove('prompt_inactive');
			element.prompt.overlay.classList.remove('overlay_inactive');
		});
	};

	return {
		updateUI,
		toggleRemoveButtonActivity,
		displayMessage,
		setupUIEventListeners,
	};
};
