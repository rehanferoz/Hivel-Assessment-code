const fs = require("fs");
function readJson(filename) {
    const data = fs.readFileSync(filename, "utf8");
    return JSON.parse(data);
}
function decodeValue(base, valueStr) {
    return BigInt(parseInt(valueStr, base));
}
function findConstantTerm(points, k) {
    let C = 0n; 

    for (let i = 0; i < k; i++) {
        let xi = points[i].x;
        let yi = points[i].y;

        let num = 1n; 
        let den = 1n; 

        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let xj = points[j].x;

                num *= -xj;             
                den *= (xi - xj);       
            }
        }

        
        let term = yi * num / den;
        C += term;
    }

    return C;
}


function processTestcase(json) {
    const n = json.keys.n;
    const k = json.keys.k;

    let points = [];

    Object.keys(json).forEach(key => {
        if (key !== "keys") {
            const x = BigInt(key);
            const base = parseInt(json[key].base);
            const value = json[key].value;

            const y = decodeValue(base, value);
            points.push({ x, y });
        }
    });
    points.sort((a, b) => Number(a.x - b.x));
    const requiredPoints = points.slice(0, k);

    return findConstantTerm(requiredPoints, k);
}
const testcase1 = readJson("testcase1.json");
const testcase2 = readJson("testcase2.json");

const secret1 = processTestcase(testcase1);
const secret2 = processTestcase(testcase2);

console.log("Secret for Testcase 1 (C):", secret1.toString());
console.log("Secret for Testcase 2 (C):", secret2.toString());
