import { getElements } from './elements.js';
import { usePromptManager } from './prompt-manager.js';

export const useKeyboardManager = () => {
	const element = getElements();
	const { hidePrompt, clearAddedContexts } = usePromptManager();

	const setupKeyboardEventListeners = () => {
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
					window.location.href = '../../../pages/learn.html';
				}
			}

			if (!element.prompt.modal.classList.contains('prompt_inactive')) {
				if (event.key === 'Enter') {
					clearAddedContexts();
				}

				if (event.key === 'Escape') {
					hidePrompt();
				}
			}
		});
	};

	return setupKeyboardEventListeners;
};
