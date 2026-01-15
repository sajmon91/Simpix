"use strict";

/**
 * Import
 */
import { client } from "../../js/api_configure.js";
import { ripple } from "../../js/utils/ripple.js";
import { menu } from "../../js/menu.js";
import { favorite } from "../../js/favorite.js";


/**
 * Add ripple effect
 */
const $rippleElems = document.querySelectorAll("[data-ripple]");

$rippleElems.forEach($rippleElem => ripple($rippleElem));

/**
 * Page transition
 */
window.addEventListener('loadstart', function () {
    document.body.style.opacity = '0';
});

window.addEventListener('DOMContentLoaded', function () {
    document.body.style.opacity = '1';
});

/**
 * Menu toggle
 */
const $menuWrappers = document.querySelectorAll("[data-menu-wrapper]");

$menuWrappers.forEach($menuWrapper => menu($menuWrapper));


/**
 * Add to favorite
 */
const favoriteVideos = JSON.parse(window.localStorage.getItem("favorite")).videos;
const $favoriteBtn = document.querySelector("[data-add-favorite]");
const videoId = window.location.search.split("=")[1];

$favoriteBtn.classList[favoriteVideos[videoId] ? "add" : "remove"]("active");
favorite($favoriteBtn, 'videos', videoId);


/**
 * Render detail data
 */
const $detailWrapper = document.querySelector("[data-detail-wrapper]");
const $downloadLink = document.querySelector("[data-download-link]");
const $downloadMenu = document.querySelector("[data-download-menu]");

client.videos.detail(videoId, data => {

    const {
        width,
        height,
        image,
        user: { name: author, url: authorUrl },
        video_files
    } = data;

    let hdVideo = video_files.find(item => item.quality === 'hd');
    if (!hdVideo) {
        hdVideo = video_files.find(item => item.width > 1000);
    } 
    const { file_type: type, link } = hdVideo;

    $downloadLink.href = link;

    const sortedVideoFiles = video_files.sort((a, b) => a.width - b.width);

    sortedVideoFiles.forEach(item => {
        const {
            width,
            height,
            quality,
            link
        } = item;

        const qualityText = quality ? `${quality.toUpperCase()}` : '';
        $downloadMenu.innerHTML += `
            <a href="${link}" download class="menu-item" data-download-img>
                <span class="label-large text">${qualityText}</span>
                
                <span class="label-large trailing-text">${width}x${height}</span>

                <div class="state-layer"></div>
            </a>
        `;
    });

    $detailWrapper.innerHTML = `
        <div class="detail-banner" style="aspect-ratio: ${width} / ${height};">
            <video poster="${image}" controls class="img-cover" data-video>
                <source src="${link}" type="${type}">
            </video>
        </div>

        <p class="title-small">Video by <span class="color-secondary"><a href="${authorUrl}" target="_blank">${author}</a></span></p>
    `;
});

