const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const testData = require('./TestData.json');

const wordsList = testData.wordList;
const scoresList = testData.scoresList;

// Endpoint to get a random set of words
app.get('/words', (req, res) => {
  const randomWords = getRandomWords(10);
  res.json(randomWords);
});

// Endpoint to calculate the rank based on the final score
app.post('/rank', (req, res) => {
  const finalScore = req.body.score;
  const rank = calculateRank(finalScore);
  res.json({ rank });
});

// Function to get a random set of words
function getRandomWords(numWords) {
  const randomIndices = getRandomIndices(wordsList.length, numWords);
  const randomWords = randomIndices.map((index) => wordsList[index]);
  return randomWords;
}

// Function to generate random indices
function getRandomIndices(maxIndex, numIndices) {
  const indices = new Set();
  while (indices.size < numIndices) {
    const randomIndex = Math.floor(Math.random() * maxIndex);
    indices.add(randomIndex);
  }
  return Array.from(indices);
}


// Function to calculate the rank based on the final score
function calculateRank(finalScore) {
  const numScoresBelow = scoresList.filter((score) => score < finalScore).length;
  const rank = ((numScoresBelow / scoresList.length) * 100).toFixed(2);
  return rank;
}

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});