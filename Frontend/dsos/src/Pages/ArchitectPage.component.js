import React,{Component}from 'react';
import RequsetCard from '../components/ArchitectComponents/RequestCard.component' 
import axios from 'axios';
import AdminastorChart from'../components/ArchitectComponents/ArchitectChart.component'
import LoadingAnimation from'../components/Loading'

export default class ArcitectPage extends Component{
    constructor(props){
        super(props);
        
        this.state={
            Requests:[],
            PendingReq:[],
            NumOfPages:0,
            next:4,
            prev:0
        };
    }
    
    componentDidMount(){
        //get all the user requests 
        axios.get(`Request/`)
        .then(res=>{
            let PendingReq=[];
            let num=0;
            //count the pending requests
            res.data.res.forEach(Req=>{
                if(Req.status==="pending")
                {
                    num++;
                    PendingReq.push(Req);
                }
            })
                if(res.data.err===null){
                    this.setState({Requests:res.data.res,NumOfPages:parseInt(num),PendingReq:PendingReq})
                }else{
                    console.log(res.data.err)
                }
            })
    }
    //count and sort the requests by status for the pie chart
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
    //for each requst send to the RequsetCard component to display it in a card 
    RequestsList(){
        return this.state.PendingReq.map((currentRequests,index)=>{
            if((index>=this.state.prev)&&(index<this.state.next)){
                console.log(currentRequests)
                return(
                    <div className="col-md-2 mt-2"key={currentRequests._id} >
                        <RequsetCard Username={currentRequests.username}  email={currentRequests.email}
                                    File={currentRequests.File} type={currentRequests.type} Name={currentRequests.Name}
                                    id={currentRequests._id} Amount={currentRequests.Amount}
                                    key={currentRequests._id}/>
                    </div>)
            }else{
                return(null)
            }
        })
    }
    //handle the cards nav bar by increase the index of the displayed card
    InkIndex(){
        if(this.state.next<=this.state.NumOfPages)
        {
        this.setState({prev:this.state.next,next:(this.state.next+4)})
        }else{
            this.setState({prev:0,next:4})
        }
    } 
    //handle the cards nav bar by decrease the index of the displayed card
    DecIndex(){
        console.log(this.state.prev+"::"+0)
        if(this.state.prev>0){
            this.setState({prev:this.state.prev-4,next:this.state.prev})
        }else{
            this.setState({prev:(this.state.NumOfPages-4),next:this.state.NumOfPages})
        }
    }     
    render(){
        const Ur=JSON.parse(localStorage.getItem('user'));
        console.log(this.state.PendingReq);
        return(
        <div>
            {Ur.Ar?null:window.location.href = '/UKnoob'}
            {this.state.PendingReq.length?
            <>
            <AdminastorChart Requsets={this.state.Requests} ChartData={this.SetChartData()}/>
            <div className="row container-fluid d-flex justify-content-center">
                <div className="col-md-2 mt-3 pt-5 pl-5">
                    <button type="button" className="btn btn-outline-info btn-lg" onClick={()=>{this.DecIndex()}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="5rem" height="5rem" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                        </svg>
                    </button>
                </div>

                  {this.RequestsList()}

                <div className="col-md-2 mt-3 pt-5 pr-5">
                  <button type="button" className="btn btn-outline-info btn-lg" onClick={()=>{this.InkIndex()}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="5rem" height="5rem" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                    </svg>
                  </button>
                </div>
            </div>
            </>
            : <LoadingAnimation/>
            }
        </div>
        )
    }
}