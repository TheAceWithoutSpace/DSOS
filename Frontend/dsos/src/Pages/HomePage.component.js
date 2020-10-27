import React,{Component}from 'react';
import axios from 'axios';
import '../components/Home.css'

export default class ArcitectPage extends Component{
    constructor(props){
        super(props);
        
        this.state={Requests:[]};
    }
    componentDidMount(){
      //${this.props.userID}
        axios.get(`http://localhost:3000/Request/Userid/${this.props.User._id}`)
        .then(res=>{console.log(res.data)
         this.setState({Requests:res.data.Req})})
        .catch(err=>{console.log('Error'+err)})
    }

    RequestsList(){
        return this.state.Requests.map( currentRequests=>{
            return(
            <tr key={currentRequests._id}>
            <td>{currentRequests._id}</td>
            <td>{currentRequests.type}</td>
            {currentRequests.status==="Accepted"?<td className="text-success">{currentRequests.status}</td>
            :<>{currentRequests.status==="Decline"?<td className="text-danger">{currentRequests.status}</td>
            :<td className="text-warning">{currentRequests.status}</td>}</>}
            </tr>
            )})
    }
    render(){
        return(
        <>
        <div className="container-fluid ">
            <div className="row d-flex justify-content-center">
            <div className="col-md-12 col-lg-10 ">
            <div className="jumbotron" >
                <div className="container">
                    <h1 className="h1">Hello {this.props.User.Nickname}</h1>
                        <p className="font-weight-bolder">and welcome to your Dashboard<br/> from here you can make<br/> Aggregate/Svm/Volume
                         requests<br/> and bug reports <br/> also you can watch your request status </p>
                        <br/><br/>
                        
                    </div>
                </div>
                <div>
                    <table className="table table-hover ">
                        <thead>
                            <tr className="table-primary">
                                <th scope="col">Request Number</th>
                                <th scope="col">type</th>
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
    }
}