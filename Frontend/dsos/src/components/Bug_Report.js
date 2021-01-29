import React, { Component } from'react'
import axios from 'axios'
import AdminCompNav from "./AdminCompNav"

class Bug_report extends Component{
    constructor(props){
        super(props);
        this.state={Bugs:[],reload:0,Treload:1,Tflag:false}
    }
    componentDidMount(){
        axios.get(`Bug/`)
        .then((res)=>{
            console.log(res)
            if(!res.data.err)
            {
                this.setState({Bugs:res.data,Tflag:true})
            }
        })
    }
    async UptateStatus(status){
        const Status={status:status.s};
        console.log(status)
        axios.post(`Bug/status/${status.id}`,Status)
            .then(async()=>await window.location.reload())
    }
    BugTable(){
        return this.state.Bugs.map((CurrentBug,index)=>{
            const status=CurrentBug.status;
            const downloadURI=`File/${CurrentBug.File}`;
            return((status==="pending")?
                        <tr key={CurrentBug._id}>
                            <td>{index+1}</td>
                            <td>{CurrentBug.username}</td>
                            <td>{CurrentBug.email}</td>
                            <td>{CurrentBug.Description}</td>
                            {CurrentBug.File? <td><a href={downloadURI} className="btn btn-success" download>download</a></td>:<td></td>}
                            <td><button onClick={()=>this.UptateStatus({s:'Complited',id:CurrentBug._id})}className="btn btn-outline-info">Complited</button></td>
                        </tr>:<tr key={CurrentBug._id}>
                                <td><del>{CurrentBug._id}</del></td>
                                <td><del>{CurrentBug.username}</del></td>
                                <td><del>{CurrentBug.email}</del></td>
                                <td><del>{CurrentBug.Description}</del></td>
                                {CurrentBug.File? <td>
                                    <del><a href={downloadURI} className="btn btn-success" download>download</a></del></td>:<td></td>}
                                <td>
                                    <button onClick={()=>this.UptateStatus({s:'pending',id:CurrentBug._id})}className="btn btn-outline-warning">Undo</button>
                                    |<button onClick={()=>axios.delete(`Bug/${CurrentBug._id}`).then(async()=>{await window.location.reload()})}className="btn btn-outline-danger">delete</button>
                                </td>
                            </tr>)
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
                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-bug" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A4.979 4.979 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A4.985 4.985 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623zM4 7v4a4 4 0 0 0 3.5 3.97V7H4zm4.5 0v7.97A4 4 0 0 0 12 11V7H8.5zM12 6H4a3.99 3.99 0 0 1 1.333-2.982A3.983 3.983 0 0 1 8 2c1.025 0 1.959.385 2.666 1.018A3.989 3.989 0 0 1 12 6z"/>
                                </svg>{" Bug Reports"}
                            </h1>  
                        </div>
                        {this.state.Tflag?
                        <div className="row d-flex justify-content-center">
                            <div className="col-md-11">
                                <div className="table-responsive ">
                                    <table className="table table-hover table-sm">
                                        <thead style={{backgroundColor:"rgba(20, 16, 200, 0.20)"}}>
                                            <tr>
                                                <th scope="col"> Bug NUMBER</th>
                                                <th scope="col">Username</th>
                                                <th scope="col">email</th>
                                                <th scope="col">Description</th>
                                                <th scope="col">Download</th>
                                                <th scope="col">{" "}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.BugTable()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>:
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>}
                    </main>
                </div>
            </div>
            </>
        )
    }
}
export default Bug_report
