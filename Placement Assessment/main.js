const fs = require("fs");

// ---------- STEP 1: READ JSON FILE ----------
function readJson(filename) {
    const data = fs.readFileSync(filename, "utf8");
    return JSON.parse(data);
}

// ---------- STEP 2: DECODE Y VALUES ----------
function decodeValue(base, valueStr) {
    return BigInt(parseInt(valueStr, base));
}

// ---------- STEP 3: LAGRANGE INTERPOLATION (Find constant term C) ----------
function findConstantTerm(points, k) {
    let C = 0n; // constant term

    for (let i = 0; i < k; i++) {
        let xi = points[i].x;
        let yi = points[i].y;

        let num = 1n; // numerator
        let den = 1n; // denominator

        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let xj = points[j].x;

                num *= -xj;             // (0 - xj)
                den *= (xi - xj);       // (xi - xj)
            }
        }

        // yi * num/den
        let term = yi * num / den;
        C += term;
    }

    return C;
}

// ---------- PROCESS ONE TESTCASE ----------
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

    // Sort points by x
    points.sort((a, b) => Number(a.x - b.x));

    // Take first k points only
    const requiredPoints = points.slice(0, k);

    return findConstantTerm(requiredPoints, k);
}

// ---------- RUN BOTH TESTCASES ----------
const testcase1 = readJson("testcase1.json");
const testcase2 = readJson("testcase2.json");

const secret1 = processTestcase(testcase1);
const secret2 = processTestcase(testcase2);

console.log("Secret for Testcase 1 (C):", secret1.toString());
console.log("Secret for Testcase 2 (C):", secret2.toString());
