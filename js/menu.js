"use strict";

/**
 * Import
 */
import { addEventOnElements } from "./utils/event.js";

/**
 * Add menu functionality
 * 
 * @param {Node} $menuWrapper Menu parent node
 * @param {Function} callback Callback function
 */
export const menu = function ($menuWrapper, callback) {
    const $menu = $menuWrapper.querySelector("[data-menu]");
    const $menuTogglers = $menuWrapper.querySelectorAll("[data-menu-toggler]");
    const $menuItems = $menuWrapper.querySelectorAll("[data-menu-item]");

    addEventOnElements($menuTogglers, 'click', () => {
        $menu.classList.toggle("expanded");
    });

    addEventOnElements($menuItems, 'click', function () {
        $menu.classList.remove("expanded");
        if (callback) callback(this.dataset.menuItem);
    });
};