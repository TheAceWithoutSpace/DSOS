import React,{Component}from 'react';
import axios from 'axios';
import Progress from '../components/Progress'
import Message from '../components/Message'
import {withRouter}from 'react-router-dom'


class createRequest extends Component{
    
    constructor(props){
        super(props);
        this.handleChangeAggre=this.handleChangeAggre.bind(this);
        this.handleChangeCluster=this.handleChangeCluster.bind(this);
        this.setSelectedFile=this.setSelectedFile.bind(this);
        this.onclicked=this.onclicked.bind(this);
        this.onChangeSvm=this.onChangeSvm.bind(this);
        this.list=this.list.bind(this);
        this.onsubmit=this.onsubmit.bind(this);
        
        this.state={
            Name:'',
            File:'',
            Amount:'',
            uploadPercentage:0,
            message:'',
            flag:false,
            Svm:'',
            location:'',
            Cluster:'',
            Aggre:'',
            AggregateArray:'',
            NewFlag:false,
        }
    }
    componentDidMount(){
        axios.get('Aggregate/')
        .then((res)=>this.setState({AggregateArray:res.data}))
    }
    // handeling form fields
    setSelectedFile(e){
        this.setState({
            File:e.target.files[0]
        });
    }
    handleChangeAggre(e){
        console.log(this.state.AggregateArray[e.target.value])
        this.setState({
            Aggre:this.state.AggregateArray[e.target.value].name,
            location:this.state.AggregateArray[e.target.value].location
        });
    }
    handleChangeCluster(e){

    }
    onChangeSvm(e){
        this.setState({
            Svm:e.target.value
        });
    }
    onclicked(e){
        this.setState({flag:true})
    }
    // submiting the form and creating new user in the server
    onsubmit=async(e)=>{
        e.preventDefault();
        this.onclicked();
        const FileID=await this.upload(this.state.File);
        console.log(FileID);
        const Request={
            userID:JSON.parse(localStorage.getItem('user'))._id,
            username:JSON.parse(localStorage.getItem('user')).U,
            email:JSON.parse(localStorage.getItem('user')).E,
            Name:{C:this.state.Cluster,A:this.state.Aggre,S:this.state.Svm,V:'11'},
            Location:this.state.location,
            Amount:0,
            File:FileID,
            status:'pending',
            type:'Svm'
        }

        console.log(Request);
        let ts=Date.now()
        let date_ob = new Date(ts);
        let day= date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        await axios.post('Request/add',Request)
            .then(async(res)=>{
                await axios.post(`MonthDateRoute/StorageRequests/${month}-${day}-${year}`)
                this.setState({message:"Request send"})
                 this.props.history.push("/Home");
            })
            .catch(err=>{this.setState({message:"Error"+err})});
    }
    upload= async e=>{
        // e.preventDefault();
        const formData=new FormData();
        formData.append('file',e);
        if(e)
        {
            try{
                  const res=await axios.post('File/upload',formData,{
                    headers:{
                      'content-Type':'multipart/form-data'
                    },
                    onUploadProgress:ProgressEvent=>{
                        console.log(ProgressEvent);
                            console.log()
                            this.setState({uploadPercentage:(parseInt((ProgressEvent.loaded/ProgressEvent.total)*100))});
                    }
                  });
                  return(res.data.file.filename);
          }catch(err){
            console.log (err)
          }
        }
    }
    list(){
        if(this.state.AggregateArray)
        {
            return(
                this.state.AggregateArray.map((CurrentAggre,index)=>{
                    if(CurrentAggre.Amount===0)
                        {   
                            return(
                            <option key={CurrentAggre._id} value={index} >
                                Name:{CurrentAggre.name}--Location:{CurrentAggre.location}--Free:100%
                            </option>
                            )
                        }else{
                            return(
                                <option key={CurrentAggre._id} value={index}>Name:{CurrentAggre.name}--
                                Location:{CurrentAggre.location}--Free:{((CurrentAggre.Amount/CurrentAggre.TotalAmount)*-100)+100}%
                                </option>
                                )
                        }
                    }

                ))
        }
        else{return null}
    }
    listCluster(){

    }
    // rendering the formn
    render(){
        return(
            <div className="container">
                {this.state.message?<Message msg={this.state.message}/>:''}
                <div className="row">
                    <div className="col-md-6 m-auto">
                    <h3 className="text-center display-4 my-4">New Svm Request</h3>
            <form onSubmit={this.onsubmit}>
            <div className="form-group  mb-3">
                    <label>Svm Name:</label>
                    <input type='text' required 
                    className="form-control" value={this.state.Svm}
                    onChange={this.onChangeSvm}/>
                </div>
                <div className="form-group mb-3">
                <div>
                    <div className='custom-file mb-4'>
                        <input type="file" className='custom-file-input' id='customFile' required onChange={this.setSelectedFile}/>
                        <label className='custom-file-label' htmlFor='customFile'>
                        {this.state.File.name?this.state.File.name:'Upload File'}
                        </label>
                    </div>
                        <Progress percentage={this.state.uploadPercentage}/>
                    </div>
                </div>
                <div className="form-group">
                    <label>Cluster Name:</label>
                    <select className="custom-select" required value={this.state.Cluster} onChange={this.handleChangeCluster}>
                    <option value="" defaultValue disabled>--chose Cluster--</option> 
                        {this.listCluster()}
                    </select>
                </div>
                <div className="form-group">
                    <label>Aggregate Name:</label>
                    <select className="custom-select" required value={this.state.Aggre} onChange={this.handleChangeAggre}>
                    <option value="" defaultValue disabled>--chose Aggregate--</option> 
                        {this.list()}
                    </select>
                </div>
                {this.state.flag===false?
                <div>
                    <button type="submit" className="btn btn-outline-primary btn-block">Send Request</button>     
                </div>
                :
                <button className="btn btn-outline-primary btn-block" type="button" disabled>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Loading...
                </button>
                }

            </form>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(createRequest) 

