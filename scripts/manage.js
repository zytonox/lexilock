import { useUIUpdater } from './modules/manage/ui-updater.js';
import { setupEvents } from './modules/manage/event-manager.js';

const manage = () => {
	const { updateUI } = useUIUpdater();

	updateUI();
	setupEvents();
};

manage();
