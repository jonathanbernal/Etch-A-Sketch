const sliderValue = document.querySelector('.slider-value');
const gridSlider = document.querySelector('#grid-slider');

// Render default value for the slider
sliderValue.textContent = gridSlider.value;


/**
 * This event listener updates the value of the slider and renders it on the webpage.
 */
gridSlider.addEventListener('input', (evt) => {
    sliderValue.textContent = evt.target.value;
});