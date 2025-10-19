import { getElements } from './elements.js';
import { useInputValidator } from './input-validator.js';
import { useUIUpdater } from './ui-updater.js';

export const useVocabularyManager = () => {
	const element = getElements();
	const { validateInputs, setupInputEventListeners } = useInputValidator();
	const { toggleRemoveButtonActivity } = useUIUpdater();

	const clearVocabularyInputs = vocabularyItemElement => {
		vocabularyItemElement.children[0].children[0].value = '';
		vocabularyItemElement.children[1].children[0].value = '';
		vocabularyItemElement.children[2].children[0].value = '';
		vocabularyItemElement.children[3].children[0].value = 'word';
	};

	const removeVocabularyItem = event => {
		if (element.vocabulary.container.childElementCount > 1) {
			event.target.parentElement.remove();

			setupInputEventListeners();
			validateInputs();
		}

		if (element.vocabulary.container.childElementCount === 1) {
			toggleRemoveButtonActivity(element.vocabularyItems[0], true);

			setupInputEventListeners();
			validateInputs();
		}
	};

	const setupVocabularyEventListeners = () => {
		element.vocabulary.addButton.addEventListener('click', event => {
			event.preventDefault();

			toggleRemoveButtonActivity(element.vocabularyItems[0], false);

			const vocabularyTemplateElement =
				element.vocabularyItems[0].cloneNode(true);
			clearVocabularyInputs(vocabularyTemplateElement);
			element.vocabulary.container.append(vocabularyTemplateElement);

			const newVocabularyItem =
				element.vocabularyItems[element.vocabularyItems.length - 1];
			const newRemoveButton = newVocabularyItem.children[4];
			newRemoveButton.addEventListener('click', removeVocabularyItem);

			setupInputEventListeners();
			validateInputs();
		});

		element.vocabulary.removeButton.addEventListener(
			'click',
			removeVocabularyItem
		);
	};

	return {
		clearVocabularyInputs,
		setupVocabularyEventListeners,
	};
};
