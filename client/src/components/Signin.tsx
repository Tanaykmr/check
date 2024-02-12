import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import axios from "axios";
import { Button, Typography } from "@mui/material";
import TextField from '@mui/material/TextField';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import { Welcome } from './Signup';

const BASE_URL = import.meta.env.VITE_BASE_URL;
if (!BASE_URL) {
	console.error(
		"BASE_URL is not defined in the environment variables in user.ts."
	);
	process.exit(1);
}

// TODO: remove id custom names
const Signin = () => {
	return (
		<div id="testing-div" style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
			<Welcome />
			<SigninCard />
		</div>
	);

}

function SigninCard() {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSignin = () => {
		axios.post(`${BASE_URL}/user/signin`, { username, password }).then((response) => {
			console.log("response is: ", response);
			localStorage.setItem("authorization", response.data.token);
			window.location.href = "/todolist";
		}).catch((error) => {
			console.error("Axios error:", error);
			if (error.response) {
				console.log("Request was made, but there was an error:", error.response.status);
				//TODO: replace all alerts with react-hot-toast
				alert("Invalid credentials");
			} else {
				console.log("Unknown error:", error.message);
			}
		});
	}

	return (
		<div id="create-acc" style={{ marginRight: "50px", display: "flex", flexDirection: "column", width: "588px" }}>
			<Typography variant="h3" style={{ margin: "0 80px 60px", }} align="center">Welcome back</Typography>
			<Typography variant="h6">Name</Typography>
			<TextField
				id="standard-required"
				label="Enter your name"
				variant="standard"
				fullWidth={true}
			/>
			<Typography variant="h6" style={{ marginTop: "40px" }}>Email</Typography>
			{/* TODO: add validation to check if valid email */}
			<TextField
				id="standard-required"
				label="Enter your email address"
				defaultValue="Hello World"
				variant="standard"
				fullWidth={true}
				value={username}
				onChange={(e) => {
					setUsername(e.target.value)
				}}
			/>
			<Typography variant="h6" style={{ marginTop: "40px" }}>Password</Typography>
			{/* TODO: add password meter from mui to see if password is strong */}
			<TextField
				id="standard-password-input"
				label="Password"
				type="password"
				autoComplete="current-password"
				variant="standard"
				fullWidth={true}
				value={password}
				onChange={(e) => {
					setPassword(e.target.value)
				}}
			/>

			<div style={{ display: "flex", justifyContent: "flex-start", marginTop: "40px" }}>
				<Button variant="contained" size="large" style={{ marginRight: "40px" }} onClick={() => {
					console.log("inside signup button in signup.tsx, username is: ", username, "password is: ", password);
					handleSignin();
				}}>
					Sign in
				</Button>

				<Button variant="outlined" size="large" onClick={() => {
					navigate('/signup');
				}}>
					Sign up
				</Button>
			</div>
		</div>
	)
}
export default Signin;

