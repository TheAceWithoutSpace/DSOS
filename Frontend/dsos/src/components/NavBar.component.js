import React from 'react';
import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faSoundcloud} from '@fortawesome/free-brands-svg-icons'
import { faUserPlus,faUser,} from '@fortawesome/free-solid-svg-icons'

// nav bar componneent
function logout()
{
localStorage.setItem('user',JSON.stringify({_id:false,A:false,Ar:false,N:false,Hail:false}))
window.location.href = '/home';
}
function Navbar(props){
    console.log(props.User)
        return(
            <nav className="nav navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container mx-0">
                    <div className="navbar-header" >
                        {props.User._id? 
                            <>{props.User.A?
                            <div className="nav mb-0 h1 btn btn-lg btn-dark">
                            <Link to='/Admin' style={{color:"white",fontSize:"2.4rem"}} >
                                <FontAwesomeIcon icon={faSoundcloud} size={"lg"}  style={{paddingTop:"2px",paddingRight:"10px"}}/>    
                                <span style={{fontSize:"2rem"}}>DSOS</span>
                            </Link>
                            </div>
                            :<>{props.User.Ar?
                                    <div className="nav mb-0 h1 btn btn-lg btn-dark">
                                        <Link to='/Architect' style={{color:"white",fontSize:"2.4rem"}} >
                                            <FontAwesomeIcon icon={faSoundcloud} size={"lg"}  style={{paddingTop:"2px",paddingRight:"10px"}}/>    
                                            <span style={{fontSize:"2rem"}}>DSOS</span>
                                        </Link>
                                    </div>
                                    :<div className="nav mb-0 h1  btn btn-lg btn-dark">
                                        <Link to='/Home' style={{color:"white",fontSize:"2.4rem"}} >
                                            <FontAwesomeIcon icon={faSoundcloud} size={"lg"}  style={{paddingTop:"2px",paddingRight:"10px"}}/>    
                                            <span style={{fontSize:"2rem"}}>DSOS</span>
                                        </Link>
                                    </div>}
                                </>}
                            </>
                        :<div className="nav mb-0 h1 btn btn-lg btn-dark" autoComplete="off" checked>
                            <Link to='/home' style={{color:"white",fontSize:"2.4rem"}} >
                                <FontAwesomeIcon icon={faSoundcloud} size={"lg"}  style={{paddingTop:"2px",paddingRight:"10px"}}/>    
                                <span style={{fontSize:"2rem"}}>DSOS</span>
                            </Link>
                        </div>
                        }
                    </div>
                    {
                    //check if the user is admin or Arcitect or noraml user and render the currect navbar for each
                    }
                    <div className="collpase navbar-collapse">  
                        {props.User._id?//@IF loggedin
                            <div>
                                {/* @if Admin(Admin is also Arcitect) */}
                                {props.User.A?
                                <>
                                    <ul className="navbar-nav mr-auto">
                                    <li className='navbar-item'>
                                        <Link to ='/admin' className=' btn btn-lg btn-dark' autoComplete="off" checked>Admin</Link>
                                    </li>
                                    <li className='navbar-item'>
                                        <Link to ='/Architect' className=' btn btn-lg btn-dark' autoComplete="off">Architect</Link>
                                    </li>
                                    <li className='navbar-item'>
                                    <button onClick={logout} href="/home"className=' btn btn-lg btn-dark' autoComplete="off">Logout</button>
                                    </li>
                                    </ul>
                                </>
                                    ://@ElseIF Architect
                                    <div>{props.User.Ar?
                                        <>
                                        <ul className="navbar-nav mr-auto">
                                            {/* <li className="navbar-item">
                                                <Link to ='/Home' className='nav-link'>HomePage</Link>
                                            </li> */}
                                            <li className='navbar-item'>
                                                <Link to ='/Architect' className='btn btn-lg btn-dark' autoComplete="off" checked>Architect</Link>
                                            </li>
                                            <li className='navbar-item'>
                                                <button onClick={logout} href="/home" className='btn btn-lg btn-dark'>Logout</button>
                                            </li>    
                                        </ul>
                                        </>
                                        ://@Else The User is a client (Architect&&Admin ==false)   
                                        <>
                                        <ul className="navbar-nav mr-auto">
                                            <li className="navbar-item">
                                                <Link to ='/UserDashboard' className='btn btn-lg btn-dark' autoComplete="off" checked>Home</Link>
                                            </li>
                                            <li className='navbar-item'>
                                                <Link to={{pathname:"/RequsetSvm" ,aboutProps:{User:props.User}}} className="btn btn-lg btn-dark" autoComplete="off">Svm Request </Link>
                                            </li>  
                                            <li className='navbar-item'>
                                                <Link to={{pathname:"/RequestVolume" ,aboutProps:{User:props.User}}} className=" btn btn-lg btn-dark" autoComplete="off">Volume Request</Link>
                                            </li>  
                                            <li className='navbar-item'>
                                                <Link to={{pathname:"/Bug" ,aboutProps:{User:props.User}}} className=" btn btn-lg btn-dark" autoComplete="off">
                                                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-bug" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A4.979 4.979 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A4.985 4.985 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623zM4 7v4a4 4 0 0 0 3.5 3.97V7H4zm4.5 0v7.97A4 4 0 0 0 12 11V7H8.5zM12 6H4a3.99 3.99 0 0 1 1.333-2.982A3.983 3.983 0 0 1 8 2c1.025 0 1.959.385 2.666 1.018A3.989 3.989 0 0 1 12 6z"/>
                                                    </svg>
                                                    {" Report Bug"}
                                                </Link>
                                            </li>  
                                            <li className='navbar-item'>
                                            <button onClick={logout} href="/home" className=' btn btn-lg btn-dark'>Logout</button>
                                            </li>    
                                        </ul>
                                        </>
                                    }</div>
                                }
                            </div>
                            ://@Else
                            <div>
                                <ul className="nav navbar-nav navbar-right" >   
                                    <li className='navbar-item' autoComplete="off">
                                        <Link to ='/SignIN' className='btn btn-lg btn-dark nav-link ml-2'><FontAwesomeIcon aria-hidden="true" icon={faUser}/> SignIn</Link>
                                    </li>
                                    <li className='navbar-item' autoComplete="off">
                                        <Link to ='/SignUP' className='btn btn-lg btn-dark nav-link ml-2'><FontAwesomeIcon aria-hidden="true" icon={faUserPlus}/> SignUp</Link>
                                    </li>
                                </ul>
                            </div>
                            }
                    </div>
                </div>
            </nav>
        );
}
export default Navbar