// Tab navigation switching
function openTab(event, tabId) {
	const tabContent = document.getElementsByClassName('tabContent');
	for (let i = 0; i < tabContent.length; i++) {
		tabContent[i].style.display = 'none';
	}

	const tabLinks = document.getElementsByClassName('tabLinks');
	for (let i = 0; i < tabLinks.length; i++) {
		tabLinks[i].className = tabLinks[i].className.replace(' is-active', '');
	}

	const targetTab = document.getElementById(tabId);
	if (targetTab) {
		targetTab.style.display = 'block';
	}
	
	if (event && event.currentTarget) {
		event.currentTarget.className += ' is-active';
	}

	// Reset cocktail filters to 'all' if the user opens the cocktails tab
	if (tabId === 'cocktails') {
		filterSubcategory(null, 'all');
	}
}

// Subcategory filtering logic for Cocktails
function filterSubcategory(event, subcat) {
	// Update active state on buttons
	const buttons = document.querySelectorAll('.subTabLink');
	buttons.forEach(btn => btn.classList.remove('active'));

	if (event && event.currentTarget) {
		event.currentTarget.classList.add('active');
	} else {
		// Reset to "All" button if triggered programmatically
		const allBtn = document.querySelector('.subTabLink[onclick*="all"]');
		if (allBtn) allBtn.classList.add('active');
	}

	const allHeader = document.querySelector('.all-cocktails-header');
	const sections = document.querySelectorAll('.cocktail-section');

	// Reset all cards to visible
	const allCards = document.querySelectorAll('#cocktails .borderline');
	allCards.forEach(card => card.style.display = 'flex');

	if (subcat === 'all') {
		if (allHeader) {
			allHeader.style.display = 'block';
			allHeader.querySelector('.section-title').textContent = '— All Cocktails —';
		}
		sections.forEach(sec => {
			sec.style.display = 'block';
			const secHeader = sec.querySelector('.section-header');
			if (secHeader) secHeader.style.display = 'block';
			
			// Restore original section count
			const secCountEl = sec.querySelector('.section-subtitle span');
			if (secCountEl) {
				secCountEl.textContent = sec.querySelectorAll('.borderline').length;
			}
		});
		updateCocktailCounts();
	} else if (subcat === 'happyhour') {
		if (allHeader) {
			allHeader.style.display = 'block';
			allHeader.querySelector('.section-title').textContent = '— Happy Hour Cocktails —';
			const hhCount = document.querySelectorAll('#cocktails .borderline[data-happy-hour="true"]').length;
			allHeader.querySelector('.section-subtitle').innerHTML = `<span id="all-cocktails-count">${hhCount}</span> Selections`;
		}

		sections.forEach(sec => {
			const hhCards = sec.querySelectorAll('.borderline[data-happy-hour="true"]');
			const allSecCards = sec.querySelectorAll('.borderline');
			
			// Hide category headers for a cleaner, unified Happy Hour grid
			const secHeader = sec.querySelector('.section-header');
			if (secHeader) secHeader.style.display = 'none';

			if (hhCards.length > 0) {
				sec.style.display = 'block';
				allSecCards.forEach(card => {
					if (card.getAttribute('data-happy-hour') === 'true') {
						card.style.display = 'flex';
					} else {
						card.style.display = 'none';
					}
				});
				const secCountEl = sec.querySelector('.section-subtitle span');
				if (secCountEl) {
					secCountEl.textContent = hhCards.length;
				}
			} else {
				sec.style.display = 'none';
			}
		});
	} else {
		if (allHeader) {
			allHeader.style.display = 'none';
			allHeader.querySelector('.section-title').textContent = '— All Cocktails —';
		}
		sections.forEach(sec => {
			const secHeader = sec.querySelector('.section-header');
			if (secHeader) secHeader.style.display = 'block';

			if (sec.getAttribute('data-category') === subcat) {
				sec.style.display = 'block';
				const secCountEl = sec.querySelector('.section-subtitle span');
				if (secCountEl) {
					secCountEl.textContent = sec.querySelectorAll('.borderline').length;
				}
			} else {
				sec.style.display = 'none';
			}
		});
	}
}

// Dynamically inject badges on cocktail images
function injectCocktailBadges() {
	const sections = document.querySelectorAll('.cocktail-section');
	sections.forEach(section => {
		const category = section.getAttribute('data-category');
		let badgeText = category.toUpperCase();
		if (badgeText === 'DESSERT') {
			badgeText = 'DESSERT'; // consistent formatting
		}

		// Find all card structures within this section
		const cards = section.querySelectorAll('.borderline');
		cards.forEach(card => {
			// Find image container to inject badge
			const imageContainer = card.querySelector('.cocktail-images') || card;
			if (imageContainer && !card.querySelector('.cocktail-badge')) {
				const badge = document.createElement('div');
				badge.className = 'cocktail-badge';
				badge.textContent = badgeText;
				imageContainer.appendChild(badge);
			}
		});
	});
}

// Dynamically calculate selection counts for each section
function updateCocktailCounts() {
	const sections = document.querySelectorAll('.cocktail-section');
	let totalCount = 0;

	sections.forEach(section => {
		const count = section.querySelectorAll('.borderline').length;
		totalCount += count;

		// Update count in category header
		const countSpan = section.querySelector('.section-subtitle span');
		if (countSpan) {
			countSpan.textContent = count;
		}
	});

	// Update all cocktails total count
	const totalSpan = document.getElementById('all-cocktails-count');
	if (totalSpan) {
		totalSpan.textContent = totalCount;
	}
}

// Initialize dynamic features on DOM load
document.addEventListener('DOMContentLoaded', () => {
	injectCocktailBadges();
	updateCocktailCounts();
});
