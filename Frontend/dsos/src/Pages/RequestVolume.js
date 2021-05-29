import React,{Component}from 'react';
import axios from 'axios';
import Progress from '../components/Progress'
import Message from '../components/Message'
import {withRouter}from 'react-router-dom'
import Modal from "../components/Modle"
import ExempleDoc from '../Documents/Hydragen Form.docx'

class createRequest extends Component{
    
    constructor(props){
        super(props);
        this.onChangeVolume=this.onChangeVolume.bind(this);
        this.setSelectedFile=this.setSelectedFile.bind(this);
        this.onChangeAmount=this.onChangeAmount.bind(this);
        this.onclicked=this.onclicked.bind(this);
        this.handleChangeSvm=this.handleChangeSvm.bind(this);
        this.Svmlist=this.Svmlist.bind(this);
        this.onsubmit=this.onsubmit.bind(this);
        
        this.state={
            volume:'',
            File:'',
            Amount:0,
            uploadPercentage:0,
            message:'',
            Svm:'',
            Cluster:'',
            Aggregate:'',
            location:'',
            SvmArray:'',
            Hail:'',
            flag:false,
            NewFlag:false
        }
    }
    componentDidMount(){
        //get all the svms
        const User=JSON.parse(localStorage.getItem("user"));
        axios.get('SvmRoute/')
        .then((res)=>{
            console.log(res.data)
            if(res.data.err===null){
                this.setState({SvmArray:res.data.res,Hail:User.Hail})
            }else{
                console.log(res.data.err);
            }
        })
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
        if(e.target.value[this.state.volume.length]!==" ")
        {
            this.setState({
                volume:e.target.value
            });
        }
    }
    handleChangeSvm(e){
        this.state.SvmArray.forEach((svm) => {
            if(svm.Name===e.target.value)
            {
                this.setState({
                    Svm:svm.Name,
                    Cluster:svm.Cluster,
                    Aggregate:svm.aggregate,
                    Location:'svm.Region'
                })
            }
        });

    }
    onclicked(e){
        this.setState({flag:true,})
    }
    // submiting the form and creating new volume request in the db
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
                this.props.history.push("/UserDashboard");
            })
            .catch(err=>{this.setState({message:"Server error please try again later or contact support"})});
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

    Svmlist(){
        if(this.state.SvmArray)
        {
            return(
                this.state.SvmArray.map((CurrentSvm)=>{
                    return(
                        <option key={CurrentSvm._id} value={CurrentSvm.Name}>{`${CurrentSvm.Name} Type: ${CurrentSvm.aggregate}`}</option>
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
                <Modal showflag={this.state.flag}/>
                <div className="row">
                    <div className="col-md-6 m-auto">
                    <h3 className="text-center display-4 my-4">Volume Request</h3>
            <form onSubmit={this.onsubmit}>
            <div className="form-group">
                    <label>VolumeName:</label>
                    <br/>
                    <small style={{color:"red",background:"pink"}}>Space is not allowed</small>
                    <input type='text' required
                    className="form-control" value={this.state.volume}
                    onChange={this.onChangeVolume}/>
                </div>
                <div className="form-group">
                    <label>Svm Name:</label>
                    <select className="custom-select" required value={this.state.Svm} onChange={this.handleChangeSvm}>
                        <option disabled defaultValue value={''}>{`This is the recomended choise : ${this.state.Hail}`}</option>
                        {this.Svmlist()}
                    </select>
                </div>
                <div className="form-group  mb-3">
                    <label>Amount in (GB):</label>
                    <input type='number' required min="0"
                    className="form-control" value={this.state.Amount}
                    onChange={this.onChangeAmount}/>
                </div>
                <div className="form-group mb-3">
                <div>
                    <label>File of Founding:
                            <a href={ExempleDoc} className='btn btn-outline-success ' alt= "File of Founding"  style={{marginLeft:"1rem"}} download>
                                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" className="bi bi-file-arrow-down" viewBox="0 0 16 16">
                                <path d="M8 5a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5A.5.5 0 0 1 8 5z"/>
                                <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                                </svg>
                                download
                            </a>
                    </label>
                    <div className='custom-file mb-4'>
                        <input type="file" className='custom-file-input' id='customFile' required onChange={this.setSelectedFile}/>
                        <label className='custom-file-label' htmlFor='customFile'>
                        {this.state.File.name}
                        </label>
                    </div>
                        <Progress percentage={this.state.uploadPercentage}/>
                    </div>
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

