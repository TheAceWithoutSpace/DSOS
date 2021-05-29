import React,{Component}from 'react';
import axios from 'axios';
import {withRouter}from 'react-router-dom'
import Chart from '../chart.component';
import AdminCompNav from "./AdminCompNav"
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker} from 'react-dates';
import LoadingAnimation from "../Loading";

// calc the grow of the the servies 
class GrowCalc extends Component{
    constructor(props){
        super(props);
        this.state={
            LastData:[],
            CurrentData:[],
            labels:[],
            PredictedData:[],
            startDate:null,
            endDate:null,
            flag:true,
            EndIndex:null,
            StartIndex:null
        }
    }
    async getData(){
        let LastData=[];
        let CurrentData=[];
        let startIndex=null;
        let EndIndex=null;
        if(this.state.endDate===null)
        {
            let ts=Date.now()
            let date_ob = new Date(ts);
            let month = date_ob.getMonth() + 1;
            let year = date_ob.getFullYear();
            // get last month data
            await axios.get(`MonthDateRoute/Month/${month-1}-${year}`)
            .then((res)=>{
            console.log(res.data.res)
            LastData=res.data.res[0].Data;
        })
        // get current month data
        await axios.get(`MonthDateRoute/Month/${month}-${year}`)
            .then((res)=>{
                    console.log(res.data)
                    CurrentData=res.data.res[0].Data;
                })
        }else{
            // calc the grow by a range of dates and commpare to the current data
            //-----------StartDate-------
            let Sd = new Date(this.state.startDate);
            startIndex=Sd.getDate();
            let CurrentStartDate=(Sd.getMonth() + 1)+"-"+Sd.getFullYear();
            let LastStartDate=Sd.getMonth()+"-"+Sd.getFullYear();
            //------------EndDate--------
            let Ed = new Date(this.state.endDate);
            EndIndex =Ed.getDate();
            let CurrentEndDate =(Ed.getMonth()+1)+'-'+Ed.getFullYear();
            let LastEndDate =Ed.getMonth()+"-"+Ed.getFullYear();

            // console.log(CurrentStartDate +'||'+CurrentEndDate);
            // console.log(LastStartDate+'||'+LastEndDate);
            await axios.get(`MonthDateRoute/range/${CurrentStartDate}/${CurrentEndDate}`)
            .then((res)=>{
                res.data.res.forEach(Month=>{
                    Month.Data.forEach(Day=>{
                        CurrentData.push(Day)
                    })
                })
            })
            await axios.get(`MonthDateRoute/range/${LastStartDate}/${LastEndDate}`)
            .then((res)=>{
                console.log(res.data)
                if(res.data.res.length===0)
                {
                    console.log('Error cant find The Data')
                }else{
                    res.data.res.forEach(Month=>{
                        Month.Data.forEach(Day=>{
                            LastData.push(Day)
                        })
                    })
                }
                
            })
        }
        console.log(LastData);
        console.log(CurrentData);
        this.setState({
            LastData:LastData,
            CurrentData:CurrentData,
            StartIndex:startIndex,
            EndIndex:EndIndex
        })
        //get last year currecnt month data
        //and this year month data
        this.CompareData();
    }
    calcGrowth(Mt,M0){
        if(Mt===M0)
        {
            return(1);
        }else if(Mt===0&&M0!==0)
        {
            return(0);
        }else if(Mt!==0&&M0===0){
            return((M0/Mt)+1)
        }else{
            return((Mt/M0)+1)
        }
        // let q = M0/Mt;
        // Math.pow(q,t)

    }
    //compare the Data
    CompareData(){
        let CurrntData=this.state.CurrentData;
        let LastData=this.state.LastData;
        let PredictedData=[];
        let labels=[];
        let StartIndex=this.state.StartIndex;
        let EndIndex=this.state.EndIndex;
        if(StartIndex==null){StartIndex=0};
        if(EndIndex==null){EndIndex=this.state.CurrentData.length}
        if(this.state.LastData.length!==0&&this.state.CurrentData.length!==0)
        {
            if(this.state.LastData.length>=this.state.CurrentData.length)
            {
                this.state.CurrentData.forEach((CurrentData,index)=>{
                    if(index>=StartIndex&&index<=EndIndex)
                        {
                        labels.push(CurrentData.Date);
                        PredictedData.push({
                            StorageTotalFree:CurrentData.StorageTotalFree*this.calcGrowth(CurrentData.StorageTotalFree,LastData[index].StorageTotalFree),
                            Date:CurrntData[index].Date,
                            StorageUsegeAmmount:CurrentData.StorageUsegeAmmount*this.calcGrowth(CurrentData.StorageUsegeAmmount,LastData[index].StorageUsegeAmmount),
                            StorageRequests:CurrentData.StorageRequests*this.calcGrowth(CurrentData.StorageRequests,LastData[index].StorageRequests),
                            bugReports:CurrentData.bugReports*this.calcGrowth(CurrentData.bugReports,LastData[index].bugReports),
                            users:CurrentData.users*this.calcGrowth(CurrentData.users,LastData[index].users),
                        }) 
                    }   
                })
            }else{
                this.state.LastData.forEach((LastData,index)=>{
                    console.log(CurrntData[index]);
                    labels.push(CurrntData[index].Date);
                    PredictedData.push({
                        StorageTotalFree:CurrntData[index].StorageTotalFree*this.calcGrowth(CurrntData[index].StorageTotalFree,LastData.StorageTotalFree),
                        Date:CurrntData[index].Date,
                        StorageUsegeAmmount:CurrntData[index].StorageUsegeAmmount*this.calcGrowth(CurrntData[index].StorageUsegeAmmount,LastData.StorageUsegeAmmount),
                        StorageRequests:CurrntData[index].StorageRequests*this.calcGrowth(CurrntData[index].StorageRequests,LastData.StorageRequests),
                        bugReports:CurrntData[index].bugReports*this.calcGrowth(CurrntData[index].bugReports,LastData.bugReports),
                        users:CurrntData[index].users*this.calcGrowth(CurrntData[index].users,LastData.users),
                    })   
                })
            }
            // console.log(PredictedData)
            this.setState({PredictedData:PredictedData,labels:labels})
        }else{
            console.log('Error cant get this or the last comperable data ')
        }

    }
    // set the data in the chart formation
     SetDatabugReports(){
        if(this.state.PredictedData) {
            let CurrntData=this.state.CurrentData;
            let bugReports=[];
            let PredictedbugReports=[];
            this.state.PredictedData.forEach((Data,index)=>{
                    console.log(CurrntData[index])
                    if(Data.bugReports===0){
                        PredictedbugReports.push(0);
                    }else{
                        PredictedbugReports.push(Data.bugReports);
                    }
                    if(CurrntData[index].bugReports===0){
                        bugReports.push(0);
                    }else{bugReports.push(CurrntData[index].bugReports)}
            })
        return({
            chartData:{
                labels:this.state.labels,
                datasets:[{
                    label:"PredictedbugReports",
                    fill: false,
                    backgroundColor:["rgba(50, 120, 132, 0.6)"],
                    borderColor: ['rgba(50, 120, 132, 0.6)',],
                    data:PredictedbugReports
                }, {
                    label:"bugReports",
                    fill: false,
                    backgroundColor:["rgba(120, 99, 182, 0.6)"],
                    borderColor: ['rgba(120, 99, 182, 0.6)',],
                    data:bugReports
                }
                ]
            }
        })
        }else{return<>Loading ...</>}       
     }
     SetDataStorageReq(){
        if(this.state.PredictedData) {
            let CurrntData=this.state.CurrentData;
            let StorageRequests=[];
            let PredictedStorageRequests=[];
            this.state.PredictedData.forEach((Data,index)=>{ 
                    if(Data.StorageRequests===0){
                        PredictedStorageRequests.push(0);
                    }else{
                        PredictedStorageRequests.push(Data.StorageRequests);
                    }
                    if(CurrntData[index].StorageRequests===0){
                        StorageRequests.push(0);
                    }else{StorageRequests.push(CurrntData[index].StorageRequests)}
            })
        return({
            chartData:{
                labels:this.state.labels,
                datasets:[{
                    label:"PredictedStorageRequests",
                    fill: false,
                    backgroundColor:["rgba(50, 120, 132, 0.6)"],
                    borderColor: ['rgba(50, 120, 132, 0.6)',],
                    data:PredictedStorageRequests 
                }, {
                    label:"StorageRequests",
                    fill: false,
                    backgroundColor:["rgba(120, 99, 182, 0.6)"],
                    borderColor: ['rgba(120, 99, 182, 0.6)',],
                    data:StorageRequests 
                }
                ]
            }
        })
        }else{return<>Loading ...</>}       
     }
     SetDataUsers(){
        if(this.state.PredictedData) {
            let CurrntData=this.state.CurrentData;
            let Users=[];
            let PredictedUsers=[];
            this.state.PredictedData.forEach((Data,index)=>{
                    if(Data.users===0){
                        PredictedUsers.push(0);
                    }else{
                        PredictedUsers.push(Data.users);
                    }
                    if(CurrntData[index].users===0){
                        Users.push(0);
                    }else{Users.push(CurrntData[index].users)}
                
            })
        return({
            chartData:{
                labels:this.state.labels,
                datasets:[{
                    label:"PredictedUsers",
                    fill: false,
                    backgroundColor:["rgba(50, 120, 132, 0.6)"],
                    borderColor: ['rgba(50, 120, 132, 0.6)',],
                    data:PredictedUsers
                }, {
                    label:"Users",
                    fill: false,
                    backgroundColor:["rgba(120, 99, 182, 0.6)"],
                    borderColor: ['rgba(120, 99, 182, 0.6)',],
                    data:Users
                }
                ]
            }
        })
        }else{return<>Loading ...</>}       
     }
     SetDataAggre(){
        
        if(this.state.PredictedData) {
            let CurrntData=this.state.CurrentData;
            let Storage=[];
            let PredictedStorage=[];
            this.state.PredictedData.forEach((Data,index)=>{
                console.log(Data)
                    if(Data.StorageUsegeAmmount===0||Data.StorageTotalFree===0){
                        PredictedStorage.push(0);
                    }else{
                        console.log(Data.StorageUsegeAmmount+"||"+Data.StorageTotalFree)
                        PredictedStorage.push(parseInt((Data.StorageUsegeAmmount/Data.StorageTotalFree)*100));
                    }
                    if(CurrntData[index].StorageUsegeAmmount===0||Data.StorageTotalFree===0){
                        Storage.push(0);
                    }else{Storage.push(parseInt((CurrntData[index].StorageUsegeAmmount/Data.StorageTotalFree)*100))}
            })
            console.log(Storage)
        return({
            chartData:{
                labels:this.state.labels,
                datasets:[{
                    label:"StoragePredicted",
                    fill: false,
                    backgroundColor:["rgba(50, 120, 132, 0.6)"],
                    borderColor: ['rgba(50, 120, 132, 0.6)',],
                    data:PredictedStorage
                }, {
                    label:"Storage",
                    fill: false,
                    backgroundColor:["rgba(120, 99, 182, 0.6)"],
                    borderColor: ['rgba(120, 99, 182, 0.6)',],
                    data:Storage
                }
                ]
            }
        })
        }else{return<>Loading ...</>}       
     }
    componentDidMount(){
        this.getData();
    }
    componentDidUpdate(){
        if(this.state.startDate!==null&&this.state.endDate!==null&&this.state.flag)
            {
                this.getData();
                this.setState({flag:false});
            }
    }
    // render the page 
    render(){
        return(
            <>
            <div className="cuntiner-fluid ">
                <div className="row">
                    <div id="sidebarMenu" className="col-md-2 col-lg-2 d-md-block sidebar collapse">
                        <AdminCompNav User={this.props.User} />
                    </div>
                    <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4 ">
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                            <h1 className="h2">
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock-history" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z"/>
                                    <path fillRule="evenodd" d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z"/>
                                    <path fillRule="evenodd" d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"/>
                                </svg>
                                {" prognostication"}
                            </h1>  
                            <div className='btn-toolbar mb-2 mb-md-0 pr-5'>
                                <DateRangePicker
                                startDate={this.state.startDate} // momentPropTypes.momentObj or null,
                                startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                                endDate={this.state.endDate} // momentPropTypes.momentObj or null,
                                endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                                onDatesChange={({ startDate, endDate}) => this.setState({ startDate, endDate,flag:true})} // PropTypes.func.isRequired,
                                focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                                isOutsideRange={date => date.isBefore(new Date(2021, 1, 1)) || date.isAfter(new Date())}
                                onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
                                />
                            </div>
                        </div>
                        {this.state.PredictedData.length!==0?
                        <div className="row d-flex justify-content-around">
                            <div className="col-md-5">
                                <Chart type='line' title={'bugReports'} chartData={this.SetDatabugReports()}/>
                            </div>
                            <div className="col-md-5">
                                <Chart type='line' title={'StorageReq'} chartData={this.SetDataStorageReq()}/>
                            </div>
                            <div className="col-md-5">
                                <Chart type='line' title={'Users'} chartData={this.SetDataUsers()}/>
                            </div>
                            <div className="col-md-5">
                                <Chart type='line' title={'Storage'} chartData={this.SetDataAggre()}/>
                            </div>
                        </div>:<LoadingAnimation/>}
                    </main>
                </div>
            </div>
            </>
        )
    }
}
export default withRouter(GrowCalc)