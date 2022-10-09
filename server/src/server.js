import http from "http";
import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import { connectMongoDB } from "./utils/mongo.js";

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

await connectMongoDB();

server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
