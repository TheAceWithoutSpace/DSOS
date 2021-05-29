import React, { Component } from'react'
import axios from 'axios'
import AdminCompNav from "./AdminCompNav"
import StorageGraft from '../StorageGraft'
import LoadingAnimation from "../Loading"
// display to the admin the status of the storage 
class StorageView extends Component{
    constructor(props){
        super(props);
        this.state={
            Aggregate:[],
            message:'',
            flags:[],
            show:'',
            Tflag:false
        }
    }
    componentDidMount()
    {
        let flags=[];
        // get all the aggregates
        axios.get(`Aggregate/`)
        .then((res)=>{
            console.log(res);
        res.data.res.forEach(Aggre => {
            flags.push(false)
        });
        this.setState({Aggregate:res.data.res,flags:flags,Tflag:true})
        });
    }
    getMessage(data)
    {
        this.setState({message:data.message,presentage:data.presentage})
    }
    getuptodateServerData(){
        this.setState({Tflag:false,show:'disabled'})
        axios.get('getData').then((res)=>{
            console.log(res)
            this.setState({Tflag:true,show:''})
        })
    }
    //onclick of the aggregate the StorageGraft is opend and display the the status of the capacity of the aggregate 
    onclick(index){
        let tempflag=this.state.flags;
        let el = document.getElementById(index);
        if( el.className==='collapse'){
            el.className='collapse show';
            tempflag[index]=true;
        }else{
            el.className='collapse'
            tempflag[index]=false;
        }
        console.log(this.state.flags)
        this.setState({flags:tempflag})
    }
    // create an aggregate table 
    AggregateTable(){
        return this.state.Aggregate.map((currentAggre,index)=>{
            console.log(currentAggre);
            return(
                <>
                    <tr key={`button`} onClick={()=>{this.onclick(index)}} >
                        <td>{index+1}</td>
                        <td>{currentAggre.Name}</td>
                        <td>{currentAggre.locationstring}</td>
                        <td>{currentAggre.total+'GB'}</td>
                        <td>{currentAggre.used+'GB'}</td>
                        <td>{parseInt((currentAggre.used/currentAggre.total)*100)+"%"}</td>
                    </tr>
                    <tr id={index} className="collapse">
                    {/* scope="row" */}
                        {this.state.flags[index]?
                           <> 
                            <td colSpan="7">    
                            <StorageGraft Aggre={currentAggre.Name}/>
                                  {/* <SystemGrath Aggre={currentAggre.name} Amount={currentAggre.Amount} getMessage={(message)=>this.getMessage(message)}/> */}
                            </td>
                            </>
                        :null}
                    </tr>
                </>
                   )
                })
            }
            // render the table
    render(){
        console.log(this.state.Tflag)
        return(
            <>
            <div className="cuntiner-fluid ">
                <div className="row">
                    <div id="sidebarMenu" className="col-md-2 col-lg-2 d-md-block sidebar collapse">
                        <AdminCompNav User={this.props.User} />
                    </div>
                    <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                            <h1 className="h2">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-bookshelf" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M2.5 0a.5.5 0 0 1 .5.5V2h10V.5a.5.5 0 0 1 1 0v15a.5.5 0 0 1-1 0V15H3v.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5zM3 14h10v-3H3v3zm0-4h10V7H3v3zm0-4h10V3H3v3z"/>
                                </svg>
                                {" Storage View"}
                            </h1>
                            <button disabled={!this.state.Tflag} onClick={()=>this.getuptodateServerData()} className={`btn btn-info${this.state.show}`}> Get UpToDate Data</button>  
                        </div>
                        {this.state.Tflag?
                        <div className="row d-flex justify-content-center">
                            <div className="col-md-11">
                            <div className="table-responsive">
                                    <table className="table table-hover table-sm">
                                        <thead style={{backgroundColor:"rgba(20, 16, 200, 0.20)"}}>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Name</th>
                                                <th scope="col">location</th>
                                                <th scope="col">Total capacity</th>
                                                <th scope="col">Allocated ammount</th>
                                                <th scope="col">Allocated ammount in %</th>
                                            </tr>
                                        </thead>
                                            <tbody>
                                            {this.AggregateTable()}
                                            </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>:<LoadingAnimation/>}
                    </main>
                </div>
            </div>

            </>
        )
    }
}
export default StorageView
