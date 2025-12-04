import { getElements } from './elements.js';
import { useState } from './state.js';
import { useHintManager } from './hint-manager.js';

export const useTranslationManager = () => {
	const element = getElements();
	const state = useState();
	const { removeHint } = useHintManager();

	const translateVocabulary = (vocabularyElements, isAppended) => {
		if (!vocabularyElements.length) return;

		const firstVocabularyItem = vocabularyElements[0];
		const firstVocabularyItemCurrentText = firstVocabularyItem.innerText;
		const firstVocabularyItemOriginal = atob(firstVocabularyItem.dataset.orig);
		let isTranslationRequired =
			firstVocabularyItemCurrentText === firstVocabularyItemOriginal;

		if (isTranslationRequired) {
			state.toggle.isTranslated = true;
			element.translate.button.classList.add('menu__button_active');

			if (!isAppended) state.vocabulary.original.length = 0;
		} else {
			state.toggle.isTranslated = false;
			element.translate.button.classList.remove('menu__button_active');
		}

		vocabularyElements.forEach(
			(currentVocabularyElement, currentVocabularyElementIndex) => {
				const vocabularyItemChildren = currentVocabularyElement.childNodes;

				isTranslationRequired &&
					state.vocabulary.original.push([vocabularyItemChildren[0].nodeValue]);

				if (!currentVocabularyElement.childElementCount) {
					currentVocabularyElement.innerText = isTranslationRequired
						? currentVocabularyElement.dataset.trsl
						: state.vocabulary.original[currentVocabularyElementIndex][0];
				} else {
					if (isTranslationRequired) {
						state.vocabulary.original[
							state.vocabulary.original.length - 1
						].push(
							vocabularyItemChildren[vocabularyItemChildren.length - 1]
								.nodeValue
						);

						vocabularyItemChildren[0].nodeValue =
							currentVocabularyElement.dataset.trsl + ' ';
						vocabularyItemChildren[
							vocabularyItemChildren.length - 1
						].nodeValue = '';
					} else {
						vocabularyItemChildren[0].nodeValue =
							state.vocabulary.original[currentVocabularyElementIndex][0];
						vocabularyItemChildren[
							vocabularyItemChildren.length - 1
						].nodeValue =
							state.vocabulary.original[currentVocabularyElementIndex][1];
					}
				}
			}
		);

		if (!isTranslationRequired) state.vocabulary.original.length = 0;
	};

	const toggleTranslation = () => {
		removeHint();

		translateVocabulary(state.vocabulary.active);
	};

	const setupTranslationEventListeners = () => {
		element.translate.button.addEventListener('click', toggleTranslation);
	};

	return {
		translateVocabulary,
		toggleTranslation,
		setupTranslationEventListeners,
	};
};
