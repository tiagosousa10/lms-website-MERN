import mongoose from 'mongoose';

//connect to mongodb database

const connectDB = async () => {
 try {
  mongoose.connection.on('connected', () => 
    console.log('MongoDB connected')
  )
  await mongoose.connect(`${process.env.MONGODB_URI}/lms` )
  

 } catch(error) {
  console.log(`Error on MongoDB: ${error.message}`);
 }
}


export default connectDB;
