import React, { Component } from'react'
import axios from 'axios'
import AdminCompNav from "./AdminCompNav"

class StorageView extends Component{
    constructor(props){
        super(props);
        this.state={
            AGGREGATE:[]
        }
    }
    componentDidMount()
    {
        axios.get(`http://localhost:3000/AGGREGATE/`)
        .then((res)=>this.setState({AGGREGATE:res.data}));
    }
    AGGREGATETable(){
        return this.state.AGGREGATE.map(currentAggre=>{
            console.log(currentAggre)
            return(
                <tr key={currentAggre._id}>
                    <td>{currentAggre.name}</td>
                    <td>{currentAggre.location}</td>
                    <td>{currentAggre.TotalAmount+'GB'}</td>
                    <td>{currentAggre.Amount+'GB'}</td>
                    <td>{parseInt((currentAggre.Amount/currentAggre.TotalAmount)*100)+"%"}</td>
                    <td>{currentAggre.date.substr(0,10)}</td>
                </tr>
                   )
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
                                                <th scope="col">Name</th>
                                                <th scope="col">location</th>
                                                <th scope="col">Total capacity</th>
                                                <th scope="col">Allocated ammount</th>
                                                <th scope="col">Allocated ammount in %</th>
                                                <th scope="col"> Creation date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.AGGREGATETable()}
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
export default StorageView
