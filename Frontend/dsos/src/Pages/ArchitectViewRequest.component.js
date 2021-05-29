import React,{Component}from 'react';
import axios from 'axios';
import SystemGrath from '../components/ArchitectComponents/SystemGraft'
import { withRouter } from "react-router-dom";
import Massage from '../components/Message'
import LoadingAnimation from "../components/Loading"

class ArcitectViewRequset extends Component{
    constructor(props){
        super(props);
        this.state={
            username:'',
            email:'',
            Name:{A:'',S:'',V:''},
            File:'',
            Amount:'',
            type:'',
            message:'',
            presentage:'',
        }
        this.UptateStatus=this.UptateStatus.bind(this);
    }
    getMessage(data)
    {
        //display a message to the Architect if he can accept new requests and the capacity of the svm inside the aggregate
        console.log(data);
        this.setState({message:data.message,presentage:data.presentage})
    }

    async UptateStatus(status){
        //update the request status by Architect decision (accepded/denied)
        const Status={status:status};
        if(status==='Accepted')
        {
            if(this.state.type==="Svm"){
                console.log(this.state.Name)
                const Svm={
                    Cluster:this.state.Name.C,
                    env:this.state.Location,
                    aggregate:this.state.Name.A,
                    Name:this.state.Name.S,
                    total:0,
                    used:0,
                    available:0,
                    full:0,
                    dedupeCapSaved:0,
                    VolumeCount:0,
                }
                //create a new Svm 
                await axios.post("SvmRoute/add",Svm)
                .then(res=>{console.log(res.data)
                })
            }
            else if(this.state.type==="volume"){
                const Volume={
                    Cluster:this.state.Name.C,
                    env:this.state.Location,
                    aggregate:this.state.Name.A,
                    svm:this.state.Name.S,
                    Name:this.state.Name.V,
                    total:this.state.Amount,
                    used:0,
                    available:0,
                    dedupeCapSaved:0, 
                }
                const StorageUsegeAmmount={AggreStorageUsegeAmmount:this.state.Amount}
                let ts=Date.now()
                let date_ob = new Date(ts);
                let day= date_ob.getDate();
                let month = date_ob.getMonth() + 1;
                let year = date_ob.getFullYear();
                //create a new volume
                await axios.post("VolumeRoute/add",Volume)
                .then(async(res)=>{
                    //update the new volume allocation
                    await axios.post(`MonthDateRoute/StorageUsegeAmmount/${month}-${day}-${year}`,StorageUsegeAmmount)
                })
            }
        }
        //update the status of the request
        await axios.post(`Request/status/${this.props.match.params.id}`,Status)
        .then((res)=>{
            this.props.history.push("/Architect");
        })
    }
    componentDidMount(){
        //getRequestByID
        axios.get(`Request/${this.props.match.params.id}`)
        .then(res=>{console.log(res.data.res)
            this.setState({
                username:res.data.res[0].username,
                email:res.data.res[0].email,
                Name:{C:res.data.res[0].Name.C,A:res.data.res[0].Name.A,S:res.data.res[0].Name.S,V:res.data.res[0].Name.V},
                Location:res.data.res[0].Location,
                Amount:res.data.res[0].Amount,
                File:res.data.res[0].File,
                type:res.data.res[0].type,
                key:res.data.res[0]._id
            });
        })
    }
    
    render(){
        let SVMS=[];
        SVMS[0]=this.state.Svm
        let downlodURI=`File/${this.state.File}`
        if(this.state.type==="Svm"){
        //display the svm card
        return(
        <div className="card text-center">
            <div className="card-header">
            {this.state.type} Request
            </div>
            <div className='row'>
                <div className='col-md-3'></div>
                <div className="col-md-6">
                        <div className="card-body">
                        <h5 className="card-title">{this.state.username}</h5>
                        <p className="card-text">Email:{this.state.email}
                        <br/>{this.state.type}:{this.state.Name.S}
                        <br/><br/>location : {this.state.Location}\..\..\{this.state.Name.A}\{this.state.Name.S}
                        </p>
                        <a href={downlodURI} className='btn btn-primary' download>Download File</a>
                    </div>
                </div>
                <div className='col-md-3'></div>
            </div>
            <div className="card-footer text-muted">
                <div className="row d-flex justify-content-around">
                    <button onClick={()=>this.UptateStatus('Accepted')}className="btn btn-outline-success  col-md-4">Accept</button>
                    <button onClick={()=>this.UptateStatus('Decline')}className="btn btn-outline-danger   col-md-4">Decline</button>
                </div>
             </div>
        </div>
        )
        }else if(this.state.type==="volume"){
            //display the volume card
            return(        
                <div className="card text-center">
                    {this.state.message?<Massage msg={this.state.message}/>:''}
                    <div className="card-header">
                    {this.state.type} Request
                    </div>
                    <div className='row'>
                        <div className="col-md-6">
                                <div className="card-body">
                                <h5 className="card-title">{this.state.username}</h5>
                                <p className="card-text">Email:{this.state.email}<br/>{this.state.type}: {this.state.Name.V}
                                <br/>location :{this.state.Location}\..\..\{this.state.Name.A}\{this.state.Name.S}
                                <br/>Amount of storage that is needed: {this.state.Amount}GB </p>
                                <a href={downlodURI} className='btn btn-primary' download>Download File</a>
                            </div>
                        </div>
                        <SystemGrath Aggre={this.state.Name.A} Amount={this.state.Amount} getMessage={(message)=>this.getMessage(message)}/>
                    </div>
                    <div className="card-footer text-muted">
                        <div className="row d-flex justify-content-around">
                            {this.state.presentage>140
                            ?
                            <button className="btn btn-outline-success disabled col-md-4">Accept</button>
                            :
                            <button onClick={()=>this.UptateStatus('Accepted')}className="btn btn-outline-success  col-md-4">Accept</button>
                            }
                            <button onClick={()=>this.UptateStatus('Decline')}className="btn btn-outline-danger   col-md-4">Decline</button>
                        </div>
                     </div>
                </div>
                )
        }
        else{
            return(<LoadingAnimation/>
            )
        }
        
    }
}

export default withRouter(ArcitectViewRequset)