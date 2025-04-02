import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { userRoute } from './routes/userRoute.js';
import { residencyRoute } from './routes/residencyRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.DATABASE_URL; // Ensure this is set in your .env file

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "https://homey-alpha.vercel.app",  // Update to match your frontend URL
    credentials: true,
}));

// Connect to MongoDB
mongoose.connect(MONGO_URL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch(err => console.error("❌ Error connecting to MongoDB:", err));

// Routes
app.use('/api/user', userRoute);
app.use('/api/residency', residencyRoute);

// Start server after DB connection
mongoose.connection.once("open", () => {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
});

