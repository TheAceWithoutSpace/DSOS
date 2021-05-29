import React,{Component}from 'react';
import axios from 'axios';
import Progress from '../components/Progress'
import Message from '../components/Message'
import {withRouter}from 'react-router-dom'
import Modal from '../components/Modle'

class createRequest extends Component{
    
    constructor(props){
        super(props);
        this.handleChangeAggre=this.handleChangeAggre.bind(this);
        this.handleChangeRegion=this.handleChangeRegion.bind(this);
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
            Region:'',
            Aggre:'',
            AggregateArray:'',
            NewFlag:false,
        }
    }
    componentDidMount(){
        //get all the aggregates
        axios.get('Aggregate/')
        .then((res)=>{
            console.log(res)
            if(res.data.err===null){
            this.setState({AggregateArray:res.data.res})
            }else{console.log("err "+res.err)}
        })
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
            Aggre:this.state.AggregateArray[e.target.value].Name,
            Cluster:this.state.AggregateArray[e.target.value].Cluster
        });
    }
    handleChangeRegion(e){
        this.setState({Region:e.target.value})
    }
    onChangeSvm(e){
        if(e.target.value[this.state.Svm.length]!==" ")
        {
            this.setState({
                Svm:e.target.value
            });
        }
    }
    onclicked(e){
        this.setState({flag:true})
    }
    // submiting the form and creating new svm request in the db
    onsubmit=async(e)=>{
        e.preventDefault();
        this.onclicked();
        const FileID=await this.upload(this.state.File);
        console.log(FileID);
        const Request={
            userID:JSON.parse(localStorage.getItem('user'))._id,
            username:JSON.parse(localStorage.getItem('user')).U,
            email:JSON.parse(localStorage.getItem('user')).E,
            Name:{C:this.state.Cluster,A:this.state.Aggre,S:this.state.Svm,V:null},
            Location:this.state.Region,
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
                console.log(res);
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
        if(this.state.AggregateArray&&this.state.Region)
        {
            console.log(this.state.AggregateArray)
            return(
                this.state.AggregateArray.map((CurrentAggre,index)=>{
                    if(CurrentAggre.used===0)
                        {   
                            return(
                            <option key={CurrentAggre._id} value={index} >{`
                                Type: ${CurrentAggre.Name}   Free: 100%
                            `}
                            </option>
                            )
                        }else{
                            return(
                                <option key={CurrentAggre._id} value={index}>{`Type: ${CurrentAggre.Name}
                                 Free:${(((CurrentAggre.used/CurrentAggre.total)*-100)+100).toFixed(3)}%`} 
                                </option>
                                )
                        }
                    }

                ))
        }
        else{return null}
    }
    // rendering the formn
    render(){
        const User=JSON.parse(localStorage.getItem("user"));
        return(
            <div className="container">
                {this.state.message?<Message msg={this.state.message}/>:''}
                <Modal showflag={this.state.flag}/>
                <div className="row">
                    <div className="col-md-6 m-auto">
                    <h3 className="text-center display-4 my-4">New Svm Request</h3>
            <form onSubmit={this.onsubmit}>
            <div className="form-group  mb-3">
                    <label>Svm Name:</label>
                    <br/>
                    <small style={{color:"red",background:"pink"}}>Space is not allowed</small>
                    <input type='text' required  legend="cant use space bar"
                    className="form-control" value={this.state.Svm} placeholder={User.Hail}
                    onChange={this.onChangeSvm}/>
                </div>
                <div className="form-group mb-3">
                <div className="form-group">
                    <label>Site Name:</label>
                    <select className="custom-select" required value={this.state.Region} onChange={this.handleChangeRegion}>
                    <option value="" defaultValue disabled>--chose Site--</option> 
                    <option value="North">צפון</option> 
                    <option value="Haifa">חיפה</option>
                    <option value="Tel-Avive">תל-אביב</option> 
                    <option value="central">מרכז</option> 
                    <option value="jerusalem">ירושלים</option> 
                    <option value="Judea and Samaria">יהודה ושומרון</option> 
                    <option value="south">דרום</option> 
                    </select>
                </div>
                <div className="form-group">
                    <label>Aggregate Name:</label>
                    <select className="custom-select" required value={this.state.Aggre} onChange={this.handleChangeAggre}>
                    <option value="" defaultValue disabled>--chose Aggregate--</option> 
                        {this.list()}
                    </select>
                </div>
                <div>  
                <label>File of Founding:
                        <a href={"/"} className='btn btn-outline-success ' alt= "File of Founding"  style={{marginLeft:"1rem"}} download>
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
                        {this.state.File.name?this.state.File.name:'Upload File'}
                        </label>
                    </div>
                        <Progress percentage={this.state.uploadPercentage}/>
                    </div>
                </div>
                {this.state.flag===false?
                <div>
                    <button type="submit" className="btn btn-outline-primary btn-block">Send Request</button>     
                </div>
                :<>
                <button className="btn btn-outline-primary btn-block" type="button" disabled>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Loading...
                </button>
                </>
                }

            </form>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(createRequest) 

