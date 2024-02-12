"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_index_1 = require("../db/db-index");
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("../middleware/auth");
const zod_1 = require("zod");
const router = express_1.default.Router();
//TODO: add ability to pin todos
dotenv_1.default.config({ path: "./config/.env.local" });
const secret = process.env.JWT_SECRET;
if (!secret) {
    console.error("JWT_SECRET is not defined in the environment variables in user.ts.");
    process.exit(1);
}
let TodoInputProps = zod_1.z.object({
    description: zod_1.z.string().max(25)
}).strict(); //adding .strict() made the user prevent sending anything else along with keys. without this, the user could send extra stuff too, even though it got ignored: https://chat.openai.com/share/f610e563-acf2-4a64-a03a-e14878439116
//create, update, delete, complete, show all
router.post("/create", auth_1.authenticatejwt, async (req, res) => {
    //TODO: add zod for todo body. zod is added for everything that comes from the frontend
    const parsedInput = TodoInputProps.safeParse(req.body);
    console.log("parsedInput: ", parsedInput);
    if (!parsedInput.success) {
        res.status(403).json({ CurrentZodError: parsedInput.error });
    }
    else {
        console.log("parsedInput is: ", parsedInput);
        const description = parsedInput.data.description;
        const ownerId = req.headers.userId;
        if (typeof ownerId === "undefined") {
            res.status(403).json({ error: "Wrong data type of ownerId" });
        }
        else {
            const finalTodo = new db_index_1.Todo({ description, done: false, ownerId });
            await finalTodo.save().then((response) => {
                console.log("after saving the todo, the response is: ", response);
                res.json({ message: "todo created successfully", todo: response });
            }).catch((error) => {
                res.status(500).json({ message: error });
            });
        }
    }
});
router.get("/all", auth_1.authenticatejwt, (req, res) => {
    db_index_1.Todo.find({ ownerId: req.headers.userId })
        //code expects todos to be of type <TodoInterface[]>, but mongoDB's .find returns a "document". solution: map(convert) everydocument to a Todointerfave
        //TODO: unable to do the above, need help
        // .then((documents: Array<Document & TodoInterface>) => {
        .then((todos) => {
        res.json({ todos });
    })
        .catch((error) => {
        console.log("unable to fetch todos: ", error);
        res.status(500).json({ error: error });
    });
});
router.patch("/update/:todoId/done", auth_1.authenticatejwt, (req, res) => {
    const todoId = req.params.todoId;
    const isDone = req.body.done;
    db_index_1.Todo.findOneAndUpdate({ _id: todoId, ownerId: req.headers.userId }, { done: isDone }, { new: true })
        .then((updatedTodo) => {
        res.json({ message: "Todo status updated", updatedTodo });
    })
        .catch((error) => {
        res.status(501).json({ message: "Unable to update todo status", error });
    });
});
router.patch("/update/:todoId", auth_1.authenticatejwt, (req, res) => {
    const todoId = req.params.todoId;
    const updatedData = req.body;
    db_index_1.Todo.findOneAndUpdate({ _id: todoId, ownerId: req.headers.userId }, updatedData, { new: true })
        .then((updatedTodo) => {
        console.log("updated todo is: ", updatedTodo);
        res.json({ message: "Todo updated", updatedTodo });
    })
        .catch((error) => {
        res.status(502).json({ error: "Unable to complete todo" });
    });
});
router.delete("/delete/:todoId", auth_1.authenticatejwt, (req, res) => {
    const todoId = req.params.todoId;
    db_index_1.Todo.deleteOne({ _id: todoId, ownerId: req.headers.userId })
        .then((result) => {
        if (result.deletedCount === 1) {
            console.log("Successfully deleted one document.");
            res.json({ message: "deleted todo successfully", result });
            //result contains "acknowledged": true, "deletedCount": 1
        }
        else {
            console.log("No documents matched the query. Deleted 0 documents.");
            res.sendStatus(204);
        }
    })
        .catch((error) => {
        console.log("encountered an error while deleting todo: ", error);
        res
            .status(500)
            .json({ message: "encountered an error while deleting todo" });
    });
});
exports.default = router;
