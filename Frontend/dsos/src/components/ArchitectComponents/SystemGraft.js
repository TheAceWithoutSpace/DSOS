import React,{Component, Fragment}from 'react';
import axios from 'axios';
import Chart from '../chart.component';

export default class SystemGrafth extends Component{
   constructor(props){
       super(props);
       this.state={
        chartData:{n:0},
        Requests:[],
        SVM:'',
        Chartdata:'',
        TotalAmmount:'',
        message:'',
        ChartTitle:'loading',
       }
}

async componentDidMount(nextProps)
{   
    console.log(nextProps)
    console.log(this.props)
    if(this.props!==nextProps){
    let TotalAmount=0;
    let UsedAmount=0;
    let full=0;
    let system=0;
    let Chartdata=[];
    let SVMSArray=[];
    let SvmsName=[];
    let SvmsAmount=[];
    let ChartTitle='';
        //get aggregate info by the aggregate name
        await axios.get(`Aggregate/Aggre/${this.props.Aggre}`)
        .then((res)=>{
            console.log(res.data.res)
            if(res.data.res[0]){
                TotalAmount=parseFloat(res.data.res[0].total); 
                UsedAmount=parseFloat(res.data.res[0].used);
                ChartTitle=res.data.res[0].Name;
                full=res.data.res[0].full;
            }
         });
        //get all the svms by the aggreagate name
    await axios.get(`SvmRoute/SvmByAggreName/${this.props.Aggre}`)
        .then((res)=>{
            console.log(res.data.res)
            SVMSArray=res.data.res
        });
        //calculate used vs free presentage
        if(UsedAmount===0){
            SvmsAmount.push(100);
        }else{
            SvmsAmount.push(100-full);
        }
        SvmsName.push('Free')
        SVMSArray.forEach((SVM)=>{
            console.log(SVM)
            if(SVM.Amount!==0)
            {   console.log( SVM.total+'||'+TotalAmount)
                SvmsAmount.push((parseInt(( SVM.total/TotalAmount)*10000))/100)
                system+=((parseInt(( SVM.total/TotalAmount)*10000))/100);
                SvmsName.push(SVM.Name)
            }
            console.log(SvmsAmount)
            })
            SvmsAmount.push(full-system)
            SvmsName.push("system")
                Chartdata.push({
                    chartData:{
                        labels:SvmsName,
                        datasets:[{
                        label:"Requests",
                        backgroundColor:["rgba(245, 73, 120, 0.65)",
                                       "rgba(175, 146, 234, 0.65)",
                                       "rgba(152, 244, 244, 0.56)",
                                       "rgba(152, 244, 152, 0.56)",
                                       "rgba(244, 152, 152, 0.56)",
                                       "rgba(244, 244, 152, 0.56)",
                                       "rgba(244, 152, 244, 0.56)",
                                       "rgba(152, 198, 244, 0.56)",
                                          ],
                        data:SvmsAmount
                        },
                        ]
                    }
                })
            console.log(Chartdata)
            let message='';
            //create a masage by calculateing the used presentage
            let Amount=parseFloat(this.props.Amount)
            console.log(Amount)
            console.log(UsedAmount)
            console.log(TotalAmount)
            let presentage=parseInt(((Amount+UsedAmount)/TotalAmount)*10000)/100
            console.log(presentage)
            if(TotalAmount===null||UsedAmount===null||Amount===null)
            {
                message="Server Error cant get the data Please try again later"
            }
            if(presentage<100)
            {
                message=`All Clear ${(presentage-100)*-1}% Free left after`
            }
            if(presentage>=100&&presentage<140)
            {
                message=`OVER SUBSCRIBE if you accept ${presentage}% Gray line %`
            }
            if(presentage>140)
            {
                message=`Over SUBSCRIBE ${presentage}% Red line cant allocate this user Storage request`
            }
            this.props.getMessage({message,presentage});
            
            this.setState({Chartdata:Chartdata,ChartTitle:ChartTitle})
    }   
}
 Charts(){
    if(this.state.Chartdata)
    {
        console.log(this.state.Chartdata[0].chartData)
    return( 
        this.state.Chartdata.map((Chartdata,index)=>{
            return(
                    <div className="col-md-6" key={index}>
                        {this.state.Chartdata[index]?
                             <Chart type='Pie' title={this.state.ChartTitle} chartData={this.state.Chartdata[index]}/>
                        :<alert className="alert alert-warning">Server Error Please try again later</alert>}
                    </div>
                )
        })
    )}
    else{
        return(
        <div className="d-flex justify-content-center" style={{marginLeft:"20%",marginTop:"6%"}}>
            <div className="spinner-grow ml-3"  style={{color:"pink",animationDuration:"1.5s"}} role="status"></div>
            <div className="spinner-grow ml-3 text-warning" style={{animationDuration:"2s"}} role="status"></div>
            <div className="spinner-grow ml-3 text-info"style={{animationDuration:"3s"}} role="status"></div>
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