import mongoose from "mongoose";

mongoose.connection.on("error", (error) => {
  console.error(`MongoDB runtime error: ${error.message}`);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected.");
});

let reconnectTimer = null;

const connectDB = async () => {
  const mongoUri = (
    process.env.MONGO_URI ||
    process.env.Mongo_url ||
    ""
  ).trim();
  const directMongoUri = (process.env.MONGO_URI_DIRECT || "").trim();

  if (!mongoUri) {
    throw new Error("MongoDB connection string is missing.");
  }

  const connectionOptions = {
    dbName: process.env.MONGO_DB_NAME || "pinstack",
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4,
  };

  try {
    const connection = await mongoose.connect(mongoUri, connectionOptions);
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    console.log(`MongoDB connected: ${connection.connection.host}`);
    return true;
  } catch (error) {
    const isSrvLookupFailure =
      mongoUri.startsWith("mongodb+srv://") &&
      /querySrv|ENOTFOUND|ECONNREFUSED/i.test(error.message);

    if (isSrvLookupFailure && directMongoUri) {
      console.warn(
        "Primary Atlas SRV lookup failed. Retrying with MONGO_URI_DIRECT fallback."
      );

      try {
        const fallbackConnection = await mongoose.connect(
          directMongoUri,
          connectionOptions
        );
        console.log(
          `MongoDB connected via direct URI: ${fallbackConnection.connection.host}`
        );
        return true;
      } catch (fallbackError) {
        console.error(
          `MongoDB direct fallback failed: ${fallbackError.message}`
        );
      }
    } else {
      console.error(`MongoDB connection failed: ${error.message}`);
    }

    if (isSrvLookupFailure) {
      console.error(
        "Atlas SRV lookup failed. Use MONGO_URI_DIRECT or check the cluster hostname, local DNS/network access, and Atlas IP access list."
      );
    }

    if (!reconnectTimer) {
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connectDB();
      }, 10000);
      console.warn("Retrying MongoDB connection in 10 seconds...");
    }

    return false;
  }
};

export default connectDB;
