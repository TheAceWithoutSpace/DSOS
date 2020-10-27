import React,{ useState } from 'react';
import {BrowserRouter as Router,Route}from "react-router-dom"
import { Redirect } from 'react-router'
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
import RequestAggregate from './Pages/RequestAggregate'
import RequestSvm from'./Pages/RequestSvm'
import RequestVolume from './Pages/RequestVolume'
import BugReport from'./components/Bug_Report'
import UserTable from './components/UserTable'
import StorageView from './components/StorageView'

function App() {
  const [User, setUser] = useState({});
  axios.defaults.baseURL="http://localhost:3000/"
  return (
    <Router exact path="/SignIN">
      <Redirect to="/SignIN"/>
      <Navbar User={User} setUser={setUser}/>
      <br/>
      <Route path="/SignIN"render={(props) => (<LoginSignUp {...props} setUser={setUser} isAuthed={true} />)}/>
      <Route path="/ArchitectViewRequest/:id" component={ArchitectViewRequest}/>
      <Route path="/Architect"component={ArchitectPage}/>
      <Route path="/Home" render={(props) => (<Home {...props} User={User} isAuthed={true} />)}/>
      <Route path="/Admin" render={(props) => (<Admin {...props} User={User} isAuthed={true} />)}/>
      <Route path="/RequsetSvm"  component={RequestSvm}/>
      <Route path="/RequsetAggre" component={RequestAggregate}/>
      <Route path="/RequestVolume" component={RequestVolume}/>
      <Route path='/BugReport' component={BugReport}/>
      <Route path='/Users' component={UserTable}/>
      <Route path="/Bug" component={Bug}/>
      <Route path="/StorageView" component={StorageView}/>
    </Router>
  );
}

export default App;
