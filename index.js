const sliderValue = document.querySelector('.slider-value');
const gridSlider = document.querySelector('#grid-slider');
const gridValue = document.querySelector('.grid-value');
const gridContainer = document.querySelector('.grid-container');
const gridCell = document.querySelector('')

const DEFAULT_GRID_ITEMS = 16; // This creates a default 16 x 16 grid

/**
 * This function gets rid of all the children that are attached to a grid
 * when calling renderGrid(). It is used to update the grid when the grid
 * size changes.
 */
function wipeGrid() {
    while(gridContainer.firstChild){
        gridContainer.removeChild(gridContainer.firstChild);
    }
}

/**
 *  This function renders a grid on the main page. It resizes itself
 *  based on the number of rows and columns.
 * 
 *  We're always creating a NxN grid, hence the number of columns will be the
 *  same as that of rows.
 * 
 * @param {Integer} rows the number of rows to generate
 * @param {Integer} cols the number of columns to generate
 */
function renderGrid(rows, cols){

    // Calculate the dimensions of the container and cells based on different screen sizes
    const containerWidth = gridContainer.clientWidth;
    const containerHeight = gridContainer.clientHeight;
    const rowSize = containerHeight / rows;
    const columnSize = containerWidth / cols;

    // we need to wipe the previous grid first or else every time we render
    // a new grid, it will just add up right next to the previous one.
    wipeGrid();

    for (let row = 0; row < rows; row++){
        let gridRow = document.createElement('div');

        for (let col = 0; col < cols; col++) {
            let gridCol = document.createElement('div');
            gridCol.classList.add('grid-cell');
            gridCol.style.width = `${columnSize}px`;
            gridCol.style.height = `${rowSize}px`;
            gridRow.appendChild(gridCol);
        }

        gridContainer.appendChild(gridRow);
    }
}

gridSlider.addEventListener('input', (evt) => {
    const gridSizeValue = evt.target.value;
    gridValue.textContent = gridSizeValue;

    renderGrid(gridSizeValue, gridSizeValue);
});

function initWebPage() {
    // Call out renderGrid() to initiate the grid on page load.
    gridValue.textContent = DEFAULT_GRID_ITEMS;
    renderGrid(DEFAULT_GRID_ITEMS, DEFAULT_GRID_ITEMS);
}

initWebPage();

/*
 TODO: find out how to delete children of a node without referencing them directly.
 Can we create a single child node for the grid container and just delete it to 
 render a new grid?
 We need to wipe the grid somehow or change the size of the existing items and delete
 the ones we don't need. What could be more efficient in terms of performance?
 If we could keep a linear algorithm, we could do this by deleting any exceeding items
*/