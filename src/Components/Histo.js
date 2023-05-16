import React, { useState } from 'react';
import { VictoryPie, VictoryTooltip } from 'victory';
import "./Histo.css"

const SubmitButton = ({ handleButtonClick, isLoading }) => (
  <button type="button" onClick={handleButtonClick} disabled={isLoading}>
    {isLoading ? 'Loading...' : 'Submit'}
  </button>
);

const App = () => {
  // Initialize state
  const [wordFrequency, setWordFrequency] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data and update state on button click
  const handleButtonClick = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('https://www.terriblytinytales.com/test.txt');
      const data = await response.text();
      const words = data.split(/\s+/);
      const frequency = words.reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {});
      setWordFrequency(frequency);

      // Slide out submit button
      const submit = document.getElementById("submit");
      submit.style.left="49vw";
      submit.style.animationName="slideOut";
    } catch (error) {
      console.error('Error:', error);
    }

    setIsLoading(false);
  };

  // Generate CSV and download on export button click
  const handleExportClick = () => {
    const csvData = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word, frequency]) => `${word},${frequency}`);

    csvData.unshift("Word, Frequency");
    const csvContent = csvData.join('\n');
    const element = document.createElement('a');
    const file = new Blob([csvContent], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = 'frequency.csv';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Generate pie chart data and render chart
  const pieData = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, frequency]) => ({ x: word, y: frequency }));

  return (
    <>
      {!pieData.length && <SubmitButton handleButtonClick={handleButtonClick} isLoading={isLoading} />}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {pieData.length > 0 && (
          <div className='container'>
            <h2>Word Frequency Pie Chart</h2>
            <VictoryPie
              data={pieData}
              colorScale={['#003f5c', '#2f4b7c', '#665191', '#a05195', '#d45087', '#f95d6a', '#ff7c43', '#ffa600']}
              labelComponent={<VictoryTooltip />}
              labels={({ datum }) => `${datum.x}: ${datum.y}`}
            />
            <button type="button" onClick={handleExportClick}>
              Export
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
