import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import MainRoute from "./routes";
import Header from "./component/Header";

import { useCookies } from "react-cookie";
import { getUserData } from "./utils";
import Sidebar from "./component/Sidebar";

const App = () => {
    const userData = getUserData();
    const [cookie] = useCookies(['isToken']);
    const [pathName, setPathName] = useState('/');

    useEffect(() => {
        if(userData){
            if(pathName === '/login' || pathName === '/signup') {
                window.location.href = '/';
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathName]);

    return (
        <div>
            <div id="content">
                <Router>
                    {
                        pathName.includes('/bank') || pathName.includes('/paymentdetails') ?
                            <div>
                                <Header />
                                <MainRoute />
                            </div>
                            :
                            <div>
                                {
                                    cookie.isToken && userData &&
                                    <Sidebar setPathName={setPathName} />
                                }
                                <div className={(cookie.isToken && userData) ? 'main-login-block' : ''}>
                                    <Header/>
                                    <div className={(cookie.isToken && userData) ? 'main-page-bg-block' : ''}>
                                        <div className={(cookie.isToken && userData) ? 'main-page-block' : ''}>
                                            <MainRoute/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    }
                </Router>
            </div>
        </div>
    );
}

export default App;
