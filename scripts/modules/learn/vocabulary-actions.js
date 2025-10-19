import { getConfig } from './config.js';
import { getElements } from './elements.js';
import { useState } from './state.js';

export const runVocabularyAction = (
	type,
	action,
	pushedContexts,
	currentDataContext
) => {
	const { UI } = getConfig();
	const element = getElements();
	const state = useState();

	switch (type) {
		case 'word':
			if (action === 'setActiveContext') {
				state.context.active = state.data.words;
				state.context.count.total = state.data.words.length;
			}

			if (action === 'setFilterButtonText') {
				element.filter.button.children[1].innerText = !state.isMobile
					? `${UI.WORD_BUTTON_NAME} (${state.vocabulary.count.word})`
					: `${UI.WORD_BUTTON_NAME[0]} (${state.vocabulary.count.word})`;
			}

			if (action === 'pushContext') {
				state.vocabulary.count.word++;

				if (!pushedContexts.includes('word')) {
					state.data.words.push(currentDataContext);
					pushedContexts.push('word');
				}
			}
			break;

		case 'collocation':
			if (action === 'setActiveContext') {
				state.context.active = state.data.collocations;
				state.context.count.total = state.data.collocations.length;
			}

			if (action === 'setFilterButtonText') {
				element.filter.button.children[1].innerText = !state.isMobile
					? `${UI.COLLOCATION_BUTTON_NAME} (${state.vocabulary.count.collocation})`
					: `${UI.COLLOCATION_BUTTON_NAME[0]} (${state.vocabulary.count.collocation})`;
			}

			if (action === 'pushContext') {
				state.vocabulary.count.collocation++;

				if (!pushedContexts.includes('collocation')) {
					state.data.collocations.push(currentDataContext);
					pushedContexts.push('collocation');
				}
			}
			break;

		case 'idiom':
			if (action === 'setActiveContext') {
				state.context.active = state.data.idioms;
				state.context.count.total = state.data.idioms.length;
			}

			if (action === 'setFilterButtonText') {
				element.filter.button.children[1].innerText = !state.isMobile
					? `${UI.IDIOM_BUTTON_NAME} (${state.vocabulary.count.idiom})`
					: `${UI.IDIOM_BUTTON_NAME[0]} (${state.vocabulary.count.idiom})`;
			}

			if (action === 'pushContext') {
				state.vocabulary.count.idiom++;

				if (!pushedContexts.includes('idiom')) {
					state.data.idioms.push(currentDataContext);
					pushedContexts.push('idiom');
				}
			}
			break;

		case 'phrasal':
			if (action === 'setActiveContext') {
				state.context.active = state.data.phrasals;
				state.context.count.total = state.data.phrasals.length;
			}

			if (action === 'setFilterButtonText') {
				element.filter.button.children[1].innerText = !state.isMobile
					? `${UI.PHRASAL_BUTTON_NAME} (${state.vocabulary.count.phrasal})`
					: `${UI.PHRASAL_BUTTON_NAME[0]} (${state.vocabulary.count.phrasal})`;
			}

			if (action === 'pushContext') {
				state.vocabulary.count.phrasal++;

				if (!pushedContexts.includes('phrasal')) {
					state.data.phrasals.push(currentDataContext);
					pushedContexts.push('phrasal');
				}
			}
			break;
	}
};
