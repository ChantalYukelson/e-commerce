import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://chantuyukel:InAQTDBdKSPC1bcs@clustercoder.1r9ot.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=ClusterCoder');
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error al conectar a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
