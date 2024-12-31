test();

function test() {
    //testGridLines();
    testSolve();
}

function testGridLines() {
    
    let grid = [[1,2,3],[4,5,6],[7,8,9],[10,11,12]];
    let gl = gridLine(grid, 0, 2);
    let gl2 = gridLine(grid, 1, 1);
    
    console.log(`${gl()} -- ${gl2()}`);
    grid[2][1] = 55;
    console.log(`${gl()} -- ${gl2()}`);
}

function testSolve() {
    let horHints = [
        [2,2],
        [4,4],
        [1,2,2],
        [5,2,1],
        [1,2,4],
        [4,1,1],
        [1,1,3],
        [5,1],
    ];

    let verHints = [
        [6],
        [2,1,1,1],
        [2,5],
        [5,1],
        [3,1],
        [1],
        [1,5],
        [2,2,1],
        [3,3],
        [3]
    ];

    solveNonogram(horHints, verHints);
}

function solveNonogram(horHints, verHints) {
    let numRows = horHints.length;
    let numCols = verHints.length;
    let grid = getEmptyGrid(numRows, numCols);

    let analysis = getAnalysisStruct(grid, [{hints: horHints, len: numCols}, {hints: verHints, len: numRows}]);
    //console.log('%j', analysis);
    
    findInitialPossibilities(analysis);

    console.log('Initial possibilities!');
    
    let turn = 0;
    let insights = null;
    while(insights == null || insights.length > 0) {
        let dirAnalysis = analysis[turn % 2];
        applyInsights(insights, grid, dirAnalysis);
        insights = getInsights(dirAnalysis);
        // We reduce possibilities according to line in grid
        // We find commonalities
        // If no commonality found for all of them
        //  then we're done solving
        turn++;
    }

    console.log('Done solving!');
    //  And if not all cells found
    //   then puzzle not unique/solvable

}

function applyInsights(insights, grid, analysis) {
    if(insights == null) return;
    /* TODO For each insight (row, col, val)
        Apply change to grid
        You know what, I think we don't even need to do half of it!!
        Analysis[0][row], reduce possibilities where line[col] != val
        Analysis[1][col], reduce possibilities where line[row] != val
     */
}

function getInsights(analysis) {
    console.log('Analyzing');
    let insights = [];
    const numLines = analysis.lines.length;
    for(let i = 0; i < numLines; i++) {
        let line = analysis.lines[i];
        for(let pos of findCommonalities(line)) {
            insights.push({line: i, pos, val: line.possibilities[0][pos] == '1' ? 1 : 2});
        }
    }

    return insights;
}

function findCommonalities(line) {
    if (line.possibilities.length === 0) return [];

    const gridLine = line.get();
    const len = gridLine.length;
    const skipCheck = (line.possibilities.length) === 1;
    const result = [];

    // Iterate through each index
    for (let i = 0; i < len; i++) {
        if (gridLine[i] == 0) {
            if(skipCheck) {
                result.push(i);
            } else {
                const value = line.possibilities[0][i]; // Take the value from the first string
                if (gridLine[i] == 0 && line.possibilities.every(str => str[i] === value)) {
                    result.push(i);
                }
            }
        }
    }

    return result;
}

function getGridLine(grid, direction, index) {
    return function() {
        if (direction == 0) { // Horizontal
            return grid[index];
        } else if (direction == 1) { // Vertical
            return grid.map(row => row[index]);
        }
    };
}

function getAnalysisStruct(grid, params) {
    let analysisStruct = [];
    for(let dir in params) {
        let dirParams = params[dir];
        let obj = {lineLen: dirParams.len, lines: []};
        for(let i = 0; i < dirParams.hints.length; i++) {
            obj.lines.push({index: i, hints: dirParams.hints[i],
                get: getGridLine(grid, dir, i)});
        }
        analysisStruct.push(obj);
    }
    return analysisStruct;
}

function findInitialPossibilities(analysis) {
    for(let dirAnalysis of analysis) {
        for(let line of dirAnalysis.lines) {
            line.possibilities = listLinePossibilities(line.hints, dirAnalysis.lineLen);
        }
    }
}

function findCommonalities2(possibilities, len) {
    if (possibilities.length === 0) return [];
    if (possibilities.length === 1) return [...Array(len).keys()];

    const result = [];

    // Iterate through each index
    for (let i = 0; i < len; i++) {
        const value = possibilities[0][i]; // Take the value from the first string

        // Check if all strings have the same value at this index
        if (possibilities.every(str => str[i] === value)) {
            result.push(i);
        }
    }

    return result;
}

function listLinePossibilities(hints, len) {
    let possibilities = [];

    let sum = hints.reduce((sum, value) => sum + value, 0);
    let numHints = hints.length;
    let numSpacesToPut = len - sum - hints.length + 1;

    for(let permutation of listPossibilities(numHints + 1, numSpacesToPut)) {
        let pos = 0;
        let arr = Array(len).fill(0);
        for(let i = 0; i < numHints; i++) {
            pos += permutation[i];
            for(let j = 0; j < hints[i]; j++) {
                arr[pos + j] = 1;
            }
            pos += hints[i] + 1;
        }
        possibilities.push(arr.join(''));
    }

    return possibilities;
}

function listPossibilities(numSpots, numFillers, current = [], results = []) {
    if(numSpots <= 0)
        return [];

    if(numSpots == 1) {
        results.push([...current, numFillers]);
        return [[numFillers]];
    }
    
    if(numFillers == 0) {
        const arr = Array(numSpots).fill(0);
        results.push(current.concat(arr));
        return [arr];
    }
    
    for (let i = 0; i <= numFillers; i++) {
        listPossibilities(numSpots - 1, numFillers - i, [...current, i], results);
    }
    
    return results;
}



// Takes in a secret code and sizes
// Returns an id
function generateNonogram(numRows, numCols, message) {

}

function getPlayerFromId(id, numRows, numCols) {
    // TODO FROM ID
    // Extract seed
    // Extract numRows
    // Extract numCols
    // Extract encoded

    /*let numRows = 15;
    let numCols = 15;*/

    console.log(`Creating with ${id} - ${numRows} - ${numCols}`);

    const seed = getSeedFromValues(numRows, numCols, id);
    const infos = generateHints(numRows, numCols, seed);

    return {
        numRows: numRows,
        numCols: numCols,
        encoded: 'blah',
        horHints: infos.horHints,
        verHints: infos.verHints
    };
}

function getSeedFromValues(numRows, numCols, code) {
    console.log(`Generating for ${numRows}, ${numCols}, ${code}`)
    let vals = Array.from(code).map(c => {
        if (c >= 'a' && c <= 'z') {
            return c.charCodeAt(0) - 'a'.charCodeAt(0);  // 0-25 for a-z
        } else if (c >= 'A' && c <= 'Z') {
            return c.charCodeAt(0) - 'A'.charCodeAt(0) + 26;  // 26-51 for A-Z
        } else if (c >= '0' && c <= '9') {
            return c.charCodeAt(0) - '0'.charCodeAt(0) + 52;  // 52-61 for 0-9
        } else {
            return 62;  // Any other character gets 62
        }
    });
    vals.push(numRows);
    vals.push(numCols);

    console.log(vals);

    // Convert the values to a single number using bitwise operations
    let hash = 0;

    // Mix the values with shifts and XOR
    for (let i = 0; i < vals.length; i++) {
        hash ^= (vals[i] << (i * 5));  // Shift each value by a different number of bits
    }

    // You can apply further mixing here, such as rotating bits or using more XORs
    hash = (hash ^ (hash >>> 16)) * 0x45d9f3b;
    hash = (hash ^ (hash >>> 16)) * 0x45d9f3b;
    hash = hash ^ (hash >>> 16);

    // Final hash as a 32-bit integer
    hash &= 0xFFFFFFFF;

    console.log(hash);
    
    return hash;
}

// Takes in a seed and sizes
// Returns hints
function generateHints(numRows, numCols, seed) {
    const grid = generateGrid(numRows, numCols, seed);
    let horHints = [];
    let verHints = [];

    for(let row = 0; row < numRows; row++) {
        let hints = [];

        let count = 0;
        for(let col = 0; col <= numCols; col++) {
            if(col == numCols || grid[row][col] != 1) {
                if(count > 0) {
                    hints.push(count);
                    count = 0;
                }
            } else {
                count++;
            }
        }
        horHints.push(hints);
    }

    for(let col = 0; col < numCols; col++) {
        let hints = [];

        let count = 0;
        for(let row = 0; row <= numRows; row++) {
            if(row == numRows || grid[row][col] != 1) {
                if(count > 0) {
                    hints.push(count);
                    count = 0;
                }
            } else {
                count++;
            }
        }
        verHints.push(hints);
    }

    return {horHints, verHints};
}

function generateGrid(numRows, numCols, seed) {
    const rd = Math.seed(seed);

    const ratio = 0.5 + 0.25 * rd(); // 50% to 75%
    const totalCells = numRows * numCols;
    const numOnes = Math.round(totalCells * ratio);
    const numZeros = totalCells - numOnes;

    // Create an array with the appropriate number of 1s and 0s
    const cells = Array(numOnes).fill(1).concat(Array(numZeros).fill(0));

    // Shuffle the array to randomize the placement
    for (let i = cells.length - 1; i > 0; i--) {
        const j = Math.floor(rd() * (i + 1));
        [cells[i], cells[j]] = [cells[j], cells[i]];
    }

    // Convert the shuffled array into a 2D grid
    const grid = [];
    for (let i = 0; i < numRows; i++) {
        grid.push(cells.slice(i * numCols, (i + 1) * numCols));
    }

    displayGrid(grid);

    return grid;
}

// https://stackoverflow.com/a/29450606
Math.seed = function(seed) {
    var mask = 0xffffffff;
    var m_w  = (123456789 + seed) & mask;
    var m_z  = (987654321 - seed) & mask;

    return function() {
      m_z = (36969 * (m_z & 65535) + (m_z >>> 16)) & mask;
      m_w = (18000 * (m_w & 65535) + (m_w >>> 16)) & mask;

      var result = ((m_z << 16) + (m_w & 65535)) >>> 0;
      result /= 4294967296;
      return result;
    }
}

function getEmptyGrid(numRows, numCols) {
    return Array.from({ length: numRows }, () => Array(numCols).fill(0));
}

function displayGrid(grid) {
    const numRows = grid.length;
    const numCols = grid[0].length;
    let str = '';
    for(let row = 0; row < numRows; row++) {
        for(let col = 0; col < numCols; col++) {
            let val = grid[row][col];
            str += val == 0 ? '  ' : val == 1 ? ' X' : ' .';
        }
        str += '\n';
    }
    console.log(str);
}
