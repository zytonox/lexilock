import { getConfig } from './config.js';
import { loadData } from './data-loader.js';

let state = null;

const createState = async () => {
	const { CONFIG, MEDIA_QUERY } = getConfig();
	const allData = await loadData();

	state = {
		data: {
			allData: allData,
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
};

await createState();

export const useState = () => state;
