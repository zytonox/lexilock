import { getElements } from './elements.js';
import { useState } from './state.js';
import { useHintManager } from './hint-manager.js';
import { useTranslationManager } from './translation-manager.js';

export const useRenderer = () => {
	const element = getElements();
	const state = useState();
	const { toggleHints } = useHintManager();
	const { translateVocabulary } = useTranslationManager();

	const renderContexts = isAppended => {
		if (!isAppended) element.container.innerHTML = '';

		for (
			let renderedContextCount = 0;
			state.context.count.processed < state.context.active.length;
			state.context.count.processed++
		) {
			const currentVocabulary =
				state.context.active[state.context.count.processed].vcb;

			const newParagraphElement = document.createElement('p');

			let newHTMLString =
				state.context.active[state.context.count.processed].ctx;

			for (const currentVocabularyItem of currentVocabulary) {
				const regularExpression = new RegExp(`(${currentVocabularyItem.orig})`);
				let HTMLStringSplit = newHTMLString.split(regularExpression);
				HTMLStringSplit = HTMLStringSplit.map(
					(currentHTMLSpan, currentHtmlSpanIndex, array) => {
						const vocabularyItemOriginal = currentVocabularyItem.orig.replace(
							/\\/g,
							''
						);
						if (
							currentHTMLSpan === vocabularyItemOriginal &&
							array.indexOf(currentHTMLSpan) === currentHtmlSpanIndex
						) {
							currentHTMLSpan = `<span class="container__context-vocabulary container__context-vocabulary_${
								currentVocabularyItem.typ
							} ${isAppended ? 'appended' : ''}" data-orig="${btoa(
								vocabularyItemOriginal
							)}" data-trscr="${currentVocabularyItem.trscr}" data-trsl="${
								currentVocabularyItem.trsl
							}">${vocabularyItemOriginal}</span>`;
						}
						return currentHTMLSpan;
					}
				);

				newHTMLString = HTMLStringSplit.join('');
				newParagraphElement.innerHTML = newHTMLString;
				newParagraphElement.classList.add('container__context');
				element.container.append(newParagraphElement);
			}

			if (renderedContextCount === state.context.count.max - 1) {
				state.context.count.processed++;
				break;
			}
			renderedContextCount++;
		}

		state.vocabulary.active = Array.from(
			document.querySelectorAll('.container__context-vocabulary')
		);

		let appendedActiveVocabularyElements =
			document.querySelectorAll('.appended');
		if (appendedActiveVocabularyElements) {
			appendedActiveVocabularyElements = Array.from(
				appendedActiveVocabularyElements
			);
			appendedActiveVocabularyElements.forEach(
				currentAppendedActiveVocabularyElement =>
					currentAppendedActiveVocabularyElement.classList.remove('appended')
			);
		}

		if (state.filter.activeType) {
			state.vocabulary.active = uncolorVocabulary(state.vocabulary.active);

			if (isAppended)
				appendedActiveVocabularyElements = uncolorVocabulary(
					appendedActiveVocabularyElements
				);
		}

		if (state.toggle.isHintOn) {
			state.toggle.isHintOn = false;
			toggleHints();
		}

		if (state.toggle.isTranslated) {
			if (!isAppended) {
				translateVocabulary(state.vocabulary.active);
			} else {
				translateVocabulary(appendedActiveVocabularyElements, true);
			}
		}
	};

	const uncolorVocabulary = vocabularyElements => {
		return vocabularyElements.filter(currentVocabularyElement => {
			currentVocabularyElement.classList.remove(
				'container__context-vocabulary_uncolor'
			);

			const vocabularyElementClasses = currentVocabularyElement.classList[1];
			if (vocabularyElementClasses.includes(state.filter.activeType)) {
				return currentVocabularyElement;
			} else {
				currentVocabularyElement.classList.add(
					'container__context-vocabulary_uncolor'
				);
			}
		});
	};

	return {
		renderContexts,
		uncolorVocabulary,
	};
};
