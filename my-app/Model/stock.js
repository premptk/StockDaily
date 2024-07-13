import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    symbol: String,
    image: String,
    current_price: Number,
    market_cap: Number,
  },
  {
    timestamps: true,
  }
);

const Bitcoin = mongoose.model("Bitcoin", stockSchema);
const Ethereum = mongoose.model("Ethereum", stockSchema);
const Tether = mongoose.model("Tether", stockSchema);
const BinanceCoin = mongoose.model("Binancecoin", stockSchema);
const Solana = mongoose.model("Solana", stockSchema);

export { Bitcoin, Ethereum, Tether, BinanceCoin, Solana };