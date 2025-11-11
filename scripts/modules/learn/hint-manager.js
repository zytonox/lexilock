import { getElements } from './elements.js';
import { useState } from './state.js';

export const useHintManager = () => {
	const element = getElements();
	const state = useState();

	const toggleHints = () => {
		if (!state.toggle.isHintOn) {
			document.addEventListener('click', removeHintOnDocumentClick);
			state.vocabulary.active.forEach(currentActiveVocabularyElement => {
				currentActiveVocabularyElement.addEventListener('click', addHint);
			});

			element.hint.button.classList.add('menu__button_active');

			state.toggle.isHintOn = true;
		} else {
			removeHint();

			document.removeEventListener('click', removeHintOnDocumentClick);
			state.vocabulary.active.forEach(currentActiveVocabularyElement => {
				currentActiveVocabularyElement.removeEventListener('click', addHint);
			});

			element.hint.button.classList.remove('menu__button_active');

			state.toggle.isHintOn = false;
		}
	};

	const addHint = event => {
		event.stopPropagation();

		removeHint();

		const vocabularyElement = event.target;

		if (
			state.filter.activeType &&
			vocabularyElement.classList.contains(
				'container__context-vocabulary_uncolor'
			)
		)
			return;

		const newHintElement = document.createElement('div');
		const newHintTranscriptionElement = document.createElement('p');
		const newHintTranslationElement = document.createElement('p');

		let vocabularyElementOriginal = atob(vocabularyElement.dataset.orig);

		if (state.toggle.isTranslated && vocabularyElement.childElementCount) {
			const vocabularyElementFirstChildOriginal = atob(
				vocabularyElement.children[0].dataset.orig
			);
			const vocabularyElementOriginalSplit = vocabularyElementOriginal.split(
				vocabularyElementFirstChildOriginal
			);

			const vocabularyElementOriginalArray = state.vocabulary.original.find(
				currentOriginalVocabularyItem => {
					return currentOriginalVocabularyItem.includes(
						vocabularyElementOriginalSplit[0]
					);
				}
			);
			vocabularyElementOriginal = vocabularyElementOriginalArray
				.toString()
				.replace(', ', '');
		}

		newHintTranscriptionElement.classList.add('container__context-hint-text');
		newHintTranscriptionElement.innerText = vocabularyElement.dataset.trscr;
		newHintTranscriptionElement.style.fontSize = '18px';
		newHintTranscriptionElement.style.color = '#d09966';

		newHintTranslationElement.classList.add('container__context-hint-text');
		newHintTranslationElement.innerText = !state.toggle.isTranslated
			? vocabularyElement.dataset.trsl
			: vocabularyElementOriginal;
		newHintTranslationElement.style.color = '#999999';

		newHintElement.classList.add('container__context-hint');

		const containerElementPosition = element.container.getBoundingClientRect();
		const newHintElementPositionLeft =
			event.clientX - containerElementPosition.left;
		newHintElement.style.top = `${
			event.clientY - containerElementPosition.top
		}px`;
		newHintElement.style.left = `${newHintElementPositionLeft}px`;

		newHintElement.addEventListener('click', event => {
			event.stopPropagation();
		});

		newHintElement.append(newHintTranscriptionElement);
		newHintElement.append(newHintTranslationElement);

		if (
			!vocabularyElement.classList.contains(
				'container__context-vocabulary_word'
			)
		) {
			const hintTypeElement = document.createElement('p');
			hintTypeElement.classList.add('container__context-hint-text');

			const hintTypeSplit = vocabularyElement.classList[1].split('_');
			let hintType = hintTypeSplit[hintTypeSplit.length - 1];
			if (hintType === 'phrasal') {
				hintTypeElement.innerText = 'Phrasal Verb';
			} else {
				hintTypeElement.innerText =
					hintType.charAt(0).toUpperCase() + hintType.slice(1);
			}

			hintTypeElement.style.fontSize = '16px';
			hintTypeElement.style.color = '#6d6d6d';
			newHintElement.append(hintTypeElement);
		}

		let initialScroll = document.documentElement.scrollTop;

		element.container.append(newHintElement);

		const newHintElementPosition = newHintElement.getBoundingClientRect();
		const newHintElementMaxLeft =
			containerElementPosition.width - newHintElementPosition.width;
		if (newHintElementPositionLeft > newHintElementMaxLeft)
			newHintElement.style.left = `${newHintElementMaxLeft}px`;

		const viewportHeight = Math.max(
			document.documentElement.clientHeight || 0,
			window.innerHeight || 0
		);
		const newHintElementPositionBottom = newHintElementPosition.bottom;
		const currentHeaderHeight = element.header.offsetHeight;
		if (!state.isMobile && viewportHeight < newHintElementPositionBottom) {
			newHintElement.style.top = `${
				newHintElement.offsetTop -
				(newHintElementPositionBottom - viewportHeight)
			}px`;
		} else if (
			state.isMobile &&
			viewportHeight - currentHeaderHeight < newHintElementPositionBottom
		) {
			newHintElement.style.top = `${
				newHintElement.offsetTop -
				(newHintElementPositionBottom - viewportHeight) -
				currentHeaderHeight
			}px`;
		}

		if (initialScroll !== document.documentElement.scrollTop)
			document.documentElement.scrollTop = initialScroll;
	};

	const removeHint = () => {
		if (state.toggle.isHintOn) {
			const activeHintElement = document.querySelector(
				'.container__context-hint'
			);
			activeHintElement && activeHintElement.remove();
		}
	};

	const removeHintOnDocumentClick = event => {
		event.target.nodeName !== 'SPAN' && removeHint();
	};

	const setupHintEventListeners = () => {
		element.hint.button.addEventListener('click', toggleHints);
	};

	return {
		toggleHints,
		addHint,
		removeHint,
		setupHintEventListeners,
	};
};
