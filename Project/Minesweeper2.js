const board = $("#board");
const diff = $('#difficulty')
let ROWS = 9;
let COLUMNS = 9;
const counter = $('#count')
var count = 0

const difficultyBombs = {
    beginner: 10,
    intermediate: 40,
    expert: 99
}

let timerInterval;
function timer() {
    let sec = 0;
    const timerElement = $("#timer");

    const updateTimer = () => {
        timerElement.val(sec)
        sec++;
    };

    updateTimer();

    timerInterval = setInterval(updateTimer, 1000);
}

function createBoard(rows, columns, difficulty) {
    board.empty();
    const numBombs = difficultyBombs[difficulty];
    const totalBlocks = rows * columns;
    const bombLocations = [];

    while (bombLocations.length < numBombs) {
        const randomLocation = Math.floor(Math.random() * totalBlocks);
        if (!bombLocations.includes(randomLocation)) {
            bombLocations.push(randomLocation);
        }
    }

    for (let i = 0; i < rows; i++) {
        const row = $('<div>').addClass('row');
        for(let j = 0; j < columns; j++) {
            const column = $('<div>').addClass('column hidden').attr('data-row', i).attr('data-column', j);
            const cellIndex = i * columns + j;
            if (bombLocations.includes(cellIndex)) {
                column.addClass('bomb');
            }
            row.append(column);
        }
        board.append(row);
    }
}

const sizeFinder = () => {
    clearInterval(timerInterval);
    timer();
    if (diff.val() == 'beginner') {
        ROWS = 9;
        COLUMNS = 9;
        createBoard(ROWS, COLUMNS, 'beginner');
    } else if (diff.val() == 'intermediate') {
        ROWS = 16;
        COLUMNS = 16;
        createBoard(ROWS, COLUMNS, 'intermediate');
    } else {
        ROWS = 20;
        COLUMNS = 24;
        createBoard(ROWS, COLUMNS, 'expert');
    }
};

createBoard(ROWS, COLUMNS, 'beginner');

function reset() {
    createBoard(ROWS, COLUMNS, diff.val())
}

function gameOver(state) {
    count = 0;
    counter.val(count)
    clearInterval(timerInterval);
    timer(); 
    let msg = '';
    let img = null;
    if (state) {
        msg = 'WINNER! :)';
        img = ':)' 
    } else {
        msg = 'LOSER! :(';
        img = ':('
    }
    $('.column.bomb').append($('<b>').text(img))
    setTimeout(function() {
        alert(msg);
        reset(); 
    }, 2000);
      
}

function revealSpaces(rowPlace, columnPlace) {
    const checked = {};

    function placement(i, j) {
        if (i >= ROWS || j >= COLUMNS || i < 0 || j < 0) return;
            const here = `${i} ${j}`
            if (checked[here]) return;
            const block = $(`.column.hidden[data-row=${i}][data-column=${j}]`);
            const bombCount = getBombCount(i, j);
            if (!block.hasClass('hidden') || block.hasClass('bomb')) {
                return;
            }
            block.removeClass('hidden');
            if (bombCount > 0) {
                block.text(bombCount);
                count++;
                counter.val(count)
                return;
            } else {
                count++;
                counter.val(count);
            }
            for (let i2 = -1; i2 <= 1; i2++) {
                for (let j2 = -1; j2 <= 1; j2++) {
                    placement(i + i2, j + j2);
                }
            }
        }
    placement(rowPlace, columnPlace);
}

function getBombCount(i, j) {
    let count = 0;
    for (let i2 = -1; i2 <= 1; i2++) {
        for (let j2 = -1; j2 <= 1; j2++) {
            const neighborI = i + i2;
            const neighborJ = j + j2;
            if (neighborI >= ROWS || neighborJ >= COLUMNS || neighborI < 0 || neighborJ < 0) continue;
            const block = $(`.column.hidden[data-row=${neighborI}][data-column=${neighborJ}]`);
            if (block.hasClass('bomb')) count++
        }
    }
    return count;
}

board.on('contextmenu', '.column.hidden', function(e) {
    e.preventDefault(); // Prevent the default context menu from appearing

    const block = $(this);
    const isFlagged = block.hasClass('flag');

    if (!isFlagged) {
        block.addClass('flag'); // Add the 'flag' class
    } else {
        block.removeClass('flag'); // Remove the 'flag' class
    }

    return false;
});



board.on('click', '.column.hidden', function(e) {
    const block = ($(this));
    const row = block.data('row');
    const column = block.data('column');
    if (e.which == 3) {
        block.toggleClass('flag');
    } else if (block.hasClass('bomb')) {
        gameOver(false);
    } else {
        revealSpaces(row, column);
        const gameState = $('.column.hidden').length == $('.column.bomb').length;
        if (gameState) {
            gameOver(true);
        }
    }
})

diff.on('change', sizeFinder);

timer();
reset();