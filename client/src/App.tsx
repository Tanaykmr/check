import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import Signup from './components/Signup';
import Signin from './components/Signin';
import Todolist from './components/Todolist';
import './App.css'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<Signup/>}/>
                <Route path="/" element={<Todolist/>}/>
                <Route path="/signin" element={<Signin/>}/>
                <Route path="/todolist" element={<Todolist/>}/>
            </Routes>
        </Router>
    )
}

export default App
