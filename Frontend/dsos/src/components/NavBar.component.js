import React from 'react';
import {Link} from 'react-router-dom';

function Navbar(props){
        return(
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark ">
                {props.User._id? 
                    <>{props.User.Admin?<Link to='/Admin' className="navbar-brand mb-0 h1 nav-link">DSOS</Link>
                        :<>{props.User.Architect?<Link to='/Architect' className="navbar-brand mb-0 h1 nav-link">DSOS</Link>
                            :<Link to='/Home' className="navbar-brand mb-0 h1 nav-link">DSOS</Link>}
                        </>}
                    </>
                :<Link to='/SignIN' className="navbar-brand mb-0 h1 nav-link">DSOS</Link>}
                
                <div className="collpase navbar-collapse">  
                    {props.User._id?//@IF loggedin
                        <div>
                            {/* @if Admin(Admin is also Arcitect) */}
                            {props.User.Admin?
                            <>
                                <ul className="navbar-nav mr-auto">
                                <li className='navbar-item'>
                                    <Link to ='/admin' className='nav-link'>Admin</Link>
                                </li>
                                <li className='navbar-item'>
                                    <Link to ='/Architect' className='nav-link'>Architect</Link>
                                </li>
                                <li className='navbar-item'>
                                    <Link to ='/SignIn' onClick={()=>{props.setUser('')}} className='nav-link'>logout</Link>
                                </li>
                                </ul>
                            </>
                                ://@ElseIF Architect
                                <div>{props.User.Architect?
                                    <>
                                    <ul className="navbar-nav mr-auto">
                                        {/* <li className="navbar-item">
                                            <Link to ='/Home' className='nav-link'>HomePage</Link>
                                        </li> */}
                                        <li className='navbar-item'>
                                            <Link to ='/Architect' className='nav-link'>Architect</Link>
                                        </li>
                                        <li className='navbar-item'>
                                            <Link to ='/SignIn' onClick={()=>{props.setUser('')}} className='nav-link'>logout</Link>
                                        </li>    
                                    </ul>
                                    </>
                                    ://@Else The User is a client (Architect&&Admin ==false)   
                                    <>
                                    <ul className="navbar-nav mr-auto">
                                        <li className="navbar-item">
                                            <Link to ='/Home' className='nav-link'>Home</Link>
                                        </li>
                                        <li className='navbar-item'>
                                            <Link to={{pathname:"/RequsetAggre" ,aboutProps:{User:props.User}}} className="nav-link">Aggregate Request</Link>
                                        </li>
                                        <li className='navbar-item'>
                                            <Link to={{pathname:"/RequsetSvm" ,aboutProps:{User:props.User}}} className="nav-link">Svm Request </Link>
                                        </li>  
                                        <li className='navbar-item'>
                                            <Link to={{pathname:"/RequestVolume" ,aboutProps:{User:props.User}}} className="nav-link">Volume Request</Link>
                                        </li>  
                                        <li className='navbar-item'>
                                            <Link to={{pathname:"/Bug" ,aboutProps:{User:props.User}}} className="nav-link">
                                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-bug" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A4.979 4.979 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A4.985 4.985 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623zM4 7v4a4 4 0 0 0 3.5 3.97V7H4zm4.5 0v7.97A4 4 0 0 0 12 11V7H8.5zM12 6H4a3.99 3.99 0 0 1 1.333-2.982A3.983 3.983 0 0 1 8 2c1.025 0 1.959.385 2.666 1.018A3.989 3.989 0 0 1 12 6z"/>
                                                </svg>
                                                {" Report Bug"}
                                            </Link>
                                        </li>  
                                        <li className='navbar-item'>
                                            <Link to ='/SignIn' onClick={()=>{props.setUser('')}} className='nav-link'>logout</Link>
                                        </li>    
                                    </ul>
                                    </>
                                }</div>
                            }
                        </div>
                        ://@Else
                        <>
                        <ul className="navbar-nav mr-auto">   
                            <li className='navbar-item'>
                                <Link to ='/SignIN' className='nav-link'>SignIn</Link>
                            </li>
                        </ul>
                        </>
                        }
                </div>
            </nav>
        );
}
export default Navbar