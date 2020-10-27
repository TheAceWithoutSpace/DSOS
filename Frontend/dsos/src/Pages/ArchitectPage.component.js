import React,{Component}from 'react';
import RequsetCard from '../components/RequestCard.component' 
import axios from 'axios';
import AdminastorChart from'../components/ArchitectChart.component'

export default class ArcitectPage extends Component{
    constructor(props){
        super(props);
        
        this.state={Requests:[]};
    }
    
    componentDidMount(){
        axios.get(`http://localhost:3000/Request/`)
        .then(res=>{this.setState({Requests:res.data})})
        .catch(err=>{console.log('Error'+err)})
        axios.post("http://localhost:3000/MonthDateRoute/add")
    }

    SetChartData(){
        let Responses=[0,0,0]
        this.state.Requests.forEach(Req => {
            if(Req.status==="pending")
                Responses[0]++;
            if(Req.status==='Accepted')
                Responses[1]++;
            if(Req.status==="Decline")
                Responses[2]++;
        });
        return Responses
    }
    RequestsList(){
        return this.state.Requests.map(currentRequests=>{
            const status=currentRequests.status;
            return((status==="pending")?
                        <div className="col-md-3 mt-3"key={currentRequests._id} >
                            <RequsetCard Username={currentRequests.username}  email={currentRequests.email}
                            File={currentRequests.File} type={currentRequests.type} Name={currentRequests.Name}
                            id={currentRequests._id} Amount={currentRequests.Amount}
                            key={currentRequests._id}/>
                        </div>:null)
                    })
                }
    render(){
        return(
        <div>
            <AdminastorChart Requsets={this.state.Requests} ChartData={this.SetChartData()}/>
            <div className="row container-fluid d-flex justify-content-center">
                  {this.RequestsList()}
            </div>
        </div>
        )
    }
}