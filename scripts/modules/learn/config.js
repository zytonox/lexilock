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

export const getConfig = () => {
	return {
		CONFIG,
		UI,
		MEDIA_QUERY,
	};
};
