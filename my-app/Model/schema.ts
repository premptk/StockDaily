import mongoose, { Document, Model, Schema } from "mongoose";

interface IStock extends Document {
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
}

const stockSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    image: { type: String, required: true },
    current_price: { type: Number, required: true },
    market_cap: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Bitcoin: Model<IStock> = mongoose.models.Bitcoin || mongoose.model<IStock>("Bitcoin", stockSchema);
const Ethereum: Model<IStock> = mongoose.models.Ethereum || mongoose.model<IStock>("Ethereum", stockSchema);
const Tether: Model<IStock> = mongoose.models.Tether || mongoose.model<IStock>("Tether", stockSchema);
const BinanceCoin: Model<IStock> = mongoose.models.BinanceCoin || mongoose.model<IStock>("BinanceCoin", stockSchema);
const Solana: Model<IStock> = mongoose.models.Solana || mongoose.model<IStock>("Solana", stockSchema);

export { Bitcoin, Ethereum, Tether, BinanceCoin, Solana };
