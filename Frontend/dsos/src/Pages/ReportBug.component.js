import React,{Component}from 'react';
import axios from 'axios';
import Progress from '../components/Progress'
import Message from '../components/Message'
import {withRouter}from 'react-router-dom'


class ReportBug extends Component{
    
    constructor(props){
        super(props);
        this.handleChangeDescription=this.handleChangeDescription.bind(this);
        this.setSelectedFile=this.setSelectedFile.bind(this);
        this.onclicked=this.onclicked.bind(this);
        this.onsubmit=this.onsubmit.bind(this);
        
        this.state={
            Description:'',
            File:'',
            uploadPercentage:0,
            message:'',
            flag:false
        }
    }
    
    // handeling form fields
    setSelectedFile(e){
        this.setState({
            File:e.target.files[0]
        });
    }
    handleChangeDescription(e){
        this.setState({
            Description:e.target.value
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
            userID:this.props.location.aboutProps.User,
            username:this.props.location.aboutProps.User.username,
            email:this.props.location.aboutProps.User.email,
            Description:this.state.Description,
            File:FileID,
            status:'pending'
        }
        let ts=Date.now()
        let date_ob = new Date(ts);
        let day= date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        axios.post('http://localhost:3000/Bug/add',Request)
            .then(res=>{
                axios.post(`http://localhost:3000/MonthDateRoute/bugReports/${day}.${month}.${year}`)
                this.setState({message:"Request send"})
                this.props.history.push("/Home");
            })
            .catch(err=>{this.setState({message:"Error"+err})});
    }
    upload= async(e)=>{
        // e.preventDefault();
        const formData=new FormData();
        formData.append('file',e);
        if(e)
        {
            try{
                  const res=await axios.post('http://localhost:3000/File/upload',formData,{
                    headers:{
                      'content-Type':'multipart/form-data'
                    },
                    onUploadProgress:ProgressEvent=>{
                        for (let i=((ProgressEvent.total/100)*56);i<ProgressEvent.total;i+=ProgressEvent.total/100)
                        {
                            this.setState({uploadPercentage:(parseInt((i*100)/ProgressEvent.total))});
                        }
                    }
                  });
                  return(res.data.file.filename);
          }catch(err){
            console.log (err)
          }
        }
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
                <div className="form-group  mb-3">
                    <label>Description:</label>
                    <input type='text' required
                    className="form-control" value={this.state.Description}
                    onChange={this.handleChangeDescription}/>
                </div>
                <div className="form-group mb-3">
                <div>
                    <div className='custom-file mb-4'>
                        <input type="file" className='custom-file-input' id='customFile' onChange={this.setSelectedFile}/>
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
export default withRouter(ReportBug) 

