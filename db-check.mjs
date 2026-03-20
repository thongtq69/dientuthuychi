import mongoose from 'mongoose';

const uri = "mongodb+srv://thame6868_db_user:8kIgcRztgxZRy5Od@cluster0.jninzmt.mongodb.net/?appName=Cluster0";

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("Connected successfully!");
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    // Check users
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log("Users count:", users.length);
    if (users.length > 0) {
      console.log("First user email:", users[0].email);
    }
  } catch (err) {
    console.error("Failed:", err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
