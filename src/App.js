import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import MainRoute from "./routes";
import Header from "./component/Header";
// import Footer from "./component/Footer";

function App() {
    // useEffect(() => {
    //     window.onbeforeunload = function() {
    //         return "Dude, are you sure you want to refresh? Think of the kittens!";
    //     }
    // }, []);
  return (
      <div>
          <div id="content">
              <Router>
                  <Header />
                  <MainRoute />
              </Router>
          </div>
          {/*<Footer />*/}
      </div>
  );
}

export default App;
