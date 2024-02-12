"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticatejwt = exports.secret = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./config/.env.local" });
exports.secret = process.env.JWT_SECRET;
if (!exports.secret) {
    console.error("JWT_SECRET is not defined in the environment variables in auth.ts.");
    process.exit(1);
}
// we verify the jwt here
const authenticatejwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(token, exports.secret, function (err, payload) {
            if (err) {
                res.status(401).json({ message: "encountered an error, enable to login" });
                console.error(err);
            }
            else if (!payload) {
                res.sendStatus(403);
            }
            else if (typeof payload === "string") {
                return res.sendStatus(403);
            }
            else {
                req.headers.userId = payload.id; //this id is the mongoDB _id of the user
                next();
            }
        });
    }
    else {
        res.status(401).send({ message: "authorization token does not exist" });
    }
};
exports.authenticatejwt = authenticatejwt;
