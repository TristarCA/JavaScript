const $ = selector => document.querySelector(selector);
let root = $("#buttonDiv");
let diff = $("#difficulty");
var count = 0;
document.getElementById("count").value = count;

bArray = new Array(81).fill(0);
bArray.fill(1, 71);

iArray = new Array(256).fill(0);
iArray.fill(1, 216);

eArray = new Array(480).fill(0);
eArray.fill(1, 381)

/** This will reverse the array and begin counting from the end. It will then select a number from 0-n(length of list) and swap each data point randomly throughout the array */

let timerInterval;
function timer() {
    let sec = 0;
    const timerElement = document.getElementById("timer");

    const updateTimer = () => {
        timerElement.value = `${sec}`;
        sec++;
    };

    updateTimer();

    timerInterval = setInterval(updateTimer, 1000);
}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const bombCheck = (array, neighbor, bombCount) => {
    if (array[neighbor] == 1) {
        bombCount+=1
    } else {
        const neighborButton = document.querySelector(`[name="${neighbor}"]`);
        if (isNaN(parseInt(neighborButton.innerText))) {
            neighborButton.innerText = "N"
           // bombCheck(neighborButton, array, bombCount=0)
        }
        
    }
    return bombCount
}

const clearNeighbors = (neighbor) => {
    const neighborButton = document.querySelector(`[name="${neighbor}"]`);
    neighborButton.style.backgroundColor= "brown";
}

const arrayArray = [bArray, iArray, eArray];
arrayArray.forEach(shuffleArray);


document.addEventListener("DOMContentLoaded", () => {
    const createGrid = (level, rows, columns, array) => {
        let index = 0;
        root.style.gridTemplateColumns = `repeat(${columns}, 35px)`;
        for (let j = 1; j <= rows; j++) {
            for (let k = 1; k <= columns; k++) {
                const node = document.createElement("button");
                node.value = array[index];
                node.name = index;
                if ((j + k) % 2 == 0) {
                    node.style.backgroundColor = 'bisque'
                }
                else {
                    node.style.backgroundColor = 'darkseagreen'
                }

                let color = "";
                const mouseOverHandler = (evt) => {
                    color = evt.target.style.backgroundColor;
                    evt.target.style.backgroundColor = "purple";
                };

                const mouseOutHandler = (evt) => {
                    evt.target.style.backgroundColor = color;
                };

                const clickHandler = (evt) => {
                    const button = evt.target;
                    button.removeEventListener("click", clickHandler);
                    count += 1;
                    document.getElementById("count").value = count;
                
                    button.style.backgroundColor = "brown";
                    button.innerText = node.value;
                    button.removeEventListener("mouseout", mouseOutHandler);
                    button.removeEventListener("mouseover", mouseOverHandler);
                
                    if (node.value == 1) {
                        const buttons = document.querySelectorAll("button");
                        buttons.forEach((btn) => {
                            btn.disabled = true;
                            btn.removeEventListener("mouseout", mouseOutHandler);
                            btn.removeEventListener("mouseover", mouseOverHandler);
                            clearInterval(timerInterval);
                        });
                    } else {
                        let bombCount = 0;
                        let name = parseInt(node.name);
                        let neighbors = [];
                
                        if (level == 1) {
                            neighbors = [name - 1, name + 1, name - 8, name - 9, name - 10, name + 8, name + 9, name + 10];
                        } else if (level == 2) {
                            neighbors = [name - 1, name + 1, name - 15, name - 16, name - 17, name + 15, name + 16, name + 17];
                        } else if (level == 3) {
                            neighbors = [name - 1, name + 1, name - 23, name - 24, name - 25, name + 23, name + 24, name + 25];
                        }
                
                        for (const neighbor of neighbors) {
                            bombCount = bombCheck(array, neighbor, bombCount);
                        }
                
                        if (bombCount > 0) {
                            button.style.color = 'black';
                            button.innerText = bombCount;
                        } else if (bombCount == 0) {
                            neighbors.forEach((neighbor) => {
                                const neighborButton = document.querySelector(`[name="${neighbor}"]`);
                                if (!neighborButton.disabled) {
                                    neighborButton.disabled = true;
                                    neighborButton.removeEventListener("mouseout", mouseOutHandler);
                                    neighborButton.removeEventListener("mouseover", mouseOverHandler);
                        
                                    // Clone and replace the button to remove listeners
                                    const clonedButton = neighborButton.cloneNode(true);
                                    neighborButton.parentNode.replaceChild(clonedButton, neighborButton);
                                    clearNeighbors(neighbor);
                                    
                                    clickHandler({ target: clonedButton }); // Recurse on zero-count neighbors
                                }
                            });
                        }
                    }
                };

                node.addEventListener("mouseover", mouseOverHandler);
                node.addEventListener("mouseout", mouseOutHandler);
                node.addEventListener("click", clickHandler);

                root.appendChild(node);
                index++;
            }
            const br = document.createElement("br");
            root.appendChild(br);
        }
    };

    const createBeginnerGrid = () => {
        createGrid(1, 9, 9, bArray);
    }
    const createIntermediateGrid = () => {
        createGrid(2, 16, 16, iArray);
    }
    const createExpertGrid = () => {
        createGrid(3, 20, 24, eArray);
    }

    const sizeFinder = () => {
        clearInterval(timerInterval);
        timer();
        root.innerHTML = "";
        if (diff.value === "beginner") {
            createBeginnerGrid();
        } else if (diff.value === "intermediate") {
            createIntermediateGrid();
        } else {
            createExpertGrid();
        }
    };

    diff.addEventListener("change", sizeFinder);
    createBeginnerGrid();
    timer();
});