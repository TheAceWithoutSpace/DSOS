import React,{Component}from 'react';
import {Bar,Line,Pie} from 'react-chartjs-2';

export default class chart extends Component{
 constructor(props){
     super(props)
     this.state={
        chartData:props.chartData.chartData,
     }
 }
 static defaultProps={
    displayTitle:true,
    displayLegend:true,
    legendPosition:'chartArea',
    type:'Bar'

}
componentDidUpdate(prevProps,prevState){
    if (prevProps !== this.props){
    this.setState({chartData:this.props.chartData.chartData})
    }
}
render(){
    if(this.props.type==='Bar')
    {
        // Bar chart
    return(
        <div className='chart'>
            <Bar 
            data={this.state.chartData}
            options={{
                title:{
                    display:this.props.displayTitle,
                    text:this.props.title,
                    fontSize:25
                },
                legend:{
                    display:this.props.displayLegend,
                    position:this.props.legendPosition
                }
            }}
            />
        </div>
    )}else if(this.props.type==='Pie'){
        return(
            //Pie chart
            <div className="container">
            <Pie 
            data={this.state.chartData}
            options={{
                title:{
                    display:this.props.displayTitle,
                    text:this.props.title,
                    fontSize:25
                },
                legend:{
                    display:this.props.displayLegend,
                    position:this.props.legendPosition
                }
            }}
            />
        </div>
        )
    }else if(this.props.type==='line'){
        return(
            //Line chart
            <div className='chart'>
                <Line 
                data={this.state.chartData}
                options={{
                    title:{
                        display:this.props.displayTitle,
                        text:this.props.title,
                        fontSize:25
                    },
                    legend:{
                        display:this.props.displayLegend,
                        position:'bottom',
                        
                    },
                }}
                />
            </div>)
    }

}
}