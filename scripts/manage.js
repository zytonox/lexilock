const context = () => {
	/************************* Elements *************************/
	const titleElement = document.querySelector('title');

	const contextInputElement = document.querySelector(
		'.data-form__input-context'
	);

	const messageElement = document.querySelector('.data-form__message');

	const vocabularyContainerElement = document.querySelector(
		'.data-form__fieldset'
	);
	const vocabularyItemElements = vocabularyContainerElement.children;
	const addButtonElement = document.querySelector('.data-form__add-vocabulary');
	const removeButtonElement = document.querySelector(
		'.data-form__remove-vocabulary'
	);

	const copyButtonElement = document.querySelector('.data-form__copy-button');
	const clearButtonElement = document.querySelector('.data-form__clear-button');

	const promptElement = document.querySelector('.prompt');
	const confirmButtonElement = document.querySelector(
		'.prompt__button:nth-child(2)'
	);
	const cancelButtonElement = document.querySelector(
		'.prompt__button:nth-child(3)'
	);
	const overlayElement = document.querySelector('.overlay');

	/********************* Input Validator *********************/

	const validateInputs = () => {
		const inputElements = document.querySelectorAll(
			'.data-form__input:not(.data-form__input-type)'
		);
		const inputElementArray = Array.from(inputElements);
		const isInputEmpty = inputElementArray.find(
			currentInputElement => !currentInputElement.value.trim()
		);

		const originalInputElements = document.querySelectorAll(
			'.data-form__input_origin'
		);
		const originalInputElementArray = Array.from(originalInputElements);
		const isOriginalInvalid = originalInputElementArray.find(
			currentOriginalInputElement =>
				!contextInputElement.value.includes(
					currentOriginalInputElement.value.trim()
				)
		);

		copyButtonElement.disabled = !!(isInputEmpty || isOriginalInvalid);
	};

	const setupInputEventListeners = () => {
		const inputElements = document.querySelectorAll(
			'.data-form__input:not(.data-form__input-type)'
		);
		inputElements.forEach(currentInputElement => {
			currentInputElement.addEventListener('input', () => {
				validateInputs();
			});
		});
	};

	/*********************** Vocabulary ***********************/
	const clearVocabularyInputs = vocabularyItemElement => {
		vocabularyItemElement.children[0].children[0].value = '';
		vocabularyItemElement.children[1].children[0].value = '';
		vocabularyItemElement.children[2].children[0].value = '';
		vocabularyItemElement.children[3].children[0].value = 'word';
	};

	const removeVocabularyItem = event => {
		if (vocabularyContainerElement.childElementCount > 1) {
			event.target.parentElement.remove();

			setupInputEventListeners();
			validateInputs();
		}

		if (vocabularyContainerElement.childElementCount === 1) {
			toggleRemoveButtonActivity(vocabularyItemElements[0], true);

			setupInputEventListeners();
			validateInputs();
		}
	};

	addButtonElement.addEventListener('click', event => {
		event.preventDefault();

		toggleRemoveButtonActivity(vocabularyItemElements[0], false);

		const vocabularyTemplateElement = vocabularyItemElements[0].cloneNode(true);
		clearVocabularyInputs(vocabularyTemplateElement);
		vocabularyContainerElement.append(vocabularyTemplateElement);

		const newVocabularyItem =
			vocabularyItemElements[vocabularyItemElements.length - 1];
		const newRemoveButton = newVocabularyItem.children[4];
		newRemoveButton.addEventListener('click', removeVocabularyItem);

		setupInputEventListeners();
		validateInputs();
	});

	removeButtonElement.addEventListener('click', removeVocabularyItem);

	/********************** Data Processor **********************/
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

	copyButtonElement.addEventListener('click', () => {
		let newContext = contextInputElement.value.trim();

		if (newContext.includes('\n')) {
			const newContextSplit = newContext.split(/\n/);
			newContext = '';

			for (let currentNewContextSplitItem of newContextSplit.length) {
				currentNewContextSplitItem = `<p class="container__context-paragraph">${currentNewContextSplitItem}</p>`;

				newContext += currentNewContextSplitItem;
			}
		}

		let newData = localStorage.getItem('newDataJSON');
		newData = newData ? JSON.parse(newData) : [];

		newData.push({
			ctx: `${newContext}`,
			vcb: [],
		});

		const vocabularyItemCount = vocabularyContainerElement.childElementCount;
		for (
			let vocabularyItem = 0;
			vocabularyItem < vocabularyItemCount;
			vocabularyItem++
		) {
			const currentNewOriginal = vocabularyItemElements[
				vocabularyItem
			].children[0].children[0].value
				.trim()
				.replace('(', '\\(')
				.replace(')', '\\)');
			const currentNewTranscription =
				vocabularyItemElements[
					vocabularyItem
				].children[1].children[0].value.trim();

			let currentNewTranslation =
				vocabularyItemElements[
					vocabularyItem
				].children[2].children[0].value.trim();
			currentNewTranslation = checkIfFirstLetterUppercase(currentNewOriginal)
				? capitalizeFirstLetter(currentNewTranslation)
				: currentNewTranslation;

			const currentNewType =
				vocabularyItemElements[vocabularyItem].children[3].children[0].value;

			const lastContextObject = newData[newData.length - 1];
			lastContextObject.vcb.push({
				orig: currentNewOriginal,
				typ: currentNewType,
				trscr: `[${currentNewTranscription.replace(/[\[\]]+/g, '')}]`,
				trsl: currentNewTranslation,
			});
		}

		localStorage.setItem('Contexts', newData.length.toString());
		const newDataJSON = JSON.stringify(newData);
		localStorage.setItem('newDataJSON', newDataJSON);

		let newDataJS = newDataJSON.replaceAll(`"ctx"`, 'ctx');
		newDataJS = newDataJS.replaceAll(`"vcb"`, 'vcb');
		newDataJS = newDataJS.replaceAll(`"orig"`, 'orig');
		newDataJS = newDataJS.replaceAll(`"typ"`, 'typ');
		newDataJS = newDataJS.replaceAll(`"trscr"`, 'trscr');
		newDataJS = newDataJS.replaceAll(`"trsl"`, 'trsl');
		newDataJS = newDataJS.substring(1, newDataJS.length - 1);

		localStorage.setItem('newDataJS', newDataJS);
		copyToClipboard(newDataJS);

		contextInputElement.value = '';
		const vocabularyItemElementArray = Array.from(vocabularyItemElements);
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

		toggleRemoveButtonActivity(vocabularyItemElements[0], true);
	});

	/*************************** UI ***************************/
	const updateUI = () => {
		const isNewData = localStorage.getItem('newDataJSON');
		clearButtonElement.disabled = !isNewData;

		const newDataLength = localStorage.getItem('Contexts');
		titleElement.innerText = !newDataLength
			? 'Context'
			: 'Contexts ' + `(${newDataLength})`;
		clearButtonElement.innerText =
			newDataLength < 2 ? 'Clear Context' : 'Clear Contexts';
	};

	const toggleRemoveButtonActivity = (firstVocabularyItemElement, state) => {
		const firstVocabularyItemRemoveButton =
			firstVocabularyItemElement.children[4];
		firstVocabularyItemRemoveButton.disabled = state;
	};

	const displayMessage = () => {
		messageElement.innerText = 'New data has been copied to clipboard';

		setTimeout(() => {
			messageElement.innerText = '';
		}, 5000);
	};

	clearButtonElement.addEventListener('click', event => {
		event.preventDefault();

		promptElement.classList.remove('prompt_inactive');
		overlayElement.classList.remove('overlay_inactive');
	});

	/************************* Prompt *************************/
	const hidePrompt = () => {
		promptElement.classList.add('prompt_inactive');
		overlayElement.classList.add('overlay_inactive');
	};

	const clearAddedContexts = () => {
		localStorage.removeItem('Contexts');
		localStorage.removeItem('newDataJSON');
		localStorage.removeItem('newDataJS');

		updateUI();
		hidePrompt();
	};

	confirmButtonElement.addEventListener('click', clearAddedContexts);
	cancelButtonElement.addEventListener('click', hidePrompt);

	/************************ Keyboard ************************/
	document.addEventListener('keydown', function (event) {
		if (event.shiftKey && event.key === 'S') {
			const allTextInputElements = Array.from(
				document.querySelectorAll(
					'.data-form__input:not(.data-form__input-type)'
				)
			);
			const isTextInputElementFocused = allTextInputElements.find(
				textInputElement => textInputElement === document.activeElement
			);
			if (!isTextInputElementFocused) {
				window.location.href = '../pages/learn.html';
			}
		}

		if (!promptElement.classList.contains('prompt_inactive')) {
			if (event.key === 'Enter') {
				clearAddedContexts();
			}

			if (event.key === 'Escape') {
				hidePrompt();
			}
		}
	});

	/*********************** Execution ***********************/
	updateUI();
	setupInputEventListeners();
};

context();
