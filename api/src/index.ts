const express = require("express");
const dotenv = require("dotenv");

const authRoutes = require("./routes/auth");

dotenv.config();

const { PORT, STREAM_API_KEY, STREAM_API_SECRET } = process.env;

const app = express();
app.use(express.json());

app.get("/", (req: any, res: any) => {
  res.json({ message: "✅ Auth route is working!" });
});

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`STREAM_API_KEY: ${STREAM_API_KEY}`);
    console.log(`STREAM_API_SECRET: ${STREAM_API_SECRET}`);
});