import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
 // State variables
 const [words, setWords] = useState([]); // List of words
 const [currentWordIndex, setCurrentWordIndex] = useState(0); // Index of the current word
 const [selectedOption, setSelectedOption] = useState(''); // Selected part of speech option
 const [feedback, setFeedback] = useState(''); // Feedback message for each answer
 const [progress, setProgress] = useState(0); // Progress in percentage
 const [finalScore, setFinalScore] = useState(null); // Final score calculated based on answers
 const [rank, setRank] = useState(null); // Rank percentage obtained

  useEffect(() => {
    // Fetch words when the component mounts
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const response = await axios.get('http://localhost:5000/words');
      setWords(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    checkAnswer(option);
    setProgress((currentWordIndex + 1) / words.length * 100);

    if (currentWordIndex + 1 === words.length) {
      calculateFinalScore();
    } else {
      setCurrentWordIndex(currentWordIndex + 1);
    }
  };

  const checkAnswer = (option) => {
    const currentWord = words[currentWordIndex];
    if (currentWord.pos === option) {
      setFeedback('Correct!');
    } else {
      setFeedback('Incorrect!');
    }
  };

  const calculateFinalScore = () => {
    const correctAnswers = words.filter((word) => word.pos === selectedOption);
    const score = (correctAnswers.length / words.length) * 100;
    setFinalScore(score);

    // Call the rank endpoint to get the rank based on the final score
    axios.post('http://localhost:5000/rank', { score })
      .then((response) => {
        setRank(response.data.rank);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  {/*By calling resetActivity,the application is ready to start a new activity with fresh state values,
     allowing the user to practice again from the beginning */}
  const resetActivity = () => {
    setWords([]);
    setCurrentWordIndex(0);
    setSelectedOption('');
    setFeedback('');
    setProgress(0);
    setFinalScore(null);
    setRank(null);
    fetchWords();
  };

  if (words.length === 0) {
    return <div>Loading...</div>;
  }

  //Rank Screen after Finishing test
  if (finalScore !== null && rank !== null) {
    return (
      <div className="rank-screen">
        <h2>Rank Screen</h2>
        <p>Final Score: {finalScore}%</p>
        <p>Rank: {rank}%</p>
        <button onClick={resetActivity}>Try Again</button>
      </div>
    );
  }

  const currentWord = words[currentWordIndex];

  return (
    <div className="practice-screen">
      <h2>Practice Screen</h2>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="word-container">
        <p className="word">{currentWord.word}</p>
      </div>
      <div className="options-container">
        <button className="option" onClick={() => handleOptionSelect('noun')}>Noun</button>
        <button className="option" onClick={() => handleOptionSelect('verb')}>Verb</button>
        <button className="option" onClick={() => handleOptionSelect('adjective')}>Adjective</button>
        <button className="option" onClick={() => handleOptionSelect('adverb')}>
          Adverb
        </button>
      </div>
      <p className="feedback">{feedback}</p>
    </div>
  );
}

export default App;
    