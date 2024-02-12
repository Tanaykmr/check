import express from "express";
import {Todo} from "../db/db-index";
import dotenv, {parse} from "dotenv";
import {authenticatejwt} from "../middleware/auth";
import {z} from "zod";
import {Request, Response} from "express";


const router = express.Router();

//TODO: add ability to pin todos
dotenv.config({path: "./config/.env.local"});
const secret = process.env.JWT_SECRET;
if (!secret) {
    console.error("JWT_SECRET is not defined in the environment variables in user.ts.");
    process.exit(1);
}

interface CreatedTodo {
    description: string;
}

interface TodoInterface extends CreatedTodo {
    done: boolean;
    ownerId: string;
}

let TodoInputProps = z.object({
    description: z.string().max(25)
}).strict(); //adding .strict() made the user prevent sending anything else along with keys. without this, the user could send extra stuff too, even though it got ignored: https://chat.openai.com/share/f610e563-acf2-4a64-a03a-e14878439116

//create, update, delete, complete, show all
router.post("/create", authenticatejwt, async (req: Request, res: Response) => {
    //TODO: add zod for todo body. zod is added for everything that comes from the frontend
    const parsedInput = TodoInputProps.safeParse(req.body);
    console.log("parsedInput: ", parsedInput)
    if (!parsedInput.success) {
        res.status(403).json({CurrentZodError: parsedInput.error})
    } else {
        console.log("parsedInput is: ", parsedInput);
        const description = parsedInput.data.description;
        const ownerId: string | undefined = req.headers.userId as string;
        if (typeof ownerId === "undefined") {
            res.status(403).json({error: "Wrong data type of ownerId"});
        } else {
            const finalTodo = new Todo({description, done: false, ownerId})
            await finalTodo.save().then((response) => {
                console.log("after saving the todo, the response is: ", response)
                res.json({message: "todo created successfully", todo: response});
            }).catch((error) => {
                res.status(500).json({message: error});
            });
        }
    }
});

router.get("/all", authenticatejwt, (req, res) => {
    Todo.find({ownerId: req.headers.userId})
        //code expects todos to be of type <TodoInterface[]>, but mongoDB's .find returns a "document". solution: map(convert) everydocument to a Todointerfave
        //TODO: unable to do the above, need help
        // .then((documents: Array<Document & TodoInterface>) => {
        .then((todos) => {
            res.json({todos});
        })
        .catch((error) => {
            console.log("unable to fetch todos: ", error);
            res.status(500).json({error: error});
        });
});

router.patch("/update/:todoId/done", authenticatejwt, (req, res) => {
    const todoId = req.params.todoId;
    const isDone:boolean = req.body.done;
    Todo.findOneAndUpdate({_id: todoId, ownerId: req.headers.userId}, {done: isDone}, {new: true})
        .then((updatedTodo) => {
            res.json({message: "Todo status updated", updatedTodo});
        })
        .catch((error) => {
            res.status(501).json({message: "Unable to update todo status", error});
        });
});

router.patch("/update/:todoId", authenticatejwt, (req, res) => {
    const todoId = req.params.todoId;
    const updatedData = req.body;
    Todo.findOneAndUpdate({_id: todoId, ownerId: req.headers.userId}, updatedData, {new: true})
        .then((updatedTodo) => {
            console.log("updated todo is: ", updatedTodo);
            res.json({message: "Todo updated", updatedTodo});
        })
        .catch((error) => {
            res.status(502).json({error: "Unable to complete todo"});
        });
});

router.delete("/delete/:todoId", authenticatejwt, (req, res) => {
    const todoId = req.params.todoId;
    Todo.deleteOne({_id: todoId, ownerId: req.headers.userId})
        .then((result) => {
            if (result.deletedCount === 1) {
                console.log("Successfully deleted one document.");
                res.json({message: "deleted todo successfully", result});
                //result contains "acknowledged": true, "deletedCount": 1
            } else {
                console.log("No documents matched the query. Deleted 0 documents.");
                res.sendStatus(204);
            }
        })
        .catch((error) => {
            console.log("encountered an error while deleting todo: ", error);
            res
                .status(500)
                .json({message: "encountered an error while deleting todo"});
        });
});

export default router;
