"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./routes/user"));
const todos_1 = __importDefault(require("./routes/todos"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./config/.env.local" });
const url = process.env.MONGOOSE_URL;
if (!url) {
    console.error("MONGOOSE_URL is not defined in the environment variables in user.ts.");
    process.exit(1);
}
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/user", user_1.default);
app.use("/todos", todos_1.default);
mongoose_1.default.connect(url);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
