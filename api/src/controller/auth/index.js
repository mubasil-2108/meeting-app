const dotenv = require("dotenv");
dotenv.config();

const USERS = require("../../model/user");
const { genSaltSync, hashSync } = require('bcrypt')

const { STREAM_API_KEY, STREAM_API_SECRET } = process.env;
const salt = genSaltSync(10);

const { StreamChat } = require('stream-chat')
const client = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);
const registerUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    const checkUser = USERS.find((user) => user.email === email);
    if (checkUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    try {
        const hashedPassword = hashSync(password, salt);
        const id = Math.random().toString(36).slice(2)
        const newUser = {
            id,
            email,
            hashedPassword
        };
        USERS.push(newUser);

        await client.upsertUser({
            id,
            email,
            name: email.split('@')[0],
        })

        const token = client.createToken(id);

        return res.status(201).json({
            token,
            user: {
                id,
                email,
            }
        });

    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const checkUser = await USERS.find((user) => user.email === email);
    const hashedPassword = hashSync(password, salt);
    if (!checkUser || checkUser.hashedPassword !== hashedPassword) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }
    try {

        const token = client.createToken(checkUser.id);
        return res.status(200).json({
            token,
            user: {
                id: checkUser.id,
                email: checkUser.email,
            }
        });

    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    registerUser,
    loginUser
};