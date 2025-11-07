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

	return {
		isScrollAtBottom,
		debounce,
	};
};
