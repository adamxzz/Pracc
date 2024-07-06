import { MongoClient } from 'mongodb';
 
let db;
 
async function connectToDb(cb) {
    const client = new MongoClient(`mongodb+srv://adamz:Alexisaneek@cluster0.vrb0nqg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
    try {
        await client.connect();
        db = client.db('react-blog-db');
        console.log("Connected to the 'react-blog-db' database");
        cb();
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        cb(err);
    }
}
 
export {
    db,
    connectToDb,
};