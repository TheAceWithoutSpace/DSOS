import React,{Component}from 'react';
import axios from 'axios';

import Message from '../components/Message'
import {withRouter}from 'react-router-dom'


class createRequest extends Component{
    
    constructor(props){
        super(props);
        this.onChangelocation=this.onChangelocation.bind(this);
        this.onChangeName=this.onChangeName.bind(this);
        this.setSelectedFile=this.setSelectedFile.bind(this);
        this.onChangeAmount=this.onChangeAmount.bind(this);
        this.onclicked=this.onclicked.bind(this);
        this.onsubmit=this.onsubmit.bind(this);
        
        this.state={
            Name:'',
            File:'',
            Amount:'',
            location:'',
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
    onChangeAmount(e){
        this.setState({
            Amount:e.target.value
        })
    }
    onChangeName(e){
        this.setState({
            Name:e.target.value
        });
    }
    onChangelocation(e){
        this.setState({
            location:e.target.value
        })
    }
    onclicked(e){
        this.setState({flag:true})
    }
    // submiting the form and creating new user in the server
    onsubmit=async(e)=>{
        e.preventDefault();
        this.onclicked();
        //const FileID=await this.upload(this.state.File);
        //console.log(FileID);
        const Request={
            userID:this.props.location.aboutProps.User._id,
            username:this.props.location.aboutProps.User.username,
            email:this.props.location.aboutProps.User.email,
            Name:{A:this.state.Name,S:'',V:this.state.location},
            Amount:this.state.Amount,
            File:'11',
            status:'pending',
            type:'Aggregate'
        }

        console.log(Request);
        let ts=Date.now()
                let date_ob = new Date(ts);
                let day= date_ob.getDate();
                let month = date_ob.getMonth() + 1;
                let year = date_ob.getFullYear();
        axios.post('http://localhost:3000/Request/add',Request)
            .then(res=>{
                axios.post(`http://localhost:3000/MonthDateRoute/StorageRequests/${day}.${month}.${year}`)
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
                  const res=await axios.post('http://localhost:3000/File/upload',formData,{
                    headers:{
                      'content-Type':'multipart/form-data'
                    },
                    onUploadProgress:ProgressEvent=>{
                      this.setState({uploadPercentage:
                        parseInt(
                        Math.round((ProgressEvent.loaded*100)/ProgressEvent.total)
                        )});
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
                    <h3 className="text-center display-4 my-4">New AGGREGATE Request</h3>
            <form onSubmit={this.onsubmit}>
                <div className="form-group  mb-3">
                    <label>Name:</label>
                    <input type='text' required
                    className="form-control" value={this.state.Name}
                    onChange={this.onChangeName}/>
                </div>
                <div className="form-group  mb-3">
                    <label>location:</label>
                    <input type='text' required
                    className="form-control" value={this.state.location}
                    onChange={this.onChangelocation}/>
                </div>
                <div className="form-group  mb-3">
                    <label>Amount in (GB):</label>
                    <input type='number' required min="0"
                    className="form-control" value={this.state.Amount}
                    onChange={this.onChangeAmount}/>
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

