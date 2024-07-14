import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [stocksData, setStocksData] = useState([]);
  const [selectedModel, setSelectedModel] = useState("Bitcoin");

  const fetchInitialRecords = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/fetchInitialRecords?stock=${selectedModel}`
      );
      const records = response?.data?.message;
      setStocksData(records);
    } catch (error) {
      console.error("Error while fetching initial records:", error);
    }
  };

  const fetchLatestRecords = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/fetchLatestRecord?stock=${selectedModel}`
      );
      console.log(`latest ${selectedModel} updated`);
      return response?.data?.message;
    } catch (error) {
      console.error("Error while fetching latest records:", error);
      return null;
    }
  };

  const updateStocksData = (currentData, newRecord) => {
    const updatedData = [newRecord, ...currentData.slice(0, 19)]; 
    return updatedData;
  };

  const handleFetchAndStoreRecords = async () => {
    try {
      const latestRecords = await fetchLatestRecords();
      if (latestRecords) {
        setStocksData(prevData => updateStocksData(prevData, latestRecords));
      }
    } catch (error) {
      console.error("Error handling fetch and store:", error);
    }
  };

  useEffect(() => {
    fetchInitialRecords(); 
    handleFetchAndStoreRecords();
  
    const interval = setInterval(() => {
      handleFetchAndStoreRecords(); 
    }, 1000);
  
    return () => clearInterval(interval); 
  }, [selectedModel]);
  

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-3xl font-bold mb-4">Cryptocurrency Stock Data</h1>
      <div className="w-full max-w-4xl">
        <div className="flex justify-between mb-4 items-center">
          <div className="flex items-center space-x-4">
            <div>
              <span className="font-bold">Name:</span>
              <span className="ml-2">{selectedModel}</span>
            </div>
            <div>
              <span className="font-bold">Symbol:</span>
              <span className="ml-2">{stocksData[0]?.symbol || ""}</span>
            </div>
          </div>
          <select
            className="p-2 border border-gray-300 rounded"
            onChange={handleModelChange}
            value={selectedModel}
          >
            <option value="Bitcoin">Bitcoin</option>
            <option value="Ethereum">Ethereum</option>
            <option value="Tether">Tether</option>
            <option value="BinanceCoin">Binance Coin</option>
            <option value="Solana">Solana</option>
          </select>
        </div>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Current Price</th>
              <th className="border border-gray-300 p-2">Market Cap</th>
              <th className="border border-gray-300 p-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {stocksData && stocksData.length > 0 ? (
              stocksData.map((stock, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{`$${stock.current_price}`}</td>
                  <td className="border border-gray-300 p-2">{`$${stock.market_cap}`}</td>
                  <td className="border border-gray-300 p-2">
                    {new Date(stock.createdAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="border border-gray-300 p-2 text-center"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export async function getServerSideProps() {
  try {
    await axios.get('http://localhost:3000/api/data');
  } catch (error) {
    console.log('Error in setting data');
  }
  return {
    props: {
      userData: null,
    },
  };
}


export default Dashboard;
