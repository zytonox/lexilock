import { getElements } from './elements.js';
import { useUtilities } from '../../utilities/browser-utilities.js';

export const useInputValidator = () => {
	const element = getElements();
	const { createWordBoundaryRegex } = useUtilities();

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
			currentOriginalInputElement => {
				const currentOriginalInputElementValueTrimmed =
					currentOriginalInputElement.value.trim();
				const wordBoundaryRegex = createWordBoundaryRegex(
					currentOriginalInputElementValueTrimmed
				);

				return !wordBoundaryRegex.test(element.contextInput.value);
			}
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
