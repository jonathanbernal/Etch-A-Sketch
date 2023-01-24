const sliderValue = document.querySelector('.slider-value');
const gridSlider = document.querySelector('#grid-slider');
const gridValue = document.querySelector('.grid-value');
const gridContainer = document.querySelector('.grid-container');
const gridCell = document.querySelectorAll('.grid-cell');
const colorPicker = document.querySelector('#color-picker');

const toggleGridButton = document.querySelector('#toggle-grid-button');
const clearButton = document.querySelector('#clear-button');
const eraseButton = document.querySelector('#eraser-button');

const DEFAULT_GRID_SIZE = 16; // This creates a default 16 x 16 grid
const DEFAULT_CELL_COLOR = 'black';
const DEFAULT_BACKGROUND_COLOR = '#eee';
const DEFAULT_GRID_CELL_BORDER = '1px solid black';

let currentCellColor = ''; // this keeps track of the current color
let previousCellColor = ''; // this variable is used to return to the previous color when the user uses the eraser feature
let currentGridSize = 0;
let currentBackgroundColor = '';
let currentGridCellBorder = '';

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
            gridCol.style.border = currentGridCellBorder;

            gridRow.appendChild(gridCol);
        }

        gridContainer.appendChild(gridRow);
    }
}

gridContainer.addEventListener('mouseover', (evt) => {
    evt.target.style.backgroundColor = currentCellColor;
});

gridSlider.addEventListener('input', (evt) => {
    currentGridSize = evt.target.value;
    gridValue.textContent = currentGridSize;

    renderGrid(currentGridSize, currentGridSize);
});

colorPicker.addEventListener('input', (evt) => {
    currentCellColor = evt.target.value;
});

eraseButton.addEventListener('click', function(evt){
    // erasing the contents of a cell will always turn the color into the
    // current background color
    if (this.value === 'off'){
        this.value = 'on';
        previousCellColor = currentCellColor;
        currentCellColor = currentBackgroundColor;
    }
    else {
        this.value = 'off';
        currentCellColor = colorPicker.value;
    }
});

/** 
 * This event listener is responsible for clearing out the grid when the
 * clear button is pressed.
*/
clearButton.addEventListener('click', () => {
    renderGrid(currentGridSize, currentGridSize); 
});

toggleGridButton.addEventListener('click', function(){
    let gridCells = gridContainer.querySelectorAll('.grid-cell');

    if( this.value == 'on'){
        this.value = 'off';
        currentGridCellBorder = 'none';
    }
    else {
        this.value = 'on';
        currentGridCellBorder = DEFAULT_GRID_CELL_BORDER;
    }
    // once the current style is determined, re-render the grid
    gridCells.forEach(item => {item.style.border = currentGridCellBorder});
});

/**
 * This function initializes the contents of the Web page on loadup.
 * Another alternative to this function could be to load all the initial
 * values on window.load
 */
function initWebPage() {
    // Call out renderGrid() to initiate the grid on page load.
    currentGridSize = DEFAULT_GRID_SIZE;
    currentCellColor = DEFAULT_CELL_COLOR;
    currentBackgroundColor = DEFAULT_BACKGROUND_COLOR;
    currentGridCellBorder = DEFAULT_GRID_CELL_BORDER;

    gridValue.textContent = DEFAULT_GRID_SIZE;
    renderGrid(currentGridSize, currentGridSize);
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