import { getElements } from './elements.js';
import { useInputValidator } from './input-validator.js';
import { useVocabularyManager } from './vocabulary-manager.js';
import { useUIUpdater } from './ui-updater.js';

export const useDataProcessor = () => {
	const element = getElements();
	const { validateInputs } = useInputValidator();
	const { clearVocabularyInputs } = useVocabularyManager();
	const { updateUI, toggleRemoveButtonActivity, displayMessage } =
		useUIUpdater();

	const capitalizeFirstLetter = string => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	const checkIfFirstLetterUppercase = string => {
		const uppercaseString = capitalizeFirstLetter(string);

		return string === uppercaseString;
	};

	const copyToClipboard = string => {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(string).then(displayMessage);
		} else {
			const textAreaElement = document.createElement('textarea');
			textAreaElement.value = string;
			document.body.appendChild(textAreaElement);
			textAreaElement.select();
			document.execCommand('copy');
			document.body.removeChild(textAreaElement);

			displayMessage();
		}
	};

	const setupDataProcessorEventListeners = () => {
		element.context.copyButton.addEventListener('click', event => {
			event.preventDefault();

			let newContext = element.contextInput.value.trim();

			if (newContext.includes('\n')) {
				const newContextSplit = newContext.split(/\n/);
				newContext = '';

				for (let currentNewContextSplitItem of newContextSplit) {
					currentNewContextSplitItem = `<p class="container__context-paragraph">${currentNewContextSplitItem}</p>`;

					newContext += currentNewContextSplitItem;
				}
			}

			let newData = localStorage.getItem('newData');
			newData = newData ? JSON.parse(newData) : [];

			newData.push({
				ctx: `${newContext}`,
				vcb: [],
			});

			const vocabularyItemCount =
				element.vocabulary.container.childElementCount;
			for (
				let vocabularyItem = 0;
				vocabularyItem < vocabularyItemCount;
				vocabularyItem++
			) {
				const currentNewOriginal = element.vocabularyItems[
					vocabularyItem
				].children[0].children[0].value
					.trim()
					.replace('(', '\\(')
					.replace(')', '\\)');
				const currentNewTranscription =
					element.vocabularyItems[
						vocabularyItem
					].children[1].children[0].value.trim();

				let currentNewTranslation =
					element.vocabularyItems[
						vocabularyItem
					].children[2].children[0].value.trim();
				currentNewTranslation = checkIfFirstLetterUppercase(currentNewOriginal)
					? capitalizeFirstLetter(currentNewTranslation)
					: currentNewTranslation;

				const currentNewType =
					element.vocabularyItems[vocabularyItem].children[3].children[0].value;

				const lastContextObject = newData[newData.length - 1];
				lastContextObject.vcb.push({
					orig: currentNewOriginal,
					typ: currentNewType,
					trscr: `[${currentNewTranscription.replace(/[\[\]]+/g, '')}]`,
					trsl: currentNewTranslation,
				});
			}

			localStorage.setItem('Contexts', newData.length.toString());
			let newDataJSON = JSON.stringify(newData);
			localStorage.setItem('newData', newDataJSON);
			newDataJSON = newDataJSON.substring(1, newDataJSON.length - 1);
			copyToClipboard(newDataJSON);

			element.contextInput.value = '';
			const vocabularyItemElementArray = Array.from(element.vocabularyItems);
			vocabularyItemElementArray.forEach(
				(currentVocabularyItemElement, currentVocabularyItemIndex) => {
					if (currentVocabularyItemIndex === 0) {
						clearVocabularyInputs(currentVocabularyItemElement);
					} else {
						currentVocabularyItemElement.remove();
					}
				}
			);

			validateInputs();
			updateUI();

			toggleRemoveButtonActivity(element.vocabularyItems[0], true);
		});
	};

	return setupDataProcessorEventListeners;
};
