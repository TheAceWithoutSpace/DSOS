import React,{Component, Fragment}from 'react';
import axios from 'axios';
import Chart from './chart.component';

export default class StorageChart extends Component{
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
    if(this.props!==nextProps){
    let TotalAmount=this.props.Total;
    let UsedAmount=this.props.UsedAmount;
    let Chartdata=[];
    let SVMSArray=[];
    let SvmsName=[];
    let SvmsAmount=[];
    let ChartTitle='';
    console.log('---------')
    console.log(this.props.Aggre)
    await axios.get(`SvmRoute/SvmByAggreName/${this.props.Aggre}`)
        .then((res)=>{SVMSArray=res.data});
        if(UsedAmount===0){
            SvmsAmount.push(((TotalAmount/TotalAmount)*100));
        }else{
            SvmsAmount.push((parseInt((( TotalAmount-UsedAmount)/TotalAmount)*10000))/100);
        }
        SvmsName.push('Free')
        SVMSArray.forEach((SVM)=>{
            if(SVM.Amount!==0)
            {   console.log(SVM)
                SvmsAmount.push((parseInt(( SVM.Amount/TotalAmount)*10000))/100)
                SvmsName.push(SVM.name)
            }
            console.log(SvmsAmount)
            }) 
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
            // let message='';
            // let presentage=parseInt(((this.props.Amount+UsedAmount)/TotalAmount)*100);
            // if(TotalAmount===null||UsedAmount===null||this.props.Amount===null)
            // {
            //     message="Server Errore cant get the data Please try again later"
            // }
            // if(presentage<100)
            // {
            //     message=`All Clear ${(presentage-100)*-1}% Free left after`
            // }
            // if(presentage>=100&&presentage<140)
            // {
            //     message=`OVER SUBSCRIBE if you accept ${presentage}% Black line %`
            // }
            // if(presentage>140)
            // {
            //     message=`Over SUBSCRIBE ${presentage}% Red line cant allocate this user Storage request`
            // }
            // this.props.getMessage({message,presentage});
            
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