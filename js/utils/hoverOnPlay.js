"use strict";

/**
 * Handles the hover-over behavior for a card element, playing a video when the card is hovered over and pausing it when the hover is removed.
 * @param {HTMLElement} $card - The card element to apply the hover-on-play behavior to.
 */
export const hoverOnPlay = $card => {
    const $cardVideo = $card.querySelector("[data-video]");
    const $cardBadge = $card.querySelector("[data-card-badge]");
    let isPlaying = false;
    let playTimeout;

    $card.addEventListener("pointerover", function () {
        playTimeout = setTimeout(() =>{
            $cardBadge.style.display = "none";

            $cardVideo.play().then(res => {
                isPlaying = true;
            }).catch(err => {
                isPlaying = false;
            });
        }, 500);
    });

    $card.addEventListener("pointerout", function () {
        playTimeout && clearTimeout(playTimeout);

        $cardBadge.style.display = "grid";
        if (isPlaying) $cardVideo.pause();
    });
};