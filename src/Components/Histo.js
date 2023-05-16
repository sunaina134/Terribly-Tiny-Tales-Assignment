import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import "./Histo.css"

const App = () => {
  const [wordFrequency, setWordFrequency] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonClick = () => {
    setIsLoading(true);
    fetch('https://www.terriblytinytales.com/test.txt')
      .then(response => response.text())
      .then(data => {
        const words = data.split(/\s+/);
        const frequency = words.reduce((acc, word) => {
          acc[word] = (acc[word] || 0) + 1;
          return acc;
        }, {});
        setWordFrequency(frequency);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setIsLoading(false);
      });
  };

  const handleExportClick = () => {
    let csvContent = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word, frequency]) => `${word},${frequency}`)
    csvContent.unshift("Word, Frequency")
    csvContent = csvContent.join('\n');

    const element = document.createElement('a');
    const file = new Blob([csvContent], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = 'frequency.csv';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const colors = ['#E57373', '#F06292', '#BA68C8', '#9575CD', '#7986CB', '#64B5F6', '#4FC3F7', '#4DD0E1', '#4DB6AC', '#81C784', '#AED581', '#DCE775', '#FFB74D', '#FF8A65', '#A1887F', '#E0E0E0', '#90A4AE'];




  const histogramData = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, frequency], index) => ({ word, frequency, fill: colors[index % colors.length] }));

  return (
    <div className='container'>
      <h2>Word Frequency Histogram</h2>
      <button type="button" onClick={handleButtonClick} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Submit'}
      </button>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {histogramData.length > 0 && (
          <BarChart width={800} height={470} data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="word" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="frequency" name="Frequency" />
          </BarChart>
        )}
      </div>
      {histogramData.length > 0 && (
        <button type="button" onClick={handleExportClick}>
          Export
        </button>
      )}
    </div>
  );
};



export default App;
