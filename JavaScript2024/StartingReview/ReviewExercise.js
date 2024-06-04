const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function doTheThing(array) {
    const evens = array.filter(number => number % 2 === 0);
    console.log(evens)
    const sum = evens.reduce((acc, curr) => {
        return acc + curr;
    }, 0)
    console.log(sum)
}
doTheThing(numbers)

const tristan = ["Tristan", "Norman", "Living", "Coping", "Surviving"];

function printSkills(array) {
    const [firstName, lastName, ...skills] = array;

    console.log("Name: ", firstName, lastName)
    console.log("\nSkills: ");
    skills.forEach(skill => {
        console.log(skill);
    })
}

printSkills(tristan)

values =  ["hello", "there", "how", "are", "you"];

function question3(array) {
    const [var1, var2, ...wordArray] = array;

    console.log("\nThe 2 First words", var1, var2)
    console.log("\nThe last 3 that are in an array:", wordArray);
}

question3(values)

array1 = [1, 2, 3, 4, 5, 6]
array2 = [7, 8, 9, 10, 11, 12, 13, 14, 15]

const newArray = [...array1, ...array2];

console.log(newArray)

const finalArray = [222,55,5636,76,47,457,34];

const minusTen = finalArray.map(number => number - 10)

console.log(minusTen)