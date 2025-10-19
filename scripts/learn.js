import { setupEvents } from './modules/learn/event-manager.js';
import { useDataProcessor } from './modules/learn/data-processor.js';
import { useRenderer } from './modules/learn/renderer.js';
import { useButtonManager } from './modules/learn/button-manager.js';

const learn = () => {
	const processData = useDataProcessor();
	const { renderContexts } = useRenderer();
	const { setButtonText } = useButtonManager();

	setupEvents();
	processData();
	renderContexts();
	setButtonText();
};

learn();
