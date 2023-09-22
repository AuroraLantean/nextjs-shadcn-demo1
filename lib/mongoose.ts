import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  console.log("connectToDB()...")
  mongoose.set('strictQuery', true);//prevent unknown field queries

  //console.log("MONGODB_PASSWORD:", process.env.MONGODB_PASSWORD)
  if (!process.env.MONGODB_USERNAME) return console.log('MONGODB_USERNAME not found');
  if (!process.env.MONGODB_PASSWORD) return console.log('MONGODB_PASSWORD not found');
  if (!process.env.MONGODB_URLX) return console.log('MONGODB_URLX not found');
  if (isConnected) return console.log('Already connected to MongoDB');

  try {
    const dbusername = encodeURIComponent(process.env.MONGODB_USERNAME);
    const dbpassword = encodeURIComponent(process.env.MONGODB_PASSWORD);

    const connStr = `mongodb+srv://${dbusername}:${dbpassword}@${process.env.MONGODB_URLX}`;
    console.log("connStr:", connStr);

    await mongoose.connect(connStr, {
      dbName: 'threads',
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
      //useCreateIndex: true,
    });
    isConnected = true;
    console.log("connectToDB() successful");
  } catch (error) {
    console.log("Error:" + error);
  }

}