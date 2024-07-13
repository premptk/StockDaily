import axios from "axios";
import mongoose from "mongoose";
import logger from '../api/logger';
import {
  Bitcoin,
  Ethereum,
  Tether,
  BinanceCoin,
  Solana,
} from "../../Model/stock";

const COINS = [
  { name: "bitcoin", model: Bitcoin },
  { name: "tether", model: Tether },
  { name: "ethereum", model: Ethereum },
  { name: "binancecoin", model: BinanceCoin },
  { name: "solana", model: Solana },
];

// Function to update each stock data
const updateStockData = async () => {
  try {
    const updatePromises = COINS.map(async (coin) => {
      const api = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin.name}&x_cg_demo_api_key=CG-SPx7QiFVpbpMxYY8NyUeQT39`;
      const response = await axios.get(api);
      const data = response.data[0];

      const { name, symbol, image, current_price, market_cap } = data;
      const stockData = new coin.model({
        name,
        symbol,
        image,
        current_price,
        market_cap,
      });

      await stockData.save();
      logger.info(`Data saved for ${coin.name}`);
    });

    await Promise.all(updatePromises);

    return {
      success: true,
      message: "Data updated successfully",
    };
  } catch (error) {
    logger.error("Error updating data:", error);
    return { success: false, message: `Error updating data: ${error.message}` };
  }
};

const startInterval = () => {
  setInterval(async () => {
    const updateResult = await updateStockData();
    if (updateResult.success) {
        logger.info(`updated all stocks data at ${new Date().toISOString()}`);
      } else {
        logger.info('Issue while updating stocks');
      }
  }, 2000);
};

export default async function handler(req, res) {
  try {
    const DATABASE_URL = "mongodb://localhost:27017/DailyStocks";

    if (!DATABASE_URL) {
      throw new Error(
        "Please define the DATABASE_URL environment variable inside .env.local"
      );
    }

    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Database connected!");

    startInterval();
    res.status(200).json({message: 'Database connected and started interval for updating stocks'});
  } catch (error) {
    logger.error("Error connecting to database or fetching data: ", error);
    res.status(500).json({ message: "Error fetching data" });
  }
}