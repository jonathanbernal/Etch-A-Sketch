const sliderValue = document.querySelector('.slider-value');
const gridSlider = document.querySelector('#grid-slider');
const gridContainer = document.querySelector('.grid-container');

const DEFAULT_GRID_ITEMS = 16; // This creates a default 16 x 16 grid


/**
 *  This function renders a grid on the main page. It resizes itself
 *  based on the number of rows and columns.
 * 
 *  We're always creating a NxN grid, hence the number of columns will be the
 *  same as that of rows.
 * 
 * @param {Integer} rows the number of rows/columns to generate
 */
function renderGrid(rows, cols){

    const containerWidth = gridContainer.clientWidth;
    const containerHeight = gridContainer.clientHeight;
    const rowSize = containerHeight / rows;
    const columnSize = containerWidth / cols;

    gridContainer.style['grid-template-columns'] = `repeat(auto-fill, minmax(${columnSize}, 1fr))`;
    gridContainer.style['grid-template-rows'] = `repeat(auto-fill, minmax(${rowSize}, 1fr))`;

    for (let row = 0; row < rows; row++){
        let gridRow = document.createElement('div');

        for (let col = 0; col < cols; col++) {
            let gridCol = document.createElement('div');
            gridCol.classList.add('grid-tile');
            gridCol.style.width = `${columnSize}px`;
            gridCol.style.height = `${rowSize}px`;
            gridRow.appendChild(gridCol);
        }

        gridContainer.appendChild(gridRow);
    }
}

renderGrid(30, 30);