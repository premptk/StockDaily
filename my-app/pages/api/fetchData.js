
import logger from "../api/logger";
import {
  Bitcoin,
  Ethereum,
  Tether,
  BinanceCoin,
  Solana,
} from "../../Model/schema";
import connectDB from "../database/connectDb";

let responseData = [];

const fetchInitialRecords = async (model) => {
  try {
    const records = await model.find().sort({ createdAt: -1 }).limit(20);
    return records;
  } catch (error) {
    logger.error("Error fetching initial records: ", error);
    return [];
  }
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

const startRealTimeUpdates = (model) => {
  setInterval(async () => {
    const latestRecord = await fetchLatestRecord(model);
    if (latestRecord) {
      responseData.unshift(latestRecord); 
      if (responseData.length > 20) {
        responseData.pop(); 
      }
      logger.info(
        `Fetched latest record at ${new Date().toISOString()}`
      );
      logger.info(`Current responseData: ${JSON.stringify(responseData[0])}`);
    }
  }, 1000); 
};

export default async function handler(req, res) {
  try {
    connectDB();
    // Fetch initial records
    responseData = await fetchInitialRecords(Bitcoin);
    logger.info("Fetched initial records");

    // Start real-time updates
    startRealTimeUpdates(Bitcoin);
    res.status(200).json({ message: "Started real-time updates" });
  } catch (error) {
    logger.error("Error starting updates: ", error);
    res.status(500).json({ message: "Error starting updates" });
  }
}