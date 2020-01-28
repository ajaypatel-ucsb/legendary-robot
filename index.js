const express = require('express');
const fs = require('fs');
const app = express();

// Config
const PORT = 5000;
const INPUT_FILE = 'input.txt';


// Instructions Object for abstraction
const programInput = {
    dimensions: {
        x: null,
        y: null
    },
    starting: {
        x: null,
        y: null
    },
    current: {
        x: null,
        y: null
    },
    history: [],
    dirt: [],
    instructions: [],
    cleaned: 0
};


// Parse input file
const parseInput = () => {


    console.log("Parsing...");
    new Promise((resolve, reject) => {
        const rawData = fs.readFileSync(INPUT_FILE, 'utf8');
        // Parse each line as string into array
        // dimensions: input[0]
        // position: input[1]
        // dirt: input[2...N - 1]
        // instructions: input[N]
        let dirt = [];
        const lines = rawData.toString().split('\n'); // [ lines ]
        const dimensions = lines[0].split(" ");
        const position = lines[1].split(" ");
        const totalLines = rawData.toString().split('\n').length; // total lines
        let instructionsLine = lines[lines.length -1];
            instructionsLine = instructionsLine.split("");

        if(totalLines <= 3){
            // Do Nothing
        } else {
            // dirt = lines.pop();
            dirt = lines.splice(2);
            let ins = dirt.pop();
        }

        // for each item
        dirt.forEach(function(item){
            let spot = item.split(" ");
            
            programInput.dirt.push({x:parseInt(spot[0]), y:parseInt(spot[1])});
        })



        
        //console.log("Total: ", totalLines);
        //console.log("Instructions: ", instructionsLine);
        //console.log("Lines: ", lines);
        //console.log("Dirt: ", dirt);
        //console.log("dimensions: ", dimensions);
        //console.log("position: ", position);
        //console.log("Dirt Positions: ", programInput.instructions);
        // Error check should be done here to validate dimenstions min max
        programInput.dimensions.x = parseInt(dimensions[0]);
        programInput.dimensions.y = parseInt(dimensions[1]);
        programInput.current.x = programInput.starting.x = parseInt(position[0]);
        programInput.current.y = programInput.starting.y = parseInt(position[1]);
        programInput.instructions = instructionsLine;

        resolve("done!");
    });
};

const moveRobot = (move) => {
    
    // Move based on instructions & calculate final 
    // position (could consider bounds of dimension)
    // N = (0, 1)
    // S = (0, -1)
    // E = (1, 0)
    // W = (-1, 0)
    new Promise((resolve, reject) => {
        let history = programInput.history;
        let { dimesions } = programInput.dimensions;
        let current = {
            x: programInput.current.x,
            y: programInput.current.y
        }

        switch(move) {
            case "N":
                if (programInput.current.y === programInput.dimensions.y){
                    // Do nothing
                } else {
                    programInput.current.y =  programInput.current.y + 1;
                    programInput.history.push({x: programInput.current.x, y: programInput.current.y});
                }
            break;
            case "S":
                if (programInput.current.y === 0){
                    // Do nothing
                } else {
                    programInput.current.y =  programInput.current.y - 1;
                    programInput.history.push({x: programInput.current.x, y: programInput.current.y});
                }
            break;
            case "E":
                if (programInput.current.x === programInput.dimensions.x){
                    // Do nothing
                } else {
                    programInput.current.x =  programInput.current.x + 1;
                    programInput.history.push({x: programInput.current.x, y: programInput.current.y});
                }
            break;
            case "W":
                if (programInput.current.x === 0){
                    // Do nothing
                } else {
                    programInput.current.x =  programInput.current.x - 1;
                    programInput.history.push({x: programInput.current.x, y: programInput.current.y});
                }
            break;
            default:
            // DO NOTHING
        }
      resolve("Done moving");
    });
      
};

const startCleaning = () => {
    console.log("Cleaning...")
    // For each letter in instructions send to move robot
    new Promise((resolve, reject) => {
        programInput.instructions.forEach(function(move){
            moveRobot(move);
        });
        resolve("Done cleaning!");
    });

};

const checkClean = () => {
    // Return count of history matches dirt
    // For each item in dirt array
    // check each spot x, y against each item in history array
    // when done with dirt -
    //console.log('dirt list: ', programInput.dirt);
    new Promise((resolve, reject) => {

        programInput.dirt.forEach(function(spot){
            //console.log("Check spot: ", spot);
            programInput.history.forEach(function(move){
                // check obj
                //console.log("Check move: ", move);
                if (spot.x == move.x && spot.y == move.y){
                    programInput.cleaned = programInput.cleaned + 1;
                };
            });
        });
        resolve("Done checking!");
    });
};

const runRobot = async () => {
    console.log('Started...');
    const parse = await parseInput();
    const clean = await startCleaning();
    const total = await checkClean();
    //console.log("Ajay Hoover history: ", programInput.history);
    console.log("Ajay Hoover Current: ", programInput.history.pop());
    console.log("Total Spots Cleaned: ", programInput.cleaned);
}


setTimeout(function(){
    runRobot();
}, 6000);

app.listen(PORT, function(){
    console.log('Ajay Hoover App Running on port:', PORT);
    console.log("Starting Robot...");
});


