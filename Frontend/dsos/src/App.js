import React from 'react';
import {BrowserRouter as Router,Route}from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "@fortawesome/fontawesome-svg-core"
import ArchitectPage from './Pages/ArchitectPage.component'
import LoginSignUp from './Pages/login-SignUp.component'
import axios from 'axios'
import ArchitectViewRequest from './Pages/ArchitectViewRequest.component'
import Navbar from'./components/NavBar.component'
import Home from './Pages/HomePage.component'
import Bug from './Pages/ReportBug.component'
import Admin from './Pages/AdminPage.component'
import RequestSvm from'./Pages/RequestSvm'
import RequestVolume from './Pages/RequestVolume'
import BugReport from'./components/Bug_Report'
import UserTable from './components/UserTable'
import StorageView from './components/StorageView'
import UKnoob from './Pages/UKnoob'
import GrowCalc from './components/GrowCalc'

function App() {
  axios.defaults.baseURL="http://localhost:3000/"
  if(JSON.parse(localStorage.getItem('user'))===null)
  {
    localStorage.setItem('user',JSON.stringify({_id:false,A:false,Ar:false,N:false}))
  }
  return (
    <Router exact path="/SignIN">
      <Navbar User={JSON.parse(localStorage.getItem('user'))} />
      <br/>
      <Route path="/SignIN"render={(props) => (<LoginSignUp {...props} />)}/>
      <Route path="/ArchitectViewRequest/:id" component={ArchitectViewRequest}/>
      <Route path="/Architect"component={ArchitectPage}/>
      <Route path="/Home" render={(props) => (<Home {...props} User={JSON.parse(localStorage.getItem('user'))} />)}/>
      <Route path="/Admin" render={(props) => (<Admin {...props} />)}/>
      <Route path="/RequsetSvm"  component={RequestSvm}/>
      <Route path="/RequestVolume" component={RequestVolume}/>
      <Route path='/BugReport' component={BugReport}/>
      <Route path='/Users' component={UserTable}/>
      <Route path="/Bug" component={Bug}/>
      <Route path="/StorageView" component={StorageView}/>
      <Route path="/Growth" component={GrowCalc}/>
      <Route path="/UKnoob" component={UKnoob}/>
    </Router>
  );
}

export default App;
