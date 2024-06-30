function restStuff(firstName, lastName, ...otherStuff) {
    return otherStuff;
}
console.log(restStuff('Tristan', 'Norman','F','U','C','K'))

function spreadStuff(firstName,lastName,company) {
    return `${firstName} ${lastName} runs ${company}`
}
console.log(spreadStuff(...["Tristan", "Norman", "Java"]))