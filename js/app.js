"use strict";

/**
 * Import
 */
import { client } from "./api_configure.js";
import { photoCard } from "./photo_card.js";
import { gridInit, updateGrid } from "./utils/masonry_grid.js";
import { videoCard } from "./video_card.js";
import { collectionCard } from "./collection_card.js";


/**
 * Render curated photos in home page
 */
const $photoGrid = document.querySelector("[data-photo-grid]");
$photoGrid.innerHTML = "<div class='skeleton'></div>".repeat(18);

if ($photoGrid){
    client.photos.curated({ page: 1, per_page: 20 }, data => {
        $photoGrid.innerHTML = '';
        const photoGrid = gridInit($photoGrid);
    
        data.photos.forEach(photo => {
            const $photoCard = photoCard(photo);
    
            updateGrid($photoCard, photoGrid.columnsHeight, photoGrid.$columns);
        });
    });
}


/**
 * Render popular videos in home page
 */
const $videoGrid = document.querySelector("[data-video-grid]");
$videoGrid.innerHTML = "<div class='skeleton'></div>".repeat(18);

if ($videoGrid) {
    client.videos.popular({per_page: 20 }, data => {
        $videoGrid.innerHTML = '';
        const videoGrid = gridInit($videoGrid);
    
        data.videos.forEach(video => {
            const $videoCard = videoCard(video);
    
            updateGrid($videoCard, videoGrid.columnsHeight, videoGrid.$columns);
        });
    });
}


/**
 * Render collections in home page
 */
const $collectionGrid = document.querySelector("[data-collection-grid]");

if ($collectionGrid) {
    client.collections.featured({ per_page: 18 }, data => {
        data.collections.forEach(collection => {
            const $collectionCard = collectionCard(collection);

            $collectionGrid.appendChild($collectionCard);
        });
    });
}



/**
 * Slider
 */
const banner = document.querySelector('.banner');
const banners = document.querySelectorAll('.banner-card');
const indicatorsContainer = document.createElement('div');
indicatorsContainer.className = 'indicators';
banner.insertAdjacentElement('afterend', indicatorsContainer);

if (banners.length) {
    banners.forEach((_, index) => {
        const indicator = document.createElement('span');
        indicator.className = 'indicator';
        if (index === 0) indicator.classList.add('active');
        indicatorsContainer.appendChild(indicator);
    });

    const indicators = indicatorsContainer.querySelectorAll('.indicator');
    let currentIndex = 0;

    function moveSlider() {
        currentIndex = (currentIndex + 1) % banners.length;
        updateSliderPosition();

        updateIndicators();
    }

    function updateSliderPosition() {
        const offset = currentIndex * banner.offsetWidth;
        banner.scrollTo({
            left: offset,
            behavior: 'smooth',
        });
    }

    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    function pauseSliderOnHover(element) {
        element.addEventListener('mouseenter', () => clearInterval(sliderInterval));
        element.addEventListener('mouseleave', () => {
            sliderInterval = setInterval(moveSlider, 3000);
        });
    }

    let sliderInterval = setInterval(moveSlider, 3000);

    banner.addEventListener('wheel', (e) => {
        if (e.shiftKey) {
            e.preventDefault();
        }
    });

    pauseSliderOnHover(banner);

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateSliderPosition();
            updateIndicators();
        });

        pauseSliderOnHover(indicator);
    });

    let startX = 0;
    let endX = 0;

    banner.addEventListener('touchstart', (e) => {
        clearInterval(sliderInterval);
        startX = e.touches[0].clientX;
    });

    banner.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;
    });

    banner.addEventListener('touchend', () => {
        if (startX - endX > 50) {
            currentIndex = (currentIndex + 1) % banners.length;
        } else if (endX - startX > 50) {
            currentIndex = (currentIndex - 1 + banners.length) % banners.length;
        }
        updateSliderPosition();
        updateIndicators();

        sliderInterval = setInterval(moveSlider, 3000);
    });
}