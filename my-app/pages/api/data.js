import axios from "axios";
import mongoose from "mongoose";
import {
  Bitcoin,
  Ethereum,
  Tether,
  BinanceCoin,
  Solana,
} from "../../Model/stock";

const COINS = [
  { name: 'bitcoin', model: Bitcoin },
  { name: 'tether', model: Tether },
  { name: 'ethereum', model: Ethereum },
  { name: 'binancecoin', model: BinanceCoin },
  { name: 'solana', model: Solana },
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
      console.log(`Data saved for ${coin.name}`);
    });

    await Promise.all(updatePromises);

    return {
      success: true,
      message: "Data updated successfully",
    };
  } catch (error) {
    console.error("Error updating data:", error);
    return { success: false, message: `Error updating data: ${error.message}` };
  }
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
    console.log("Database connected!");

    const updateResult = await updateStockData();

    if (updateResult.success) {
      res.status(200).json({ message: updateResult.message });
    } else {
      res.status(500).json({ message: updateResult.message });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Error fetching data" });
  } finally {
    await mongoose.connection.close();
  }
}
