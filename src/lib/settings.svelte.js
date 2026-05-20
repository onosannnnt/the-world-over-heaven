import { browser } from '$app/environment';

class SettingsStore {
	theme = $state('dark'); // 'light', 'dark'
	fontSize = $state(16);
	showCardNames = $state(true);
	cardSpacing = $state(1); // multiplier

	constructor() {
		if (browser) {
			const saved = localStorage.getItem('tarot_settings');
			if (saved) {
				const parsed = JSON.parse(saved);
				this.theme = parsed.theme || 'dark';
				this.fontSize = parsed.fontSize || 16;
				this.showCardNames = parsed.showCardNames !== undefined ? parsed.showCardNames : true;
				this.cardSpacing = parsed.cardSpacing || 1;
			}

			// Apply theme to document
			$effect.root(() => {
				$effect(() => {
					document.documentElement.classList.toggle('dark', this.theme === 'dark');
					document.documentElement.style.fontSize = `${this.fontSize}px`;
					localStorage.setItem(
						'tarot_settings',
						JSON.stringify({
							theme: this.theme,
							fontSize: this.fontSize,
							showCardNames: this.showCardNames,
							cardSpacing: this.cardSpacing
						})
					);
				});
			});
		}
	}
}

export const settings = new SettingsStore();
