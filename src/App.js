import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import MainRoute from "./routes";
import Header from "./component/Header";
import { useCookies } from "react-cookie";

const App = () => {

    const [cookie, setCookie] = useCookies(['isToken'])
    return (
        <div>
            <div id="content">
                <Router>
                    <Header/>
                    <MainRoute/>
                </Router>
            </div>
        </div>
    );
}

export default App;
