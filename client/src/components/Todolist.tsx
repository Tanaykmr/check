import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Fab, TextField, Typography } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const BASE_URL = import.meta.env.VITE_BASE_URL;
if (!BASE_URL) {
  console.error(
    "BASE_URL is not defined in the environment variables in user.ts."
  );
  process.exit(1);
}

const label = { inputProps: { "aria-label": "Checkbox demo" } };

import { createTheme, ThemeProvider } from "@mui/material/styles";

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#ba142d", // Set the primary color
      // @ts-expect-error idk why using secondary as color is throwing an error
      secondary: "#294B29",
    },
    text: {
      secondary: "#f50057", // Set the secondary text color
    },
  },
});

interface TodoStyleInterface {
  _id?: string;
  description: string;
  done: boolean;
  ownerId: string;
}

const Todolist = () => {
  const [todos, setTodos] = useState<TodoStyleInterface[]>([]);
  useEffect(() => {
    axios
      .get(`${BASE_URL}/todos/all`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("authorization"),
        },
      })
      .then((response) => {
        console.log("response is: ", response);
        console.log("from response, todos are: ", response.data.todos);
        setTodos(response.data.todos);
      });
  }, []);

  console.log("Outside useEffect Todos are: ", todos);

  return (
    <div
      id="return-mother-div"
      style={{
        padding: "10px 20px",
        width: "fit-content",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "rgba(255, 255, 255, 0.25)", // Semi-transparent background
        backdropFilter: "blur(10px)", // Apply blur effect
        border: "1px solid rgba(255, 255, 255, 0.18)", // Border for contrast
        borderRadius: "10px", // Rounded corners
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", // Box shadow for depth
        WebkitBackdropFilter: "blur(10px)", // Apply blur effect (for Safari)
      }}
    >
      <Card
        variant="outlined"
        sx={{ borderRadius: "15px" }}
        style={{ background: "#FEDB39", marginBottom: "10px" }}
      >
        <Typography
          variant="h2"
          style={{
            padding: "10px",
            fontFamily: "Bungee Inline",
          }}
        >
          TaskMaster{" "}
        </Typography>
      </Card>
      <CreateTodoComponent setTodos={setTodos} />
      {todos.map((todo) => {
        return (
          <TodoListComponent
            key={todo._id}
            description={todo.description}
            done={todo.done}
            id={todo._id}
            todos={todos}
            setTodos={setTodos}
          />
        );
      })}
    </div>
  );
};

function CreateTodoComponent(props) {
  const [newTodo, setNewTodo] = useState([]);
  return (
    <div
      id="tododiv"
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "5px",
      }}
    >
      <TextField
        id="filled-basic"
        label="write your next task"
        variant="outlined"
        sx={{ borderRadius: "15px" }}
        style={{ marginRight: "10px", marginBottom: "25px" }}
        onChange={(e) => {
          console.log("e.target.value :", e.target.value);
          setNewTodo(e.target.value);
          console.log("newTodo: ", newTodo);
        }}
      />
      <Fab
        color="primary"
        aria-label="add"
        size="small"
        style={{ marginTop: "10px" }}
        onClick={async () => {
          await axios
            .post(
              `${BASE_URL}/todos/create`,
              {
                description: newTodo,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "authorization"
                  )}`,
                },
              }
            )
            .then((response) => {
              console.log("response after creating todo: ", response);
              console.log("newTodo is: ", newTodo);
              props.setTodos((prevTodos: TodoStyleInterface[]) => [
                ...prevTodos,
                response.data.todo,
              ]);
            });
        }}
      >
        <AddIcon />
      </Fab>
    </div>
  );
}

function TodoListComponent(props) {
  const [isChecked, setIsChecked] = useState(props.done);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
      }}
    >
      <Checkbox
        checked={isChecked}
        color="success"
        onChange={async (e) => {
            
          console.log("payload: ",props.description," oldischecked: ",isChecked," now, e.target.checked = ",e.target.checked);
          setIsChecked(e.target.checked);
          console.log("payload: ",props.description," newischecked: ",isChecked);
          await axios
            .patch(
              `${BASE_URL}/todos/update/${props.id}/done`,
              { done: e.target.checked },
              {
                headers: {
                  authorization: `Bearer ${localStorage.getItem(
                    "authorization"
                  )}`,
                },
              }
            )
            .then((response) => {
              console.log(
                "successfully completed todo, response is: ",
                response
              );
            })
            .catch((error) => {
              console.log("unable to mark done, here's the error: ", error);
            });
        }}
      />
      <Card
        style={{
          background: isChecked ? "green" : "orange",
          width: "200px",
          height: "30px",
          marginRight: "10px",
          padding: "3px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/*style={{ textDecoration : x.completed ? 'line-through' : 'none' }}*/}
        <Typography
          variant="subtitle1"
          align="center"
          style={{
            color: isChecked ? "white" : "black",
            textDecoration: isChecked ? "line-through" : "none",
            fontFamily: "ManRope",
          }}
        >
          {props.description}
        </Typography>
      </Card>
      <ThemeProvider theme={theme}>
        <Fab
          style={{ height: "40px", width: "40px" }}
          onClick={async () => {
            await axios
              .delete(`${BASE_URL}/todos/delete/${props.id}`, {
                headers: {
                  authorization: `Bearer ${localStorage.getItem(
                    "authorization"
                  )}`,
                },
              })
              .then((response) => {
                console.log("deletion successful, the response is: ", response);
                // from here we learn that changing the database on the backend does not change the todos array in the frontend, even though it depends on the database.  Hence, we have to change the todos array manually
                let newTodoArray: TodoStyleInterface[] = props.todos.filter(
                  (todo: TodoStyleInterface) => todo._id !== props.id
                );
                props.setTodos(newTodoArray);
              })
              .catch((error) => {
                console.log("unable to delete, the error is: ", error);
              });
          }}
        >
          <DeleteIcon
            sx={{ color: "primary.main" }}
            style={{ height: "25px", width: "25px" }}
          />
        </Fab>
      </ThemeProvider>
    </div>
  );
}

export default Todolist;
