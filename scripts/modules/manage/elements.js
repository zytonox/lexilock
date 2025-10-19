const element = {
	title: document.querySelector('title'),
	contextInput: document.querySelector('.data-form__input-context'),
	message: document.querySelector('.data-form__message'),
	vocabulary: {
		container: document.querySelector('.data-form__fieldset'),
		addButton: document.querySelector('.data-form__add-vocabulary'),
		removeButton: document.querySelector('.data-form__remove-vocabulary'),
	},
	context: {
		copyButton: document.querySelector('.data-form__copy-button'),
		clearButton: document.querySelector('.data-form__clear-button'),
	},
	prompt: {
		modal: document.querySelector('.prompt'),
		confirmButton: document.querySelector('.prompt__button:nth-child(2)'),
		cancelButton: document.querySelector('.prompt__button:nth-child(3)'),
		overlay: document.querySelector('.overlay'),
	},
};
element.vocabularyItems = element.vocabulary.container.children;

export const getElements = () => element;
