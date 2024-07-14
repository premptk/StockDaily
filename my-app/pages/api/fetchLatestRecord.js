import logger from "../api/logger";
import {
  Bitcoin,
  Ethereum,
  Tether,
  BinanceCoin,
  Solana,
} from "../../Model/schema";
import connectDB from "../database/connectDb";

const modelMapping = {
  bitcoin: Bitcoin,
  ethereum: Ethereum,
  tether: Tether,
  binancecoin: BinanceCoin,
  solana: Solana,
};

const fetchLatestRecord = async (model) => {
  try {
    const latestRecord = await model.find().sort({ createdAt: -1 }).limit(1);
    return latestRecord[0];
  } catch (error) {
    logger.error("Error fetching latest record: ", error);
    return null;
  }
};

const getModelNameFromRequest = (req) => {
  try {
    const url = new URL('http://example.com' + req.url);
    const searchParams = url.searchParams;
    const modelName = searchParams.get("stock");
    if (!modelName) {
      throw new Error('Missing query parameter: stock');
    }
    return modelName.toLowerCase();
  } catch (error) {
    logger.error('Error processing URL:', error);
    throw new Error('Invalid request URL');
  }
};

export default async function handler(req, res) {
  try {
    // Fetch latest records
    connectDB();

    // Extract model name from request
    const modelName = getModelNameFromRequest(req);

    //  Get the corresponding model
    const model = modelMapping[modelName];
    if (!model) {
      return res.status(400).json({ message: `Model "${modelName}" not found` });
    }

    const latestRecord = await fetchLatestRecord(model);
    res.status(200).json({ message: latestRecord });
  } catch (error) {
    logger.error("Error starting updates: ", error);
    res.status(500).json({ message: "Error starting updates" });
  }
}