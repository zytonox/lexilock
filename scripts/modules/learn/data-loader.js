const isDevelopment =
	window.location.protocol === 'http:' || window.location.protocol === 'https:';

export const loadData = async () => {
	if (isDevelopment) {
		const newsPolitics = await fetch('/data/news-politics.json').then(
			response => response.json()
		);
		const games = await fetch('/data/games.json').then(response =>
			response.json()
		);
		const misc = await fetch('/data/misc.json').then(response =>
			response.json()
		);

		return {
			'News & Politics': newsPolitics,
			Games: games,
			Misc: misc,
		};
	} else {
		const newsPolitics = require('../../../data/news-politics.json');
		const games = require('../../../data/games.json');
		const misc = require('../../../data/misc.json');

		return {
			'News & Politics': newsPolitics,
			Games: games,
			Misc: misc,
		};
	}
};
