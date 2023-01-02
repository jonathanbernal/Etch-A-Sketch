const sliderValue = document.querySelector('.slider-value');
const gridSlider = document.querySelector('#grid-slider');
const gridContainer = document.querySelector('.grid-container');

// Render default value for the slider
sliderValue.textContent = gridSlider.value;

/**
 *  This function renders a grid on the main page. It resizes itself
 *  based on the number of rows and columns.
 * 
 *  Since our grids are always NxN size, rows and cols are always the same.
 *  However, if you feel like reusing the function for a different project,
 *  you can do so.
 * 
 * @param {Integer} rows the number of rows to generate
 * @param {Integer} cols the number of columns to generate
 */
function renderGrid(rows, cols){

}

/**
 * This event listener updates the value of the slider and renders it on the webpage.
 */
gridSlider.addEventListener('input', (evt) => {
    sliderValue.textContent = evt.target.value;
});