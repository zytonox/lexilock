export const useUtilities = () => {
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

	return {
		isScrollAtBottom,
		debounce,
		getScrollbarWidth,
	};
};
