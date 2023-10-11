import mongoose from "mongoose";

export type BoxT = {
  id: string;
  title: string;
  available: number;
  total: number;
  interest: number;
  compo_addr: string;
  status: string;
  detail_link: string;
  img_link: string;
  seller_id: string;
  fixed_price: number;
  min_price: number;
  bid_price: number;
  votes: number;
  __v?: number;
  _id?: string;
}

//one box. default: false
const boxSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true, lowercase: true, minLength: 3, maxLength: 20, },
  available: { type: Number, min: 0, max: 100, validate: { validator: (v: number) => Number.isInteger(v), message: (props: { value: any; }) => `${props.value} is not an integer`, } },
  total: { type: Number, required: true, min: 1, validate: { validator: (v: number) => Number.isInteger(v), message: (props: { value: any; }) => `${props.value} is not an integer`, } },
  interest: { type: Number, min: 0.1, },
  fixed_price: { type: Number, min: 0.001, },
  min_price: { type: Number, min: 0.001, },
  bid_price: { type: Number, min: 0.001, },
  votes: { type: Number, min: 0, validate: { validator: (v: number) => Number.isInteger(v), message: (props: { value: any; }) => `${props.value} is not an integer`, } },
  compo_addr: { type: String, required: false },
  seller_id: { type: String, required: false },
  status: { type: String, required: false },
  img_link: String,
  detail_link: String,
});

const Box = mongoose.models.Box || mongoose.model('Box', boxSchema);//in the first time, mongoose.models.Box does not exist yet, so we need to use the fallback

export default Box;