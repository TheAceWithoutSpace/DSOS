import React, { Component } from'react'
import axios from 'axios'
import AdminCompNav from "./AdminCompNav"

class Bug_report extends Component{
    constructor(props){
        super(props);
        this.state={
            Users:[]
        }
    }
    componentDidMount()
    {
        axios.get("http://localhost:3000/users/")
        .then((res)=>this.setState({Users:res.data}));
    }
    PromoteToArchitect(data){
         let Architect={Architect:data.Architect}
        axios.post(`http://localhost:3000/users/Architect/${data.id}`,Architect)
        .then(()=>axios.get("http://localhost:3000/users/")
                .then((res)=>this.setState({Users:res.data})))
    }
    UserTable(){
        return this.state.Users.map(currentUser=>{
            if(currentUser.Admin){
                return(
                    <tr key={currentUser._id} className="table-primary">
                        <td>{currentUser._id}</td>
                        <td>
                            <svg width="1.5em" height="1em" viewBox="0 0 16 16" className="bi bi-star-fill" fill="rgba(219, 190, 70, 0.72)" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                            </svg>
                            {currentUser.username}</td>
                        <td>{currentUser.email}</td>
                        <td>{currentUser.Nickname}</td>
                        <td>{currentUser.Team}</td>
                        <td>{' '}</td>
                    </tr>
                )
            }else if(currentUser.Architect){
                return(
                    <tr key={currentUser._id} style={{backgroundColor:"rgb(253, 251, 220)"}}>
                        <td>{currentUser._id}</td>
                        <td>{currentUser.username}</td>
                        <td>{currentUser.email}</td>
                        <td>{currentUser.Nickname}</td>
                        <td>{currentUser.Team}</td>
                        <button onClick={()=>this.PromoteToArchitect({Architect:false,id:currentUser._id})}
                        className="btn btn-outline-danger">deomote to User</button>
                    </tr>
                    )       
                }else{
                    return(
                        <tr key={currentUser._id} style={{backgroundColor:"rgba(220, 253, 234, 0.51)"}}>
                            <td>{currentUser._id}</td>
                            <td>{currentUser.username}</td>
                            <td>{currentUser.email}</td>
                            <td>{currentUser.Nickname}</td>
                            <td>{currentUser.Team}</td>
                            <button onClick={()=>this.PromoteToArchitect({Architect:true,id:currentUser._id})}
                            className="btn btn-outline-info">promote to Architect</button>
                        </tr>
                    )
                }
        })
   }
    render(){
        return(
            <>
            <div className="cuntiner-fluid ">
                <div className="row">
                    <div id="sidebarMenu" className="col-md-2 col-lg-2 d-md-block sidebar collapse">
                        <AdminCompNav User={this.props.User}/>
                    </div>
                    <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4 bg-white">
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                            <h1 className="h2">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-people-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                                </svg>
                                {" Users"}
                            </h1>  
                        </div>
                        <div className="row d-flex justify-content-center">
                            <div className="col-md-11">
                            <div className="table-responsive ">
                                    <table className="table table-hover table-sm">
                                        <thead style={{backgroundColor:"rgba(20, 16, 200, 0.20)"}}>
                                            <tr>
                                                <th scope="col">NUMBER</th>
                                                <th scope="col">Username</th>
                                                <th scope="col">email</th>
                                                <th scope="col">nickname</th>
                                                <th scope="col">Team</th>
                                                <th scope="col"> {" "}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.UserTable()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            </>
        )
    }
}
export default Bug_report
