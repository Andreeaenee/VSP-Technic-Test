import './App.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import xml2js from 'xml2js';
import LineChart from './components/LineChart';

global.setTimeout = global.setTimeout || (() => {});
global.setInterval = global.setInterval || (() => {});
global.clearTimeout = global.clearTimeout || (() => {});
global.clearInterval = global.clearInterval || (() => {});


function App() {
  const [currencies, setCurrencies] = useState([]);
  const [fiveDays, setFiveDays] = useState([]);
  const [currencieChart, setCurrencieChart] = useState(null);
  const [chartDataToSave, setChartDataToSave] = useState(null);
  const [clickedCurrency, setClickedCurrency] = useState(null);


  const addNewItemFiveDays = (newItem) => {
    setFiveDays((prevState) => [...prevState, newItem]);
  };

  useEffect(() => {
    
    const saveXMLtoLocalhost = async () => {
      const response = await axios.get('http://localhost:3001/nbrfxrates.xml');
      const currentDate = new Date();
      const nameDateFile =
        currentDate.getDate() +'-' + (currentDate.getMonth() + 1) + '-' + currentDate.getFullYear();
      if (!localStorage.getItem(nameDateFile)) localStorage.setItem(nameDateFile, response.data);
    };

    const dataToChart = async () => {
      const currentDate = new Date();
      for (let i = 4; i >= 0; i--) {
        const nameDateFile =
          currentDate.getDate() - i + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getFullYear().toString();
        const tempData = localStorage.getItem(nameDateFile);
        if (tempData)
          xml2js.parseString(tempData, (error, result) => {
            if (error) {
              console.error('Error parsing XML', error);
            } else {
              if (result) {
                const ratesData = result.DataSet.Body[0].Cube[0].Rate.map((rateObj) => {
                  return {
                    currency: rateObj.$.currency,
                    rate: rateObj._,
                    multiplier: rateObj.$.multiplier || 1,
                    date: nameDateFile,
                  };
                });
                setCurrencies(ratesData);
                addNewItemFiveDays(ratesData);
              }
            }
          });
      }
    };

    const fetchData = async () => {
      await saveXMLtoLocalhost();
      await dataToChart();
    };

    fetchData();


    const intervalId = setInterval(saveXMLtoLocalhost, 24 * 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);
  

  useEffect(() => {
    const currencyCache = localStorage.getItem('currency');
    if (currencyCache && currencies.length > 0 && fiveDays.length > 0) {
      handleCurrencySelection(currencyCache);
    }
  }, [currencies, fiveDays]);



  

  function handleCurrencySelection(currency) {
    localStorage.setItem('currency', currency);
    const chartCurrencies = fiveDays.map((dayData) => {
      const currencyData = dayData.find((rate) => rate.currency === currency);
      if (currencyData) {
        return {
          date: currencyData.date,
          rate: currencyData.rate,
        };
      }
      return null;
    }).filter(Boolean);
  
    if (chartCurrencies.length > 0) {
      setCurrencieChart({
        labels: chartCurrencies.map((data) => data.date),
        datasets: [
          {
            label: 'Evolution of currency',
            data: chartCurrencies.map((data) => data.rate),
          },
        ],
      });
  
      setChartDataToSave({
        currency: currency,
        data: chartCurrencies,
      });
    }
    setClickedCurrency(currency);
  }
  

  function SaveChartData(chartData, currency) {
    if (!chartData) {
      console.error('Invalid chart data');
      return;
    }
  
    const currentDate = new Date();
    const nameDateFile = 'Last5DaysChart-' + currency + '-' + currentDate.getDate();
    if (!localStorage.getItem(nameDateFile)) {
      localStorage.setItem(nameDateFile, JSON.stringify(chartData));
    }
    if (currency === clickedCurrency) {
      const button = document.querySelector('.button-clicked');
      if (button) {
        button.classList.add('button-hover');
        button.disabled = true;
      }
    }
  }
  
  


  return (
    <div className="App">
      <h1 className="header">Currency Rates</h1>
      <div className="buttons-div">
        {currencies.map((rate, index) => (
          <button
              className={`button${rate.currency === clickedCurrency ? ' button-clicked' : ''}`}
              onClick={() => handleCurrencySelection(rate.currency)} key={index}>
            {`${rate.currency}`}
          </button>
        ))}
      </div>
      {currencieChart ? (
        <div className="chart-div">
          <LineChart chartData={currencieChart} />
          <button className="save-xml-button" onClick={() => SaveChartData(currencieChart, chartDataToSave.currency)}>Save The Chart Data</button>
        </div>
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
}

export default App;
