import {useNavigate} from 'react-router-dom';
import {useState} from "react";
import axios from "axios";
import {Button, Typography} from "@mui/material";
import TextField from '@mui/material/TextField';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';

// TODO: pass url as a prop from App.tsx
const BASE_URL = import.meta.env.VITE_BASE_URL;
if (!BASE_URL) {
    console.error(
        "BASE_URL is not defined in the environment variables in user.ts."
    );
    process.exit(1);
}

// TODO: add box instead of div to remove br and make it cleaner, remove id custom names
const Signup = () => {

    return (
        <div id="testing-div" style={{display: "flex", justifyContent: "space-between", marginTop: "40px"}}>
            <Welcome/>
            <SignupCard/>
        </div>
    );

}

export function Welcome() {
    return (
        <div id="welcome" style={{
            marginLeft: "80px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            height: "100vh"
        }}>
            <Typography variant="h4" style={{color: "white", marginTop: "50px",}}>Welcome to</Typography>
            <img src="https://cdn-icons-png.freepik.com/512/3585/3585145.png?ga=GA1.1.1023148225.1707385329&"
                 style={{width: "100px", paddingTop: "20px"}}></img>
            <Typography variant="h2"
                        style={{color: "white", marginTop: "20px", fontWeight: "500"}}>TaskMaster</Typography>

            <Typography variant="subtitle1" style={{color: "white", marginTop: "50px", textAlign: "center"}}>Your
                trusted ally in productivity, streamlining your to-dos with precision, <br/>so you can focus on what
                matters most.</Typography>

            <div style={{display: "flex", justifyContent: "space-between", marginTop: "300px", marginBottom: "20px"}}>
                <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                     style={{width: "50px", marginRight: "50px"}} onClick={() => {
                    window.location.href = "http://github.com/tanaykmr"
                }}/>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Twitter_X.png/640px-Twitter_X.png"
                     style={{width: "69px"}} onClick={() => {
                    window.location.href = "/todolist"
                }}/>
            </div>
        </div>
    )
}

function SignupCard() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = () => {
        axios.post(`${BASE_URL}/user/signup`, {username, password}).then((response) => {
            console.log("response is: ", response);
            localStorage.setItem("authorization", response.data.token);
            alert("Signed up successfully")
            window.location.href = "https://youtube.com";
        }).catch((error) => {
            console.error("Axios error:", error);
            if (error.response) {
                console.log("Request was made, but there was an error:", error.response.status);
                //TODO: replace all alerts with react-hot-toast
                alert(error.response.data.issueIn + ": " + error.response.data.problem);
            } else {
                console.log("Unknown error:", error.message);
            }
        });
    }

    return (
        <div id="create-acc" style={{marginRight: "50px", display: "flex", flexDirection: "column"}}>
            <Typography variant="h3" style={{margin: "0 80px 60px",}}>Create your account</Typography>
            <Typography variant="h6">Name</Typography>
            <TextField
                id="standard-required"
                label="Enter your name"
                variant="standard"
                fullWidth={true}
            />
            <Typography variant="h6" style={{marginTop: "40px"}}>Email</Typography>
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
            <Typography variant="h6" style={{marginTop: "40px"}}>Password</Typography>
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

            <div style={{display: "flex", justifyContent: "flex-start", marginTop: "40px"}}>
                <Button variant="contained" size="large" style={{marginRight: "40px"}} onClick={() => {
                    console.log("inside signup button in signup.tsx, username is: ", username, "password is: ", password);
                    handleSignup();
                }}>
                    Sign up
                </Button>

                <Button variant="outlined" size="large" onClick={() => {
                    navigate("/signin");
                }}>
                    Sign in
                </Button>
            </div>
        </div>
    )
}

export default Signup;
