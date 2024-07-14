import logger from "../api/logger";
import {
  Bitcoin,
  Ethereum,
  Tether,
  BinanceCoin,
  Solana,
} from "../../Model/schema";
import connectDB from "../database/connectDb";
import { URL } from 'url';

const modelMapping = {
  bitcoin: Bitcoin,
  ethereum: Ethereum,
  tether: Tether,
  binancecoin: BinanceCoin,
  solana: Solana,
};

const fetchInitialRecords = async (model) => {
  try {
    const records = await model.find().sort({ createdAt: -1 }).limit(20);
    return records;
  } catch (error) {
    logger.error("Error fetching initial records: ", error);
    throw new Error('Database query failed');
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
    // Ensure the database connection is established
    await connectDB();

    // Extract model name from request
    const modelName = getModelNameFromRequest(req);

    // Get the corresponding model
    const model = modelMapping[modelName];
    if (!model) {
      return res.status(400).json({ message: `Model "${modelName}" not found` });
    }

    // Fetch initial records
    const responseData = await fetchInitialRecords(model);

    // Send response
    return res.status(200).json({ message: responseData });
  } catch (error) {
    logger.error("Error starting updates: ", error);
    return res.status(500).json({ message: error.message });
  }
}