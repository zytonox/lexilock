import { getElements } from './elements.js';

export const useInputValidator = () => {
	const element = getElements();

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
				!element.contextInput.value.includes(
					currentOriginalInputElement.value.trim()
				)
		);

		element.context.copyButton.disabled = !!(isInputEmpty || isOriginalInvalid);
	};

	const setupInputEventListeners = () => {
		const inputElements = document.querySelectorAll(
			'.data-form__input:not(.data-form__input-type)'
		);
		inputElements.forEach(currentInputElement => {
			currentInputElement.addEventListener('input', () => {
				validateInputs(inputElements);
			});
		});
	};

	return {
		validateInputs,
		setupInputEventListeners,
	};
};
