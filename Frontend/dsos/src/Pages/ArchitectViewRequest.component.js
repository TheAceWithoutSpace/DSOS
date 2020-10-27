import React,{Component}from 'react';
import axios from 'axios';
import SystemGrath from '../components/SystemGrafth.component'
import { withRouter } from "react-router-dom";
import Massage from '../components/Message'

class ArcitectPage extends Component{
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
        }
        this.UptateStatus=this.UptateStatus.bind(this);
    }
    getMessage(message)
    {
        this.setState({message:message})
    }

    UptateStatus(status){
        const Status={status:status};
        if(status==='Accepted')
        {
            if(this.state.type==="Aggregate"){
                const Aggregate={
                    Name:this.state.Name.A,
                    Amount:this.state.Amount,
                    location:this.state.Name.V,
                }
                console.log(Aggregate)
                const AggreStorageTotal={AggreStorageTotal:this.state.Amount}
                let ts=Date.now()
                let date_ob = new Date(ts);
                let month = date_ob.getMonth() + 1;
                let year = date_ob.getFullYear();
                axios.post(`http://localhost:3000/MonthDateRoute/AggreStorageTotal/${month}.${year}`,AggreStorageTotal)
                axios.post(`http://localhost:3000/AGGREGATE/add`,Aggregate)
                 .then(res=>{console.log(res)
                })
                
            }
            else if(this.state.type==="Svm"){
                const Svm={
                    Name:this.state.Name.S,
                    AGGREGATE:this.state.Name.A,
                    File:this.state.File,
                }
                axios.post("http://localhost:3000/SvmRoute/add",Svm)
                .then(res=>{console.log(res.data)
                })
            }
            else if(this.state.type==="volume"){
                const Volume={
                    name:this.state.Name.V,
                    Amount:this.state.Amount,
                    Svm:this.state.Name.S,
                    Aggregate:this.state.Name.A,
                }
                const Amount={Amount:this.state.Amount}
                const AggreStorageUsegeAmmount={AggreStorageUsegeAmmount:this.state.Amount}
                let ts=Date.now()
                let date_ob = new Date(ts);
                let month = date_ob.getMonth() + 1;
                let year = date_ob.getFullYear();
                axios.post(`http://localhost:3000/MonthDateRoute/AggreStorageUsegeAmmount/${month}.${year}`,AggreStorageUsegeAmmount)
                axios.post("http://localhost:3000/VolumeRoute/add",Volume)
                .then(res=>{
                    axios.post(`http://localhost:3000/SvmRoute/Amount/${this.state.Name.S}`,Amount)
                    .then((res)=>{
                        axios.post(`http://localhost:3000/AGGREGATE/Amount/${this.state.Name.A}`,Amount)
                    })
                })
            }
        }
        axios.post(`http://localhost:3000/Request/status/${this.props.match.params.id}`,Status)
        .then(res=>{
            this.props.history.push("/Architect");
        })
    }
    componentDidMount(){
        //getRequestByID
        axios.get(`http://localhost:3000/Request/${this.props.match.params.id}`)
        .then(res=>{console.log(res.data)
            this.setState({
                username:res.data.Req.username,
                email:res.data.Req.email,
                Name:{A:res.data.Req.Name.A,S:res.data.Req.Name.S,V:res.data.Req.Name.V},
                Amount:res.data.Req.Amount,
                File:res.data.Req.File,
                type:res.data.Req.type,
                key:res.data.Req._id
            });
        })
    }
    
    render(){
        let SVMS=[];
        SVMS[0]=this.state.Svm
        let downlodURI=`http://localhost:3000/File/${this.state.File}`;
        if(this.state.type==='Aggregate')
        {
            return(
                <div className="card text-center">
                   <div className="card-header">
                   {this.state.type} Request
                   </div>
                   <div className='row'>
                       <div className="col-md-6">
                               <div className="card-body">
                               <h5 className="card-title">{this.state.username}</h5>
                               <p className="card-text">Email:{this.state.email}<br/>{this.state.type}:{this.state.Name.A}
                               <br/>Total Aggregate Storage: {this.state.Amount}gb<br/>
                               Location: {this.state.Name.V}
                               </p>

                               {/* <a href={downlodURI} className='btn btn-primary' download>Download File</a> */}
                           </div>
                       </div>
                       {/* <SystemGrath SVMS={SVMS}/> */}
                   </div>
                   <div className="card-footer text-muted">
                       <div className="row d-flex justify-content-around">
                           <button onClick={()=>this.UptateStatus('Accepted')}className="btn btn-outline-success  col-md-4">Accept</button>
                           <button onClick={()=>this.UptateStatus('Decline')}className="btn btn-outline-danger   col-md-4">Decline</button>
                       </div>
                    </div>
               </div>
           )
        }else if(this.state.type==="Svm"){
        return(
        <div className="card text-center">
            <div className="card-header">
            {this.state.type} Request
            </div>
            <div className='row'>
                <div className="col-md-6">
                        <div className="card-body">
                        <h5 className="card-title">{this.state.username}</h5>
                        <p className="card-text">Email:{this.state.email}<br/>{this.state.type}:{this.state.Name.S}</p>
                        <a href={downlodURI} className='btn btn-primary' download>Download File</a>
                    </div>
                </div>
                {/* <SystemGrath SVMS={SVMS}/> */}
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
                                <br/>Amount of storage that is needed: {this.state.Amount}GB </p>
                                <a href={downlodURI} className='btn btn-primary' download>Download File</a>
                            </div>
                        </div>
                        <SystemGrath Aggre={this.state.Name.A} Amount={this.state.Amount} getMessage={(message)=>this.getMessage(message)}/>
                    </div>
                    <div className="card-footer text-muted">
                        <div className="row d-flex justify-content-around">
                            <button onClick={()=>this.UptateStatus('Accepted')}className="btn btn-outline-success  col-md-4">Accept</button>
                            <button onClick={()=>this.UptateStatus('Decline ')}className="btn btn-outline-danger   col-md-4">Decline</button>
                        </div>
                     </div>
                </div>
                )
        }
        else{
            return(
                <div>Loading ...</div>
            )
        }
        
    }
}

export default withRouter(ArcitectPage)