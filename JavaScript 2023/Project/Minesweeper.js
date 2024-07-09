/**
 * Represents a Minesweeper game.
 * @class
 */
class MinesweeperGame {
    /**
  * Creates an instance of MinesweeperGame.
  * @constructor
  */
    constructor() {
        /**
         * jQuery objects representing the game board, difficulty select element, 
         * revealed tile count display, and timer display.
         * 
         * initializes the timer interval, Counter variable for the number of revealed cells, 
         * ROWS, and COLUMNS
         * 
         */
        this.board = $("#board");
        this.diff = $('#difficulty');
        this.counter = $('#count');
        this.timerElement = $("#timer");
        this.timerInterval = null;
        this.count = 0;
        this.ROWS = 9;
        this.COLUMNS = 9;

        // Mapping the difficulty level to the number of bombs per level
        this.difficultyBombs = {
            beginner: 10,
            intermediate: 40,
            expert: 99
        };

        //Initializes the game
        this.initialize();
    }

    /**
     * Initalizes the Minesweeper game.
     * @private
     */
    initialize() {
        /**
         * Starts the games timer, sets the difficulty to 'beginner' on initial load, 
         * Creates the game board with default dimensions and difficulty, and sets up event listeners for user interactions 
         */
        this.timer();
        this.diff.addClass('beginner');
        this.createBoard(this.ROWS, this.COLUMNS, 'beginner');
        this.setupEventListeners();

    }

    /**
     * Initializes and starts the game timer.
     * @private
     */
    timer() {
        // Clear any existing timer interval and initialize seconds counter
        clearInterval(this.timerInterval);
        let sec = 0;

        // Function to update timer display using the current seconds
        const updateTimer = () => {
            this.timerElement.val(sec);
            sec++;
        };

        /**
         * Call updateTimer immediately to set the initial value
         * and set up a new timer interval to update the timer every second
         */
        updateTimer();
        this.timerInterval = setInterval(updateTimer, 1000);
    }

    /**
    * Creates and initializes the Minesweeper game board based on the specified parameters.
    *
    * @param {int} rows - The number of rows in the game board.
    * @param {int} columns - The number of columns in the game board.
    * @param {string} difficulty - The difficulty level, which determines the number of bombs.
    *                              Should be one of 'beginner', 'intermediate', or 'expert'.
    */
    createBoard(rows, columns, difficulty) {
        /**
        * Clears the current game board.
        * @private
        */
        this.board.empty();
        /**
         * Declares the number of bombs based on difficulty level, calculates the total number of blocks 
         * in the game board and declares an empty array to store bomb locations
         */
        const numBombs = this.difficultyBombs[difficulty];
        const totalBlocks = rows * columns;
        const bombLocations = [];

        // Randomly selects bomb locations
        while (bombLocations.length < numBombs) {
            const randomLocation = Math.floor(Math.random() * totalBlocks);
            if (!bombLocations.includes(randomLocation)) {
                bombLocations.push(randomLocation);
            }
        }

        // Create the game board using the declared rows and columns
        for (let i = 0; i < rows; i++) {
            const row = $('<div>').addClass('row');
            for (let j = 0; j < columns; j++) {
                /**
                * Create a column element and set its initial class and data attributes,
                * then calculates the cell index within the game board
                */
                const column = $('<div>').addClass('column hidden').attr('data-row', i).attr('data-column', j);
                const cellIndex = i * columns + j;
                // Check for if the current cell should contain a bomb and adds the 'bomb' class to it
                if (bombLocations.includes(cellIndex)) {
                    column.addClass('bomb');
                }
                row.append(column);
            }
            this.board.append(row);
        }
    }

    /**
    * Adjusts the size of the Minesweeper game board based on the selected difficulty level.
    * Clears the current game board, updates the difficulty class, and creates a new board.
    *
    * @private
    */
    sizeFinder() {
        clearInterval(this.timerInterval);
        this.timer();

        // Retrieves the selected difficulty from the dropdown
        const selectedDifficulty = this.diff.val();

        // Removes existing difficulty classes
        this.diff.removeClass('beginner intermediate expert');

        // Adjusts the size of the game board based on the selected difficulty
        if (selectedDifficulty === 'beginner') {
            this.ROWS = 9;
            this.COLUMNS = 9;
            this.diff.addClass('beginner');
        } else if (selectedDifficulty === 'intermediate') {
            this.ROWS = 16;
            this.COLUMNS = 16;
            this.diff.addClass('intermediate');
        } else {
            this.ROWS = 20;
            this.COLUMNS = 24;
            this.diff.addClass('expert');
        }

        // Creates a new game board with the updated size and difficulty
        this.createBoard(this.ROWS, this.COLUMNS, selectedDifficulty);
    }

    /**
    * Resets the Minesweeper game by creating a new game board based on the current difficulty level.
    *
    * @private
    */
    reset() {
        this.createBoard(this.ROWS, this.COLUMNS, this.diff.val());
    }

    /**
    * Handles the conclusion of the Minesweeper game, presenting a message based on the game's outcome.
    * Reveals all bomb cells on the board, resets the game statistics, clears the timer, and initiates a new game after a brief delay.
    *
    * @private
    * @param {boolean} state - The game state. `true` indicates a win, and `false` indicates a loss.
    */
    gameOver(state) {
        /// Reset count, set counter to 0, clear the timer, and reset it.
        const countAlert = this.count;
        const timerAlert = this.timerElement.val();
        this.count = 0;
        this.counter.val(this.count);
        clearInterval(this.timerInterval);
        this.timer();

        // Determine the message and image based on the game state.
        let msg = state ? `✨ WINNER! ✨ \n Score = ${countAlert} \n Time = ${timerAlert} seconds` : '💣 LOSER! 💣';
        let img = state ? '☢️' : '💣';

        /**
        * Reveals and styles bomb cells on the Minesweeper game board based on the game outcome.
        * This function iterates through each bomb cell, removes the 'hidden' class, sets the background color to '#eee',
        * and updates the content of the cell to display an indicator based on the game state or the '🚩' flag based on the cell's state.
        */
        $('.column.bomb').each((index, element) => {
            const bombCell = $(element);
            bombCell.removeClass('hidden');
            bombCell.css("background-color", "#eee");
            if (bombCell.hasClass('flag')) {
                bombCell.removeClass('flag');
                bombCell.empty().append($('<b>').text('🚩'));
            } else {
                bombCell.empty().append($('<b>').text(img));
            }
        });

        // Display the game outcome message and initiate a new game after a brief delay.
        setTimeout(() => {
            alert(msg);
            this.reset();
        }, 500);
    }

    /**
    * Reveals and updates the styling of adjacent empty spaces on the Minesweeper game board.
    * This recursive function starts at the specified row and column position, revealing the current block
    * and updating its appearance based on the number of adjacent bomb cells. If the current block is empty,
    * the function recursively reveals adjacent empty blocks until it encounters blocks with adjacent bombs.
    *
    * @private
    * @param {number} rowPlace - The row index of the starting block.
    * @param {number} columnPlace - The column index of the starting block.
    */
    revealSpaces(rowPlace, columnPlace) {
        // Dictionary to keep track of visited positions.
        const checked = {};

        const placement = (i, j) => {
            // Check if the position is within the board boundaries.
            if (i >= this.ROWS || j >= this.COLUMNS || i < 0 || j < 0) return;
            const here = `${i} ${j}`;
            // If the position has already been visited, return.
            if (checked[here]) return;
            // Get the jQuery object for the current block.
            const block = $(`.column.hidden[data-row=${i}][data-column=${j}]`);
            // Get the count of bomb cells adjacent to the current block.
            const bombCount = this.getBombCount(i, j);

            // If the block is not hidden or is a bomb, return.
            if (!block.hasClass('hidden') || block.hasClass('bomb')) {
                return;
            }

            // Reveal the block and update its styling.
            block.removeClass('hidden');
            block.css("background-color", "#eee");

            // If the block has adjacent bombs, display the bomb count.
            if (bombCount > 0) {
                block.text(bombCount);
            }

            // Increment the revealed tile count and update the counter.
            this.count++;
            this.counter.val(this.count);

            // If the block has adjacent bombs, return.
            if (bombCount > 0) {
                return;
            }

            // Explore adjacent blocks recursively.
            for (let i2 = -1; i2 <= 1; i2++) {
                for (let j2 = -1; j2 <= 1; j2++) {
                    placement(i + i2, j + j2);
                }
            }
        };

        // Start the recursive placement from the specified row and column.
        placement(rowPlace, columnPlace);
    }

    /**
    * Calculates the number of bomb cells adjacent to the specified position on the Minesweeper game board.
    *
    * @private
    * @param {number} i - The row index of the target block.
    * @param {number} j - The column index of the target block.
    * @returns {number} - The count of bomb cells adjacent to the target block.
    */
    getBombCount(i, j) {
        let count = 0;
        
        // Iterate over the neighboring positions.
        for (let i2 = -1; i2 <= 1; i2++) {
            for (let j2 = -1; j2 <= 1; j2++) {
                const neighborI = i + i2;
                const neighborJ = j + j2;

                // Check if the neighboring position is within the board boundaries.
                if (
                    neighborI >= this.ROWS ||
                    neighborJ >= this.COLUMNS ||
                    neighborI < 0 ||
                    neighborJ < 0
                )
                    continue;

                // Get the jQuery object for the neighboring block.
                const block = $(
                    `.column.hidden[data-row=${neighborI}][data-column=${neighborJ}]`
                );

                // If the neighboring block is a bomb, increment the count.
                if (block.hasClass('bomb')) count++;
            }
        }
        return count;
    }

    /**
    * Sets up event listeners for user interactions in the Minesweeper game, such as left-clicks and right-clicks on game cells,
    * difficulty level changes, and timer initiation.
    *
    * @private
    */
    setupEventListeners() {
        // Right-click and flag, or unflag, hidden cells.
        this.board.on('contextmenu', '.column.hidden', (e) => {
            e.preventDefault();

            const block = $(e.target);
            const isFlagged = block.hasClass('flag');

            if (!isFlagged) {
                block.addClass('flag');
            } else {
                block.removeClass('flag');
            }

            return false;
        });

        // Left-click to reveal cells and handle game state.
        this.board.on('click', '.column.hidden', (e) => {
            const block = $(e.target);
            const row = block.data('row');
            const column = block.data('column');
            
            // Right-click toggles flag status.
            if (e.which == 3) {
                block.toggleClass('flag');
            } else if (block.hasClass('bomb')) {
                // Game over on left-click if the cell contains a bomb.
                this.gameOver(false);
            } else {
                // Reveal spaces on left-click and check for game completion.
                this.revealSpaces(row, column);
                const gameState =
                    $('.column.hidden').length == $('.column.bomb').length;
                if (gameState) {
                    this.gameOver(true);
                }
            }
        });

        // Change in difficulty level triggers a size update.
        this.diff.on('change', () => this.sizeFinder());

        // Initialize the timer and reset the game.
        this.timer();
        this.reset();
    }
}

/**
 * Instantiates a new MinesweeperGame, initializing the game board, difficulty level, timer, and event listeners.
 */
const minesweeperGame = new MinesweeperGame();