import React from 'react';
import {BrowserRouter as Router,Route}from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "@fortawesome/fontawesome-svg-core"
import ArchitectPage from './Pages/ArchitectPage.component'
import LoginSignUp from './Pages/login-SignUp.component'
import axios from 'axios'
import ArchitectViewRequest from './Pages/ArchitectViewRequest.component'
import Navbar from'./components/NavBar.component'
import UserDashboard from './Pages/UserDashboard'
import Bug from './Pages/ReportBug.component'
import Admin from './Pages/AdminPage.component'
import RequestSvm from'./Pages/RequestSvm'
import RequestVolume from './Pages/RequestVolume'
import BugReport from'./components/AdminComponents/Bug_Report'
import UserTable from './components/AdminComponents/UserTable'
import StorageView from './components/AdminComponents/StorageView'
import UKnoob from './Pages/UKnoob'
import GrowCalc from './components/AdminComponents/GrowCalc'
import HomePage from './Pages/HomePage'
import './components/Loading.css'

//main app
function App() {
  axios.defaults.baseURL="http://localhost:3000/"
  if(JSON.parse(localStorage.getItem('user'))===null)
  {
    localStorage.setItem('user',JSON.stringify({_id:false,A:false,Ar:false,N:false,Hail:false}))
  }
  return (
    <Router exact path="/SignIN">
      <Navbar User={JSON.parse(localStorage.getItem('user'))} />
      <Route path="/home" component={HomePage}/>
      <Route path="/SignIN" render={(props) => (<LoginSignUp {...props} flag={true} />)}/>
      <Route path="/SignUP" render={(props) => (<LoginSignUp {...props} flag={false}/>)}/>
      <Route path="/ArchitectViewRequest/:id" component={ArchitectViewRequest}/>
      <Route path="/Architect"component={ArchitectPage}/>
      <Route path="/UserDashboard" render={(props) => (<UserDashboard {...props} User={JSON.parse(localStorage.getItem('user'))} />)}/>
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
