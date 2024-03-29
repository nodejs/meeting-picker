#!/usr/bin/env node
import fs from 'node:fs';
const LENGTH = 3;
const NUM_RESULTS = 5;
const dataFile = process.argv[2];
const raw = fs.readFileSync(dataFile, 'utf-8');
analyze(raw);
function analyze(raw) {
    function split(string, delim) {
        return string.split(delim)
            .map(x => x)
            .filter(x => x);
    }
    const timeScores = split(raw, '\n').map(x => split(x, '\t').map(x => +x));
    // Should be 24 for one day, 48 for two days, etc.
    // TODO: Add a check that all entries in timeScores are the same length and
    // that each score is a number between 0 and 5 inclusive.
    const scoresLength = timeScores[0].length;
    // Normalize scores. If someone didn't include any fives, then they will cause
    // the selection of lower-scored times for everyone else so that the scores are
    // equitable. So bump up all scores for anyone who did not include any fives
    // until they have a five.
    let data = timeScores.map((scores) => {
        while (!scores.includes(5)) {
            scores = scores.map((score) => score + 1);
        }
        return scores;
    });
    // Ignore times that do not work (score of 0 or 1) for more than 60% of
    // attendees. This avoids the selection of equitably terrible times.
    const indexesToIgnore = [];
    for (let i = 0; i < scoresLength; i++) {
        const count = data.filter((individualTimePrefs) => {
            return individualTimePrefs[i] > 1;
        }).length;
        if (count <= data.length * 0.6) {
            indexesToIgnore.push(i);
        }
    }
    let START = 0;
    while (indexesToIgnore.includes(START)) {
        START++;
    }
    // Because our 0-5 scoring maps to percentages that don't increase linearly,
    // let's convert to the percentages.
    const scoreLegend = [0, 0.25, 0.5, 0.8, 0.9, 1];
    data = data.map((scoresForOnePerson) => {
        return scoresForOnePerson.map((value) => {
            return scoreLegend[value];
        });
    });
    function sum(arr) {
        return arr.reduce((a, b) => a + b, 0);
    }
    ;
    const allResults = [];
    generateCombinations(START, []);
    allResults.sort((a, b) => a.standardDeviation - b.standardDeviation);
    allResults.slice(0, NUM_RESULTS).forEach((value) => console.log(value));
    function generateCombinations(start, rv) {
        rv = rv.slice();
        if (rv.length === LENGTH) {
            // Get the scores for all times.
            const rawScores = rv.map((time) => data.map((value) => value[time]));
            // Get the sum of the scores for each individual
            const scores = data.map(function (_, i) {
                return sum(rawScores.map((row) => { return row[i]; }));
            });
            // Calculate the standard deviation of the total scores
            const standardDeviation = stdev(scores);
            allResults.unshift({
                times: rv,
                standardDeviation // lower == more equitable
                // scores: scores
            });
            return;
        }
        if (start < scoresLength) {
            let next = start + 1;
            while (indexesToIgnore.includes(next)) {
                next = next + 1;
            }
            generateCombinations(next, rv);
            rv.push(start);
            generateCombinations(next, rv);
        }
    }
}
// Modeled on MIT-licensed code at
// https://github.com/compute-io/stdev/blob/884cf986d1f1b556fb67fda692d09ebbd9570bd8/lib/index.js
function stdev(arr) {
    const len = arr.length;
    let N = 0;
    let mean = 0;
    let M2 = 0;
    let delta = 0;
    for (let i = 0; i < len; i++) {
        N += 1;
        delta = arr[i] - mean;
        mean += delta / N;
        M2 += delta * (arr[i] - mean);
    }
    return Math.sqrt(M2 / (N - 1));
}
