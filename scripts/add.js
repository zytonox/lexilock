import { useUIUpdater } from './modules/add/ui-updater.js';
import { setupEvents } from './modules/add/event-manager.js';

const add = () => {
	const { updateUI } = useUIUpdater();

	updateUI();
	setupEvents();
};

add();
