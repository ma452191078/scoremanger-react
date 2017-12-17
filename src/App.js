import React, { Component } from 'react';
import { Route } from "react-router-dom";
import PageItem from "./PageItem"
import './App.css';
import ScoreList from "./ScoreList.js"
import './AppConstant'

class App extends Component {
  render() {
    return (
        <div>
            <Route exact path='/' component={PageItem} />
            <Route exact path='/ScoreList/' component={ScoreList} />
        </div>
    );
  }
}

export default App;
