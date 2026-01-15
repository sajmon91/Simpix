"use strict";

/**
 * Import
 */
import { ripple } from "./utils/ripple.js";
import { addEventOnElements } from "./utils/event.js";
import { segment } from "./segment_btn.js";
import { updateUrl } from "./utils/updateUrl.js";
import { urlDecode } from "./utils/urlDecode.js";

/********************
 * Search view toggle in small devices
 */

const $searchTogglers = document.querySelectorAll("[data-search-toggler]");
const $searchView = document.querySelector("[data-search-view]");

addEventOnElements($searchTogglers, 'click', () => $searchView.classList.toggle("show"));


/********************
 * Search clear
 */

const $searchField = document.querySelector("[data-search-field]");
const $searchClearBtn = document.querySelector("[data-search-clear-btn]");

$searchClearBtn.addEventListener('click', () => $searchField.value = '');


/********************
 * Search type
 */

const $searchSegment = document.querySelector('[data-segment="search"]');
const $activeSegmentBtn = $searchSegment.querySelector('[data-segment-btn].selected');
window.searchType = $activeSegmentBtn.dataset.segmentValue;

segment($searchSegment, segmentValue => window.searchType = segmentValue);

/********************
 * Search submit
 */

const $searchBtn = document.querySelector("[data-search-btn]");

$searchBtn.addEventListener('click', () => {
    const searchValue = $searchField.value.trim();

    if (searchValue){
        updateSearchHistory(searchValue);

        window.filterObj.query = searchValue;
        updateUrl(window.filterObj, window.searchType);
    }
});


/********************
 * Submit search when press on 'Enter' key
 */

$searchField.addEventListener('keydown', e => {
    if (e.key === 'Enter' && $searchField.value.trim()) {
        $searchBtn.click();
    }
});


/********************
 * Search history
 */

// Initial search history
let searchHistory = {
    items: []
};

if (window.localStorage.getItem('search_history')) {
    searchHistory = JSON.parse(window.localStorage.getItem('search_history'));
} else {
    window.localStorage.setItem('search_history', JSON.stringify(searchHistory));
}

/**
 * Updates the search history by managing the list of recent search values.
 *
 * @param {string} searchValue - The search value to be added to the history.
 */
const updateSearchHistory = (searchValue) => {
    /**
     * If the searched value is already present in search list
     * then remove that one and add the search value at the beginning of the search list
     * This ensures that most recent search is at the top of the history
     */
    if (searchHistory.items.includes(searchValue)) {
        searchHistory.items.splice(searchHistory.items.indexOf(searchValue), 1);
    }

    searchHistory.items.unshift(searchValue);

    window.localStorage.setItem('search_history', JSON.stringify(searchHistory));
};

/**
 * Render search history items in search list
 */

const $searchList = document.querySelector('[data-search-list]');
const historyLen = searchHistory.items.length;

for (let i = 0; i < historyLen & i <= 5; i++) {
    const $listItem = document.createElement('button');
    $listItem.classList.add('list-item');

    $listItem.innerHTML = `
        <span class="material-symbols-outlined leading-icon" aria-hidden="true">history</span>
        <span class="body-large text">${searchHistory.items[i]}</span>

        <div class="state-layer"></div>
    `;

    ripple($listItem);

    $listItem.addEventListener('click', function () {
        $searchField.value = this.children[1].textContent;
        $searchBtn.click();
    });

    $searchList.appendChild($listItem);
}


/**
 * Show searched value in search field after reload
 */
const search = urlDecode(window.location.search.slice(1));
if (search.query) {
    $searchField.value = search.query;
}
