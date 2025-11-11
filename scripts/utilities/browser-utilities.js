export const useUtilities = () => {
	const createWordBoundaryRegex = string => {
		let stringEscaped = string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const hasWordCharacterAtEnd = /\w$/.test(string);
		const pattern = hasWordCharacterAtEnd
			? `\\b${stringEscaped}\\b`
			: `\\b${stringEscaped}`;

		return new RegExp(pattern);
	};

	const isScrollAtBottom = scrollThreshold => {
		const documentHeight = document.documentElement.scrollHeight;
		const windowHeight = window.innerHeight;
		const scrollTop = window.scrollY;

		return scrollTop + windowHeight >= documentHeight - scrollThreshold;
	};

	const debounce = (func, delay) => {
		let timeoutId;

		const executeAfterDelay = function (...args) {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => func.apply(this, args), delay);
		};

		executeAfterDelay.cancel = () => {
			clearTimeout(timeoutId);
		};

		return executeAfterDelay;
	};

	return {
		createWordBoundaryRegex,
		isScrollAtBottom,
		debounce,
	};
};
