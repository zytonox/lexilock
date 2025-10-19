import { getElements } from './elements.js';
import { useState } from './state.js';
import { useRenderer } from './renderer.js';
import { useButtonManager } from './button-manager.js';
import { useViewManager } from './view-manager.js';
import { runVocabularyAction } from './vocabulary-actions.js';

export const useDataProcessor = () => {
	const element = getElements();
	const state = useState();
	const { renderContexts } = useRenderer();
	const { setButtonText } = useButtonManager();
	const { setViewCounts } = useViewManager();

	const processData = () => {
		for (const currentDataTitle of state.data.titles) {
			const currentDataTotalCount = state.data.allData[currentDataTitle].length;

			const newDataOptionButtonElement = document.createElement('p');
			newDataOptionButtonElement.innerText = `${currentDataTitle} (${currentDataTotalCount})`;
			newDataOptionButtonElement.classList.add('menu__button');
			newDataOptionButtonElement.classList.add('menu__data');
			element.data.contextMenu.append(newDataOptionButtonElement);
			element.data.optionButtons.push(newDataOptionButtonElement);

			newDataOptionButtonElement.addEventListener('click', () => {
				if (currentDataTitle === state.data.activeTitle) return;

				element.data.optionButtons.forEach(currentDataOptionButtonElement => {
					currentDataOptionButtonElement.remove();
					element.data.optionButtons = [];
				});

				localStorage.setItem('activeData', currentDataTitle);
				state.data.activeTitle = localStorage.getItem('activeData');
				state.data.words = [];
				state.data.collocations = [];
				state.data.idioms = [];
				state.data.phrasals = [];
				state.context.count.processed = 0;
				state.vocabulary.count.word = 0;
				state.vocabulary.count.collocation = 0;
				state.vocabulary.count.idiom = 0;
				state.vocabulary.count.phrasal = 0;
				state.vocabulary.count.total = 0;

				processData();

				renderContexts();

				setButtonText();

				state.filter.activeType &&
					runVocabularyAction(state.filter.activeType, 'setFilterButtonText');

				setViewCounts();

				window.scrollTo(0, 0);
			});

			currentDataTitle === state.data.activeTitle &&
				setActiveData(newDataOptionButtonElement, currentDataTitle);

			if (
				!state.data.activeTitle &&
				newDataOptionButtonElement.innerText
					.match(/^([^(]+)\s*\(/)[1]
					.trim() === state.data.titles[0]
			) {
				setActiveData(newDataOptionButtonElement, state.data.titles[0]);
				localStorage.setItem('activeData', currentDataTitle);
			}
		}
	};

	const setActiveData = (dataOptionButtonElement, dataTitle) => {
		state.data.active = state.data.allData[dataTitle];
		state.context.active = state.data.active;
		state.context.count.total = state.data.active.length;

		dataOptionButtonElement.classList.add('menu__button_active');
		element.title.innerText = `LexiLock: ${dataTitle}`;

		for (let index = 0; index < state.context.count.total; index++) {
			const currentDataContext = state.data.active[index];
			let pushedContexts = [];

			for (const currentVocabulary of currentDataContext.vcb) {
				runVocabularyAction(
					currentVocabulary.typ,
					'pushContext',
					pushedContexts,
					currentDataContext
				);

				state.vocabulary.count.total++;
			}
		}

		runVocabularyAction(state.filter.activeType, 'setActiveContext');
	};

	return processData;
};
