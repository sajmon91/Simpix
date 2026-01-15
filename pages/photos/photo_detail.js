"use strict";

/**
 * Import
 */
import { client } from "../../js/api_configure.js";
import { ripple } from "../../js/utils/ripple.js";
import { gridInit, updateGrid } from "../../js/utils/masonry_grid.js";
import { photoCard } from "../../js/photo_card.js";
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
const favoritePhotos = JSON.parse(window.localStorage.getItem("favorite")).photos;
const $favoriteBtn = document.querySelector("[data-add-favorite]");
const photoId = window.location.search.split("=")[1];

$favoriteBtn.classList[favoritePhotos[photoId] ? "add" : "remove"]("active");
favorite($favoriteBtn, 'photos', photoId);


/**
 * Render detail data
 */
const $detailWrapper = document.querySelector("[data-detail-wrapper]");
const $downloadLink = document.querySelector("[data-download-link]");
const $downloadMenu = document.querySelector("[data-download-menu]");

client.photos.detail(photoId, data => {

    const {
        avg_color,
        height,
        width,
        photographer,
        photographer_url,
        alt,
        src,
        id
    } = data;

    $downloadLink.href = src.original;

    Object.entries(src).forEach(item => {
        const [key, value] = item;

        $downloadMenu.innerHTML += `
            <a href="${value}" download data-ripple data-menu-item class="menu-item" data-download-img>
                <span class="label-large text">${key}</span>

                <div class="state-layer"></div>
            </a>
        `;
    });

    $detailWrapper.innerHTML = `
        <figure class="detail-banner" style="aspect-ratio: ${width} / ${height}; background-color: ${avg_color}">
            <img src="${src.large2x}" width="${width}" height="${height}" alt="${alt}" class="img-cover">
        </figure>

        <p class="title-small">Photograph by <span class="color-primary"><a href="${photographer_url}" target="_blank">${photographer}</a></span></p>
    `;

    const $detailImg = $detailWrapper.querySelector('img');
    $detailImg.style.opacity = 0;

    $detailImg.addEventListener('load', function () {
        this.animate({
            opacity: 1
        }, { duration: 400, fill: "forwards" });

        if (alt) {
            client.photos.search({ query: alt, page: 1, per_page: 30 }, data => {
                loadSimilar(data);
            });
        } else {
            $loader.style.display = 'none';
            $photoGrid.innerHTML = '<p>No similar photo found.</p>';
        }
    });

    const $downloadImage = document.querySelectorAll("[data-download-img]");

    $downloadImage.forEach(link => {
        downloadImageFromLink(link);
    });
});


/**
 * Load similar photos
 */
const $photoGrid = document.querySelector("[data-photo-grid]");
const photoGrid = gridInit($photoGrid);
const $loader = document.querySelector("[data-loader]");

const loadSimilar = function (data) {
    data.photos.forEach(photo => {
        const $card = photoCard(photo);

        updateGrid($card, photoGrid.columnsHeight, photoGrid.$columns);
        $loader.style.display = 'none';
    });
};

/**
 * Adds functionality to download an image from a link element.
 * 
 * @param {HTMLElement} link - The link element with the image URL in its `href` attribute.
 */
const downloadImageFromLink = function (link) {
    // Prevent the default behavior of opening the link
    link.addEventListener('click', async (event) => {
        event.preventDefault();
    
        // Get the image URL from the href attribute
        const imageUrl = link.getAttribute('href');
        // Default file name if no descriptive text is found
        const text = link.querySelector('.text');
        const defaultName  = text ? `${photoId}-${text.textContent}` : `${photoId}-pixstock-image`;
    
        try {
            // Fetch the image from the provided URL
            const response = await fetch(imageUrl);
            if (!response.ok) throw new Error('Error downloading the image.');
    
            const blob = await response.blob();

            // Automatically determine the extension based on the MIME type
            const mimeType = blob.type; // MIME type, e.g., "image/jpeg"
            const extension = mimeType.split('/')[1] || 'jpg'; // Default to "jpg" if no extension is found
            const imageName = `${defaultName}.${extension}`; // Final file name with extension

            const url = URL.createObjectURL(blob);
    
            // Create a temporary <a> element for the download
            const tempLink = document.createElement('a');
            tempLink.href = url;
            tempLink.download = imageName;
            document.body.appendChild(tempLink);
            tempLink.click();
    
            // Clean up the temporary <a> element and revoke the object URL
            document.body.removeChild(tempLink);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
        }
    });
}