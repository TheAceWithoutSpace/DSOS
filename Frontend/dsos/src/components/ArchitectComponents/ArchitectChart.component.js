import React,{Component}from 'react';
// import Axios from 'axios';
import Chart from '../chart.component';

export default class AdminSpecs extends Component{
   constructor(props){
       super(props);
       this.state={
        chartData:{},
        Requests:[]
       }
       this.SetData=this.SetData.bind(this)
}
// set the data to the chart structure
 SetData(){ 
    let Responses=this.props.ChartData
    return({
        chartData:{
            labels:['pending for response','accepted','declined'],
            datasets:[{
             label:"Requests",
             backgroundColor:["rgba(200, 200, 15, 0.65)",
                              "rgba(100, 200, 10, 0.65)",
                              "rgba(255, 12, 60, 0.75)",
                              ],
             data:Responses
            },
            ]
        }
    })
 }
 // render Architect chart
    render(){
        return(
            <div className="container" style={{marginTop:50, position:'relative',width:600,height:400}}>
                <Chart type='Pie' title='Requests' chartData={this.SetData()}/>
            </div>
        )
    }
}