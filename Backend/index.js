import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/conn.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import spotifyRoutes from "./controllers/spotify.js";
dotenv.config({path:"./.env"});

const app = express();
app.use(express.json());
app.use(helmet());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}))

app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

app.use(cors(
    {
        origin: "http://localhost:5173", //we can add multiple urls in an array ["http://localhost:5173", "http://localhost:3000"]
        credentials: true
    }
))
app.use(express.static("public"));


connectDB();

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/spotify",spotifyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});