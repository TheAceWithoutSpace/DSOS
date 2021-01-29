import React,{Component}from 'react';
import axios from 'axios';
import Progress from '../components/Progress'
import Message from '../components/Message'
import {withRouter}from 'react-router-dom'


class createRequest extends Component{
    
    constructor(props){
        super(props);
        this.onChangeVolume=this.onChangeVolume.bind(this);
        this.setSelectedFile=this.setSelectedFile.bind(this);
        this.handleChangeCluster=this.handleChangeCluster.bind(this);
        this.onChangeAmount=this.onChangeAmount.bind(this);
        this.onclicked=this.onclicked.bind(this);
        this.handleChangeSvm=this.handleChangeSvm.bind(this);
        this.handleChangeAggregate=this.handleChangeAggregate.bind(this);
        this.Aggrelist=this.Aggrelist.bind(this);
        this.Svmlist=this.Svmlist.bind(this);
        this.onsubmit=this.onsubmit.bind(this);
        
        this.state={
            volume:'',
            File:'',
            Amount:'',
            uploadPercentage:0,
            message:'',
            Svm:'',
            Cluster:'',
            Aggregate:'',
            location:'',
            AggregateArray:'',
            SvmArray:'',
            flag:false,
            NewFlag:false
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
    onChangeAmount(e){
        this.setState({
            Amount:e.target.value
        })
    }
    onChangeVolume(e){
        this.setState({
            volume:e.target.value
        });
    }
    handleChangeSvm(e){
        console.log(e.target.value)
        this.setState({
            Svm:e.target.value
        })
    }
    handleChangeAggregate(e){
        this.setState({
            Aggregate:this.state.AggregateArray[e.target.value].name,
            location:this.state.AggregateArray[e.target.value].location
        })
        console.log(this.state.AggregateArray[e.target.value].name)
        axios.get(`SvmRoute/SvmByAggreName/${this.state.AggregateArray[e.target.value].name}`)
        .then((res)=>{console.log(res.data)
            this.setState({SvmArray:res.data})})
    }
    handleChangeCluster(e){

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
        // const User=JSON.parse(localStorage.getItem('user'));
        const Request={
            userID:JSON.parse(localStorage.getItem('user'))._id,
            username:JSON.parse(localStorage.getItem('user')).U,
            email:JSON.parse(localStorage.getItem('user')).E,
            Name:{C:this.state.Cluster,A:this.state.Aggregate,S:this.state.Svm,V:this.state.volume},
            Amount:this.state.Amount,
            File:FileID,
            Location:this.state.location,
            status:'pending',
            type:'volume'
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
                        this.setState({uploadPercentage:(parseInt((ProgressEvent.loaded/ProgressEvent.total)*100))});
                    }
                  });
                  return(res.data.file.filename);
          }catch(err){
            console.log (err)
          }
        }
    }
    listCluster(){

    }
    Aggrelist(){
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
    Svmlist(){
        if(this.state.SvmArray)
        {
            return(
                this.state.SvmArray.map((CurrentSvm)=>{
                    return(
                        <option key={CurrentSvm._id} value={CurrentSvm.name}>{CurrentSvm.name}</option>
                    )}
                ))
        }
        else{return null}
    }
    
    // rendering the formn
    render(){
        return(
            <div className="container">
                {this.state.message?<Message msg={this.state.message}/>:''}
                <div className="row">
                    <div className="col-md-6 m-auto">
                    <h3 className="text-center display-4 my-4">Request</h3>
            <form onSubmit={this.onsubmit}>
            <div className="form-group">
                    <label>VolumeName:</label>
                    <input type='text' required
                    className="form-control" value={this.state.volume}
                    onChange={this.onChangeVolume}/>
                </div>
                <div className="form-group  mb-3">
                    <label>Amount in (GB):</label>
                    <input type='number' required min="0"
                    className="form-control" value={this.state.Amount}
                    onChange={this.onChangeAmount}/>
                </div>
                <div className="form-group mb-3">
                <div>
                    <div className='custom-file mb-4'>
                        <input type="file" className='custom-file-input' id='customFile' required onChange={this.setSelectedFile}/>
                        <label className='custom-file-label' htmlFor='customFile'>
                        {this.state.File.name}
                        </label>
                    </div>
                        <Progress percentage={this.state.uploadPercentage}/>
                    </div>
                </div>
                <div className="form-group">
                    <label>Cluster Name:</label>
                    <select className="custom-select" required value={this.state.Cluster} onChange={this.handleChangeCluster}>
                        <option disabled defaultValue value={''}> -- select an option -- </option>
                            {this.listCluster()}
                    </select>
                </div>
                <div className="form-group">
                    <label>Aggregate Name:</label>
                    <select className="custom-select" required value={this.state.Aggregate} onChange={this.handleChangeAggregate}>
                        <option disabled defaultValue value={''}> -- select an option -- </option>
                            {this.Aggrelist()}
                    </select>
                </div>
                {this.state.SvmArray?
                <>
                <div className="form-group">
                    <label>Svm Name:</label>
                    <select className="custom-select" required value={this.state.Svm} onChange={this.handleChangeSvm}>
                        <option disabled defaultValue value={''}> -- select an option -- </option>
                        {this.Svmlist()}
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
                </>
                :
                <input type="text" readOnly className="form-control-plaintext" id="staticEmail" value="you most chose Aggregate" />
                }
            </form>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(createRequest) 

