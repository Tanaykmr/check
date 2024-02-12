"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_index_1 = require("../db/db-index");
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("../middleware/auth");
const zod_1 = require("zod");
const router = express_1.default.Router();
dotenv_1.default.config({ path: "./config/.env.local" });
const secret = process.env.JWT_SECRET;
if (!secret) {
    console.error("JWT_SECRET is not defined in the environment variables in user.ts.");
    process.exit(1);
}
const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
// the above checks if the input string has at least one uppercase letter, one lowercase letter, one integer and one special symbol
let CreateAccountProps = zod_1.z.object({
    username: zod_1.z.string().email(), password: zod_1.z.string().min(8).refine(value => regex.test(value), {
        message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    })
}).strict(); //adding .strict() made the user prevent sending anything else along with keys. without this, the user could send extra stuff too, even though it got ignored: https://chat.openai.com/share/f610e563-acf2-4a64-a03a-e14878439116
router.get("/me", auth_1.authenticatejwt, async (req, res) => {
    const idHeader = req.headers.userId;
    if (!idHeader) {
        res.status(404).json({ message: "unable to find userId" });
    }
    const currentUser = await db_index_1.User.findOne({ _id: idHeader });
    if (!currentUser) {
        res.status(403).json({ message: "user is not logged in" });
    }
    else {
        res.json({ username: currentUser.username });
    }
});
router.post("/signup", async (req, res) => {
    // TODO: Add validation using zod to check if the user is not sending erroneous requests in req.body, publish it on npm, bring it as a type using z.infer in TS
    const parsedInput = CreateAccountProps.safeParse(req.body);
    if (!parsedInput.success) {
        console.log("inside if");
        res.status(400).json({
            message: "unable to create new user",
            error: parsedInput.error,
            issueIn: parsedInput.error.issues[0].path[0],
            problem: parsedInput.error.issues[0].message
        });
        console.log({
            message: "unable to create new user",
            issueIn: parsedInput.error.issues[0].path[0],
            problem: parsedInput.error.issues[0].message
        });
    }
    else {
        console.log("inside else");
        const { username, password } = parsedInput.data;
        const existingUser = await db_index_1.User.findOne({ username });
        if (!existingUser) {
            const newAdmin = new db_index_1.User({ username, password });
            await newAdmin.save();
            const token = jsonwebtoken_1.default.sign({ id: newAdmin._id }, secret, { expiresIn: "1d" });
            res.json({ username, token, message: "new user created" });
            console.log("username: ", username, "token: ", token);
        }
        else {
            res.status(400).json({ message: "User already exists" });
        }
    }
});
router.post("/signin", async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await db_index_1.User.findOne({ username, password });
    if (!existingUser) {
        res.status(404).json({ message: "Invalid credentials" });
    }
    else {
        const token = jsonwebtoken_1.default.sign({ id: existingUser._id }, secret, {
            expiresIn: "1d",
        });
        res.json({ message: "Logged in successfully", token });
    }
});
exports.default = router;
