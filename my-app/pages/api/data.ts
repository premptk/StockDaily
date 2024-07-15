import axios from "axios";
import logger from './logger';
import {
  Bitcoin,
  Ethereum,
  Tether,
  BinanceCoin,
  Solana,
} from "../../Model/schema";
import connectDB from "../database/connectDb";
import { Request, Response } from "express";

interface Coin {
  name: string;
  model: any;
}

const COINS: Coin[] = [
  { name: "bitcoin", model: Bitcoin },
  { name: "tether", model: Tether },
  { name: "ethereum", model: Ethereum },
  { name: "binancecoin", model: BinanceCoin },
  { name: "solana", model: Solana },
];

// Function to update each stock data
const updateStockData = async (): Promise<{ success: boolean, message: string }> => {
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
  } catch (error: any) {
    logger.error("Error updating data:", error);
    return { success: false, message: `Error updating data: ${error.message}` };
  }
};

const startInterval = (): void => {
  setInterval(async () => {
    const updateResult = await updateStockData();
    if (updateResult.success) {
      logger.info(`Updated all stocks data at ${new Date().toISOString()}`);
    } else {
      logger.info('Issue while updating stocks');
    }
  }, 2000);
};

export default async function handler(req: Request, res: Response): Promise<void> {
  try {
    await connectDB();
    startInterval();
    res.status(200).json({ message: 'Database connected and started interval for updating stocks' });
  } catch (error) {
    logger.error("Error connecting to database or fetching data: ", error);
    res.status(500).json({ message: "Error fetching data" });
  }
}
