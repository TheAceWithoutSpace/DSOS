import React,{Component}from 'react';
import axios from 'axios';
import '../components/UserComponent/UserDashbord.css'
import Message from '../components/Message';
import LoadingAnimation from '../components/Loading'

export default class UserDashboard extends Component{
    constructor(props){
        super(props);
        
        this.state={Requests:[],message:'',DataFlag:false};
    }
    componentDidMount(){
        //get all the requests by user id
        axios.get(`http://localhost:3000/Request/Userid/${this.props.User._id}`)
        .then(res=>{
            if(res.data.err!==null){
                this.setState({message:'Server err'})
            }else{
                this.setState({Requests:res.data.res,DataFlag:true})
            }
        }).catch(err=>{console.log('Error'+err)})
    }
    //sort the requests in a table form
    RequestsList(){
        return this.state.Requests.map( (currentRequests,index)=>{
            console.log(currentRequests)
            return(
            <tr key={currentRequests._id}>
                <td>{index+1}</td>
                <td>{currentRequests.type}</td>
                <td>{currentRequests.Name.A}</td>
                {currentRequests.Amount!==0?
                <td>{currentRequests.Amount} GB</td>:<td>{ }</td>}
                {currentRequests.Location===''?
                <td>{currentRequests.Name.S}</td>
                :
                <td>{currentRequests.Location}</td>
                }
                {currentRequests.status==="Accepted"?<td className="text-success">{currentRequests.status}</td>
                :<>{currentRequests.status==="Decline"?<td className="text-danger">{currentRequests.status}</td>
                :<td className="text-warning">{currentRequests.status}</td>}</>}
            </tr>
            )})
    }
    render(){
        if(this.state.DataFlag){
            return(
                <>
                {this.props.User._id?null:window.location.href = '/UKnoob'}
                {this.state.message?<Message msg={this.state.message}/>:''}
                <div className="container-fluid ">
                    <div className="row d-flex justify-content-center">
                    <div className="col-md-12 col-lg-10 ">
                    <div className="jumbotron" >
                        <div className="container">
                            <h1 id='text-h' className="h1">Hello {this.props.User.N}</h1>
                                <p id='text' className=" text-monospace">Welcome this is the Dashboard<br/> from here you can make<br/>Svm/Volume
                                 requests<br/> and bug reports <br/></p>
                                <br/><br/>
                                
                            </div>
                        </div>
                        <div>
                            <table className="table table-hover ">
                                <thead>
                                    <tr className="table-primary">
                                        <th scope="col">Request Number</th>
                                        <th scope="col">type</th>
                                        <th scope="col">Disk type</th>
                                        <th scope="col">Amount</th>
                                        <th scope='col'>Location</th>
                                        <th scope="col">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="table-striped">
                                    {this.RequestsList()}
                                </tbody>
                            </table>
                        </div>
                    </div> 
                </div>
                </div>
            </>
            )
        }else{
            return(
                    <LoadingAnimation/>
            )
        }
        
    }
}