const app = () => {
	/************************* Config *************************/
	const CONFIG = {
		MAX_CONTEXT_COUNT: 30,
		SCROLL_THRESHOLD: 100,
	};

	const UI = {
		DATA_BUTTON_NAME: 'Data',
		FILTER_BUTTON_NAME: 'Filter',
		WORD_BUTTON_NAME: 'Words',
		COLLOCATION_BUTTON_NAME: 'Collocations',
		IDIOM_BUTTON_NAME: 'Idioms',
		PHRASAL_BUTTON_NAME: 'Phrasal Verbs',
		BORDER_RADIUS: '5px',
		MOBILE_WIDTH: '650px',
	};

	const MEDIA_QUERY = window.matchMedia(`(max-width: ${UI.MOBILE_WIDTH})`);

	/************************* Elements *************************/
	const element = {
		title: document.querySelector('title'),
		header: document.querySelector('header'),
		data: {
			button: document.querySelector('.menu__data-toggle'),
			contextMenu: document.querySelector('.menu__data-context-menu'),
			optionButtons: [],
		},
		hint: {
			button: document.querySelector('.menu__hint-toggle'),
		},
		translate: {
			button: document.querySelector('.menu__transl-toggle'),
		},
		filter: {
			button: document.querySelector('.menu__filter-toggle'),
			contextMenu: document.querySelector('.menu__filter-context-menu'),
			wordButton: document.querySelector('.menu__filter-word'),
			collocationButton: document.querySelector('.menu__filter-collocation'),
			idiomButton: document.querySelector('.menu__filter-idiom'),
			phrasalButton: document.querySelector('.menu__filter-phrasal'),
		},
		view: {
			button: document.querySelector('.menu__view-toggle'),
			container: document.querySelector('.menu__view-container'),
			input: document.querySelector('.menu__view-count-input'),
			contextCount: document.querySelector('.menu__view-count'),
			previousButton: document.querySelector('.menu__view-navigation-previous'),
			nextButton: document.querySelector('.menu__view-navigation-next'),
		},
		container: document.querySelector('.container'),
	};
	element.filter.typeButtons = [
		element.filter.wordButton,
		element.filter.collocationButton,
		element.filter.idiomButton,
		element.filter.phrasalButton,
	];
	element.contextMenuButtons = [element.data.button, element.filter.button];

	/************************* State *************************/
	let state = {
		data: {
			active: [],
			activeTitle: localStorage.getItem('activeData'),
			titles: Object.keys(allData),
			words: [],
			collocations: [],
			idioms: [],
			phrasals: [],
			count: {
				total: Object.values(allData).reduce(
					(totalCount, activeData) => totalCount + activeData.length,
					0
				),
			},
		},
		context: {
			active: [],
			count: {
				processed: 0,
				total: 0,
				max: CONFIG.MAX_CONTEXT_COUNT,
			},
		},
		vocabulary: {
			active: [],
			original: [],
			count: {
				word: 0,
				collocation: 0,
				idiom: 0,
				phrasal: 0,
				total: 0,
			},
		},
		toggle: {
			isHintOn: false,
			isViewOn: false,
			isTranslated: false,
		},
		filter: {
			activeType: null,
		},
		view: {
			inputMaxLength: 0,
		},
		isMobile: MEDIA_QUERY.matches,
	};

	/************************ Utilities ************************/
	const isScrollAtBottom = scrollThreshold => {
		const documentHeight = document.documentElement.scrollHeight;
		const windowHeight = window.innerHeight;
		const scrollTop = window.scrollY;

		return scrollTop + windowHeight >= documentHeight - scrollThreshold;
	};

	const debounce = (func, delay) => {
		let timeout;

		return function (...args) {
			clearTimeout(timeout);

			timeout = setTimeout(() => func.apply(this, args), delay);
		};
	};

	const getScrollbarWidth = () => {
		const placeholderElementOuter = document.createElement('div');
		placeholderElementOuter.style.visibility = 'hidden';
		placeholderElementOuter.style.overflow = 'scroll';
		placeholderElementOuter.style.msOverflowStyle = 'scrollbar';
		document.body.appendChild(placeholderElementOuter);

		const placeholderElementInner = document.createElement('div');
		placeholderElementOuter.appendChild(placeholderElementInner);

		const scrollbarWidth =
			placeholderElementOuter.offsetWidth - placeholderElementInner.offsetWidth;

		placeholderElementOuter.parentNode.removeChild(placeholderElementOuter);

		return scrollbarWidth;
	};

	/*********************** Data Processor ***********************/
	const processData = () => {
		for (const currentDataTitle of state.data.titles) {
			const currentDataTotalCount = allData[currentDataTitle].length;

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
		state.data.active = allData[dataTitle];
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

	/************************* Renderer *************************/
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

	/************************* Hints *************************/
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
			const vocabularyElementOriginalArray = state.vocabulary.original.find(
				currentOriginalVocabularyItem => {
					const vocabularyElementOriginalSplit =
						vocabularyElementOriginal.split(' ');
					const firstVocabularyElementOriginalItem =
						vocabularyElementOriginalSplit[0];
					return currentOriginalVocabularyItem.includes(
						firstVocabularyElementOriginalItem + ' '
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
		newHintElement.style.top = `${
			event.clientY - containerElementPosition.top
		}px`;
		newHintElement.style.left = `${
			event.clientX - containerElementPosition.left
		}px`;

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

			const hntTypSplt = vocabularyElement.classList[1].split('_');
			hintTypeElement.innerText =
				hntTypSplt[hntTypSplt.length - 1].charAt(0).toUpperCase() +
				hntTypSplt[hntTypSplt.length - 1].slice(1);

			hintTypeElement.style.fontSize = '16px';
			hintTypeElement.style.color = '#6d6d6d';
			newHintElement.append(hintTypeElement);
		}

		const viewportWidth = Math.max(
			document.documentElement.clientWidth || 0,
			window.innerWidth || 0
		);
		const viewportHeight = Math.max(
			document.documentElement.clientHeight || 0,
			window.innerHeight || 0
		);

		let initialScroll = document.documentElement.scrollTop;

		element.container.append(newHintElement);

		const hintElementPosition = newHintElement.getBoundingClientRect();
		const hintElementPositionRight = hintElementPosition.right;
		if (viewportWidth < hintElementPositionRight) {
			const scrollbarWidth = getScrollbarWidth();
			newHintElement.style.left = `${
				hintElementPosition.left -
				(hintElementPositionRight - viewportWidth) -
				scrollbarWidth
			}px`;
		}

		const hintElementPositionBottom = hintElementPosition.bottom;
		const currentHeaderHeight = element.header.offsetHeight;
		if (!state.isMobile && viewportHeight < hintElementPositionBottom) {
			newHintElement.style.top = `${
				newHintElement.offsetTop - (hintElementPositionBottom - viewportHeight)
			}px`;
		} else if (
			state.isMobile &&
			viewportHeight - currentHeaderHeight < hintElementPositionBottom
		) {
			newHintElement.style.top = `${
				newHintElement.offsetTop -
				(hintElementPositionBottom - viewportHeight) -
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

	element.hint.button.addEventListener('click', toggleHints);

	/*********************** Translation ***********************/
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
						state.vocabulary.original[currentVocabularyElementIndex].push(
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

	element.translate.button.addEventListener('click', toggleTranslation);

	/************************** Filter **************************/
	const activateFilterTypeButton = () => {
		element.filter.typeButtons.forEach(currentFlterTypeButtonElement => {
			currentFlterTypeButtonElement.classList.remove('menu__button_active');
		});

		if (state.filter.activeType) {
			const activeFilterTypeButtonElement = document.querySelector(
				`.menu__filter-${state.filter.activeType}`
			);
			activeFilterTypeButtonElement.classList.add('menu__button_active');
		}
	};

	element.filter.typeButtons.forEach(currentFilterTypeButtonElement => {
		removeHint();

		currentFilterTypeButtonElement.addEventListener('click', () => {
			const buttonTypeSplit =
				currentFilterTypeButtonElement.classList[2].split('-');
			const buttonType = buttonTypeSplit[buttonTypeSplit.length - 1];

			state.context.count.processed = 0;

			if (state.filter.activeType !== buttonType) {
				state.filter.activeType = buttonType;

				runVocabularyAction(state.filter.activeType, 'setActiveContext');

				renderContexts();

				runVocabularyAction(state.filter.activeType, 'setFilterButtonText');
				activateFilterTypeButton();
			} else {
				resetButtonStyles(element.filter.button);

				state.filter.activeType = null;

				state.context.active = state.data.active;
				state.context.count.total = state.data.active.length;
				renderContexts();

				activateFilterTypeButton();
			}

			setViewCounts();

			window.scrollTo(0, 0);
		});
	});

	/*************************** View ***************************/
	const toggleView = () => {
		removeHint();

		state.context.count.max = !state.toggle.isViewOn
			? 1
			: CONFIG.MAX_CONTEXT_COUNT;
		state.context.count.processed = 0;

		element.view.container.classList.toggle('menu__item_inactive');

		if (!state.toggle.isViewOn) {
			element.view.button.classList.add('menu__button_active');

			document.removeEventListener('scroll', debounceCall);
			document.addEventListener('keydown', handleViewKeyDownEvent);

			renderContexts();

			state.toggle.isViewOn = true;
		} else {
			element.view.button.classList.remove('menu__button_active');

			document.addEventListener('scroll', debounceCall);
			document.removeEventListener('keydown', handleViewKeyDownEvent);

			renderContexts();

			state.toggle.isViewOn = false;
		}

		setViewCounts();
	};

	const goToNextContext = () => {
		if (state.context.count.processed >= state.context.count.total) {
			state.context.count.processed = 0;
		}

		element.view.input.value = state.context.count.processed + 1;

		renderContexts();
	};

	const goToPreviousContext = () => {
		if (state.context.count.processed <= 1) {
			state.context.count.processed = state.context.count.total - 1;
		} else {
			state.context.count.processed -= 2;
		}

		element.view.input.value = state.context.count.processed + 1;

		renderContexts();
	};

	const setViewCounts = () => {
		element.view.input.value = state.context.count.processed;
		element.view.contextCount.innerText = '/ ' + state.context.count.total;

		state.view.inputMaxLength = String(state.context.count.total).length;
	};

	element.view.button.addEventListener('click', toggleView);

	element.view.input.addEventListener('input', () => {
		if (element.view.input.value.length > state.view.inputMaxLength) {
			element.view.input.value = element.view.input.value.slice(
				0,
				state.view.inputMaxLength
			);
		}
	});

	element.view.nextButton.addEventListener('click', goToNextContext);
	element.view.previousButton.addEventListener('click', goToPreviousContext);

	/************************ Buttons ************************/
	const setButtonText = () => {
		element.data.button.children[1].innerText = !state.isMobile
			? UI.DATA_BUTTON_NAME
			: '';
		element.filter.button.children[1].innerText = !state.isMobile
			? UI.FILTER_BUTTON_NAME
			: '';

		element.filter.wordButton.innerText = `${UI.WORD_BUTTON_NAME} (${state.vocabulary.count.word})`;
		element.filter.collocationButton.innerText = `${UI.COLLOCATION_BUTTON_NAME} (${state.vocabulary.count.collocation})`;
		element.filter.idiomButton.innerText = `${UI.IDIOM_BUTTON_NAME} (${state.vocabulary.count.idiom})`;
		element.filter.phrasalButton.innerText = `${UI.PHRASAL_BUTTON_NAME} (${state.vocabulary.count.phrasal})`;
	};

	const getButtonText = (buttonElement, text) => {
		if (!buttonElement) return null;

		let buttonName;
		let buttonCount;

		const contextMenu = buttonElement.nextElementSibling;
		switch (contextMenu.classList[1]) {
			case 'menu__data-context-menu':
				buttonName = UI.DATA_BUTTON_NAME;
				buttonCount = state.data.count.total;
				break;
			case 'menu__filter-context-menu':
				buttonName = UI.FILTER_BUTTON_NAME;
				buttonCount = state.vocabulary.count.total;
				break;
			default:
				return null;
		}

		switch (text) {
			case 'name':
				return buttonName;
			case 'count':
				return buttonCount;
			default:
				return null;
		}
	};

	const resetButtonStyles = buttonElement => {
		buttonElement.children[1].innerText = !state.isMobile
			? getButtonText(buttonElement, 'name')
			: '';
		buttonElement.style.borderRadius = UI.BORDER_RADIUS;
		buttonElement.classList.remove('menu__button_active');
	};

	const setContextMenuButtonText = buttonElement => {
		const contexMenuElement = buttonElement.nextElementSibling;

		const buttonName = getButtonText(buttonElement, 'name');
		const buttonCount = getButtonText(buttonElement, 'count');

		if (!contexMenuElement.classList.contains('menu__item_inactive')) {
			buttonElement.children[1].innerText = !state.isMobile
				? `${buttonName} (${buttonCount})`
				: ` (${buttonCount})`;
		} else {
			buttonElement.children[1].innerText = !state.isMobile ? buttonName : '';
		}
	};

	/*********************** Context Menu ***********************/
	const toggleContextMenu = event => {
		removeHint();

		const buttonElement = event.target;
		const contextMenuElement = buttonElement.nextElementSibling;

		const buttonName = getButtonText(buttonElement, 'name');
		const buttonCount = getButtonText(buttonElement, 'count');

		if (contextMenuElement.classList.contains('menu__item_inactive')) {
			hideAllContexMenus();

			contextMenuElement.classList.remove('menu__item_inactive');

			buttonElement.classList.add('menu__button_active');
			if (!state.isMobile) {
				buttonElement.style.borderBottomRightRadius = '0';
				buttonElement.style.borderBottomLeftRadius = '0';
			} else {
				buttonElement.style.borderTopRightRadius = '0';
				buttonElement.style.borderTopLeftRadius = '0';
			}
			buttonElement.children[1].innerText = !state.isMobile
				? `${buttonName} (${buttonCount})`
				: ` (${buttonCount})`;
		} else {
			hideContextMenu(buttonElement);
		}

		event.stopPropagation();
	};

	const hideContextMenu = buttonElement => {
		const contextMenuElement = buttonElement.nextElementSibling;

		if (contextMenuElement.classList.contains('menu__item_inactive')) return;

		contextMenuElement.classList.add('menu__item_inactive');

		if (
			contextMenuElement.classList[1] === 'menu__filter-context-menu' &&
			state.filter.activeType
		) {
			runVocabularyAction(state.filter.activeType, 'setFilterButtonText');
			buttonElement.style.borderRadius = UI.BORDER_RADIUS;
			return;
		}

		resetButtonStyles(buttonElement);
	};

	const hideAllContexMenus = () => {
		element.contextMenuButtons.forEach(currentContextMenuButtonElement =>
			hideContextMenu(currentContextMenuButtonElement)
		);
	};

	element.contextMenuButtons.forEach(currentContextMenuButtonElement =>
		currentContextMenuButtonElement.addEventListener('click', toggleContextMenu)
	);

	document.addEventListener('click', hideAllContexMenus);

	/*********************** Lazy Loader ***********************/
	const checkIfNewContextsRequired = () => {
		const isEveryContextProcessed =
			state.context.count.processed === state.context.count.total;

		if (!isEveryContextProcessed && isScrollAtBottom(CONFIG.SCROLL_THRESHOLD)) {
			renderContexts(true);
		}
	};

	const debounceCall = debounce(checkIfNewContextsRequired, 100);

	document.addEventListener('scroll', debounceCall);

	/******************** Responsive Layout ********************/
	const adaptBordersOnChange = buttonElement => {
		if (
			!buttonElement.nextElementSibling.classList.contains(
				'menu__item_inactive'
			)
		) {
			buttonElement.style.borderTopRightRadius = !state.isMobile
				? UI.BORDER_RADIUS
				: '0';
			buttonElement.style.borderTopLeftRadius = !state.isMobile
				? UI.BORDER_RADIUS
				: '0';
			buttonElement.style.borderBottomRightRadius = !state.isMobile
				? '0'
				: UI.BORDER_RADIUS;
			buttonElement.style.borderBottomLeftRadius = !state.isMobile
				? '0'
				: UI.BORDER_RADIUS;
		}
	};

	MEDIA_QUERY.addEventListener('change', event => {
		state.isMobile = event.matches;

		removeHint();

		setContextMenuButtonText(element.data.button);

		if (!state.filter.activeType) {
			setContextMenuButtonText(element.filter.button);
		} else {
			runVocabularyAction(state.filter.activeType, 'setFilterButtonText');
		}

		adaptBordersOnChange(element.filter.button);
		adaptBordersOnChange(element.data.button);
	});

	/************************ Keyboard ************************/
	const handleViewKeyDownEvent = evt => {
		if (!state.toggle.isViewOn) return;

		if (evt.key === 'ArrowLeft') {
			!element.view.input.matches(':focus-within') && goToPreviousContext();
		} else if (evt.key === 'ArrowRight') {
			!element.view.input.matches(':focus-within') && goToNextContext();
		}
	};

	element.view.input.addEventListener('keydown', event => {
		if (event.key === 'Enter') {
			element.view.input.value =
				element.view.input.value <= 0 ? 1 : element.view.input.value;
			element.view.input.value =
				element.view.input.value > state.context.count.total
					? state.context.count.total
					: element.view.input.value;

			state.context.count.processed = element.view.input.value - 1;

			renderContexts();
		}
	});

	document.addEventListener('keydown', event => {
		switch (event.key) {
			case 'h':
				toggleHints();
				break;
			case 't':
				toggleTranslation();
				break;
			case 'v':
				toggleView();
				break;
		}
	});

	document.addEventListener('keydown', function (event) {
		if (event.shiftKey && event.key === 'S') {
			window.location.href = '../pages/learn.html';
		}
	});

	/******************* Vocabulary Actions *******************/
	const runVocabularyAction = (
		type,
		action,
		pushedContexts,
		currentDataContext
	) => {
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

	/*********************** Execution ***********************/
	processData();
	renderContexts();
	setButtonText();
};

app();
