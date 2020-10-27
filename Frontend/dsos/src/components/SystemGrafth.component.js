import React,{Component, Fragment}from 'react';
import axios from 'axios';
import Chart from './chart.component';

export default class SystemGrafth extends Component{
   constructor(props){
       super(props);
       this.state={
        chartData:{n:0},
        Requests:[],
        SVM:'',
        TotalAmmount:'',
        message:'',
       }
    //    this.setdata=this.setdata.bind(this);
}

async componentDidMount(nextProps)
{   console.log(this.props +"||"+nextProps)
    if(this.props!==nextProps){
    let TotalAmount=0;
    let UsedAmount=0;
    let SVMS=[];
    let SVMSArray=[];
     axios.get(`http://localhost:3000/AGGREGATE/Aggre/${this.props.Aggre}`)
        .then((res)=>{TotalAmount=res.data.Req[0].TotalAmount 
            UsedAmount=res.data.Req[0].Amount});
     await axios.get(`http://localhost:3000/SvmRoute/SvmByAggreName/${this.props.Aggre}`)
        .then((res)=>SVMSArray=res.data.Req);
        SVMSArray.forEach((SVM)=>{
            })         
            SVMS.push({
                chartData:{
                    labels:['Free','Used'],
                    datasets:[{
                     label:"Requests",
                     backgroundColor:["rgba(245, 73, 120, 0.65)",
                                      "rgba(175, 146, 234, 0.65)",
                                      ],
                     data:[(TotalAmount-UsedAmount),UsedAmount]
                    },
                    ]
                }
            })
            let message='';
            if(TotalAmount>UsedAmount+this.props.Amount)
            {
                message=`All Clear ${((parseInt((UsedAmount/TotalAmount)*100)-100)*-1)}% Free left`
            }
            if(TotalAmount<=UsedAmount+this.props.Amount&&UsedAmount+this.props.Amount<TotalAmount*1.2)
            {
                message=`OVER SUBSCRIBE  ${parseInt((UsedAmount/TotalAmount)*100)}% Black line %`
            }
            if(UsedAmount+this.props.Amount>TotalAmount*1.4)
            {
                message=`Over SUBSCRIBE ${parseInt((UsedAmount/TotalAmount)*100)}% Red line cant allocate this user Storage request`
            }
            this.props.getMessage(message);
            this.setState({SVM:SVMS})
    }   
}
 Charts(){
    if(this.state.SVM)
    {
    return(
        this.state.SVM.map((currntSvm,index)=>{
            return(
                    <div className="col-md-6" key={index}>
                        {this.state.SVM[index]?
                             <Chart type='Pie' title={currntSvm} chartData={this.state.SVM[index]}/>
                        :null}
                    </div>
                )
        })
    )}
    else{
        return(
        <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
            </div>
        </div>
    )}
 }

    render(){
        
        return(
            <Fragment>
                {this.Charts()}
            </Fragment>
        )
    }
}