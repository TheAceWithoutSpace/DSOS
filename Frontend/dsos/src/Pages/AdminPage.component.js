import React,{Component}from 'react';
import axios from 'axios';
import Chart from '../components/chart.component';
import 'react-dates/initialize';
import '../components/Admin.css'
import AdminCompNav from'../components/AdminCompNav'
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker} from 'react-dates';


class Admin extends Component{
    constructor(props){
        super(props);
        this.state={
            Users:0,
            Requsts:0,
            Bugs:0,
            Aggregates:{Total:0,Amount:0},
            days:[],
            startDate:null,
            endDate:null,
            flag:true,
            chartTitle:'',
        }
    }

    SetData(){
        if(this.state.days) {
            let StorageRequests=[];
            let bugReports=[];
            let users=[];
            let aggre=[];
            let labels=[];
           
            this.state.days.forEach(day=>{
                labels.push(day.Date[0]+day.Date[1])
                StorageRequests.push(parseInt((day.StorageRequests/this.state.Requsts)*100));
                bugReports.push(parseInt((day.bugReports/this.state.Bugs)*100));
                users.push(parseInt((day.users/this.state.Users)*100));
                aggre.push(parseInt((day.AggreStorageUsegeAmmount/day.AggreStorageTotal)*100));     
            })
        return({
            chartData:{
                labels:labels,
                datasets:[{
                 label:"Users",
                 fill: false,
                 backgroundColor:["rgba(255, 99, 132, 0.2)"],
                 borderColor: ['rgba(255, 99, 132, 0.2)',],
                 data:users
                },{
                    label:"Bugs",
                    fill: false,
                    backgroundColor:["rgba(50, 120, 132, 0.6)"],
                    borderColor: ['rgba(50, 120, 132, 0.6)',],
                    data:bugReports 
                }, {
                    label:"StorageRequests",
                    fill: false,
                    backgroundColor:["rgba(120, 99, 182, 0.6)"],
                    borderColor: ['rgba(120, 99, 182, 0.6)',],
                    data:StorageRequests 
                },{
                    label:"Aggregate",
                    fill: false,
                    backgroundColor:["rgba(170, 0, 65, 0.6)"],
                    borderColor: ['rgba(170, 0, 65, 0.6)',],
                    data:aggre 
                },
                ]
            }
        })
        }else{return<>Loading ...</>}       
     }
    async dataAsamble(){
        let Users=0;
        let Requsts=0;
        let Bugs=0;
        let Total=0;
        let Amount=0;
        let chartTitle='';
        let days;
        let ts=Date.now()
        let date_ob = new Date(ts);
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        let Sd = new Date(this.state.startDate);
        let StartDate=(Sd.getDate())+'.'+(Sd.getMonth() + 1)+'.'+Sd.getFullYear();
        let Ed = new Date(this.state.endDate);
        let EndDate =(Ed.getDate()+1)+'.'+(Ed.getMonth() + 1)+'.'+Ed.getFullYear();
        if(this.state.startDate!==null&&this.state.endDate!==null)
        {
            await axios.get(`http://localhost:3000/MonthDateRoute/range/${StartDate}/${EndDate}`)
            .then((res)=>{
                days=res.data
                chartTitle=`${StartDate} / ${EndDate}`
            })
        }else{
            await axios.get(`http://localhost:3000/MonthDateRoute/Month/${month}.${year}`)
            .then((res)=>{
                days=res.data.Req
                chartTitle=`${month}.${year}`
            })
        }
        days.forEach(day=>{
            Users+=day.users;
            Requsts+=day.StorageRequests;
            Bugs+=day.bugReports;
            Total+=day.AggreStorageTotal;
            Amount+=day.AggreStorageUsegeAmmount;
        });
        this.setState({
            Users:Users,
            chartTitle:chartTitle,
            Requsts:Requsts,
            Bugs:Bugs,
            days:days,
            Aggregates:{Total:Total,Amount:Amount}
        })
    }
    CalcAggre(){
        if(this.state.Aggregates)
        {
            return(<>{parseInt((this.state.Aggregates.Amount/this.state.Aggregates.Total)*100)}%</>)        
        }else{
            return(<> Loading</>)
        }
    }
    componentDidMount(){
        this.dataAsamble()
    }
    componentDidUpdate(){
        if(this.state.startDate!==null&&this.state.endDate!==null&&this.state.flag)
            {
                this.dataAsamble()
                this.setState({flag:false})
            }
    }

render(){
    return(
    <div className="">
    <div className="cuntiner-fluid ">
        <div className="row">
            <div id="sidebarMenu" className="col-md-2 col-lg-2 d-md-block sidebar collapse">
                <AdminCompNav User={this.props.User}/>
            </div>
            <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4 bg-white">
                <div className="chartjs-size-monitor" style={{positon: 'absolute',left: '0px', top: '0px', right: '0px', bottom: '0px', overflow: 'hidden', visibility: 'hidden'}}></div>
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                        <h1 className="h2">Dashboard</h1>
                        <div className='btn-toolbar mb-2 mb-md-0 pr-5'>
                        
                        <DateRangePicker
                        startDate={this.state.startDate} // momentPropTypes.momentObj or null,
                        startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                        endDate={this.state.endDate} // momentPropTypes.momentObj or null,
                        endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                        onDatesChange={({ startDate, endDate}) => this.setState({ startDate, endDate,flag:true})} // PropTypes.func.isRequired,
                        focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                        isOutsideRange={date => date.isBefore(new Date(2020, 9, 24)) || date.isAfter(new Date())}
                        onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
                        />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-6 col-lg-5">
                            <div className="row mb-3">
                                <div className="col-lg-6">
                                    <div className="card widget-flat">
                                        <div className="card-body">
                                            <div className="float-right">
                                            </div>
                                            <h5 className="text-muted font-weight-normal mt-0" title="Number of Customers">
                                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-people" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1h7.956a.274.274 0 0 0 .014-.002l.008-.002c-.002-.264-.167-1.03-.76-1.72C13.688 10.629 12.718 10 11 10c-1.717 0-2.687.63-3.24 1.276-.593.69-.759 1.457-.76 1.72a1.05 1.05 0 0 0 .022.004zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10c-1.668.02-2.615.64-3.16 1.276C1.163 11.97 1 12.739 1 13h3c0-1.045.323-2.086.92-3zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                                                </svg>    
                                                {" Users"}
                                            </h5>
                                            <h3 className="mt-3 mb-3 ">{this.state.Users}</h3>
                                            <p className="mb-0 text-muted">
                                                {this.state.days[0]?
                                                <>
                                                {this.state.days[0].users>this.state.days[this.state.days.length-1].users
                                                ?
                                                <span className="text-danger mr-2">
                                                    {parseInt((this.state.days[0].users/this.state.days[this.state.days.length-1].users)*-100 )+'%'}
                                                </span>
                                                :
                                                <span className="text-success mr-2">
                                                    {parseInt((this.state.days[0].users/this.state.days[this.state.days.length-1].users)*100) +'%'}
                                                </span>
                                                }
                                                <span className="text-nowrap">
                                                    {this.state.days[0].Date+'/'+this.state.days[this.state.days.length-1].Date}
                                                </span>
                                                </>:null}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="card widget-flat">
                                        <div className="card-body">
                                            <div className="float-right">
                                            </div>
                                            <h5 className="text-muted font-weight-normal mt-0" title="Number of Customers">
                                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-hdd" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M14 9H2a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1zM2 8a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2H2z"/>
                                                <path d="M5 10.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm-2 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
                                                <path fillRule="evenodd" d="M4.094 4a.5.5 0 0 0-.44.26l-2.47 4.532A1.5 1.5 0 0 0 1 9.51v.99H0v-.99c0-.418.105-.83.305-1.197l2.472-4.531A1.5 1.5 0 0 1 4.094 3h7.812a1.5 1.5 0 0 1 1.317.782l2.472 4.53c.2.368.305.78.305 1.198v.99h-1v-.99a1.5 1.5 0 0 0-.183-.718L12.345 4.26a.5.5 0 0 0-.439-.26H4.094z"/>
                                            </svg>
                                                {" Storage"}
                                            </h5>
                                            <h3 className="mt-3 mb-3">{this.CalcAggre()}</h3>
                                            <p className="mb-0 text-muted">
                                            {this.state.days[0]?
                                                <>
                                                {((this.state.days[0].AggreStorageUsegeAmmount/this.state.days[0].AggreStorageTotal)*100)>
                                                ((this.state.days[this.state.days.length-1].AggreStorageUsegeAmmount/this.state.days[this.state.days.length-1].AggreStorageTotal)*100)
                                                ?
                                                <span className="text-danger mr-2">
                                                    {parseInt((((this.state.days[0].AggreStorageUsegeAmmount/this.state.days[0].AggreStorageTotal)*100)-
                                                ((this.state.days[this.state.days.length-1].AggreStorageUsegeAmmount/this.state.days[this.state.days.length-1].AggreStorageTotal)*100))*-1)+'%'}
                                                </span>
                                                :
                                                <span className="text-success mr-2">
                                                    {parseInt((((this.state.days[0].AggreStorageUsegeAmmount/this.state.days[0].AggreStorageTotal)*100)-
                                                ((this.state.days[this.state.days.length-1].AggreStorageUsegeAmmount/this.state.days[this.state.days.length-1].AggreStorageTotal)*100))*-1)+'%'}
                                                </span>
                                                }
                                                <span className="text-nowrap">
                                                    {this.state.days[0].Date+'/'+this.state.days[this.state.days.length-1].Date}
                                                </span>
                                                </>:null}

                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="card widget-flat">
                                        <div className="card-body">
                                            <div className="float-right">
                                                <i className="mdi mdi-account-multiple widget-icon"></i>
                                            </div>
                                            <h5 className="text-muted font-weight-normal mt-0" title="Number of Customers">
                                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-clipboard-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                                                    <path fillRule="evenodd" d="M9.5 1h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3zm4.354 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                                                </svg>
                                                {" Requests"}
                                            </h5>
                                            <h3 className="mt-3 mb-3">{this.state.Requsts}</h3>
                                            <p className="mb-0 text-muted">
                                            {this.state.days[0]?
                                                <>
                                                {this.state.days[0].StorageRequests>this.state.days[this.state.days.length-1].StorageRequests
                                                ?
                                                <span className="text-danger mr-2">
                                                    {parseInt((this.state.days[0].StorageRequests/this.state.days[this.state.days.length-1].StorageRequests)*-100 )+'%'}
                                                </span>
                                                :
                                                <span className="text-success mr-2">
                                                    {parseInt((this.state.days[0].StorageRequests/this.state.days[this.state.days.length-1].StorageRequests)*100) +'%'}
                                                </span>
                                                }
                                                <span className="text-nowrap">
                                                    {this.state.days[0].Date+'/'+this.state.days[this.state.days.length-1].Date}
                                                </span>
                                                </>:null}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="card widget-flat">
                                        <div className="card-body">
                                            <div className="float-right">
                                                <i className="mdi mdi-account-multiple widget-icon"></i>
                                            </div>
                                            <h5 className="text-muted font-weight-normal mt-0" title="Number of Customers">
                                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-bug" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A4.979 4.979 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A4.985 4.985 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623zM4 7v4a4 4 0 0 0 3.5 3.97V7H4zm4.5 0v7.97A4 4 0 0 0 12 11V7H8.5zM12 6H4a3.99 3.99 0 0 1 1.333-2.982A3.983 3.983 0 0 1 8 2c1.025 0 1.959.385 2.666 1.018A3.989 3.989 0 0 1 12 6z"/>
                                                </svg>
                                                {" Bugs"}
                                            </h5>
                                            <h3 className="mt-3 mb-3">{this.state.Bugs}</h3>
                                            <p className="mb-0 text-muted">
                                            
                                            {this.state.days[0]?
                                                <>
                                                {this.state.days[0].bugReports>this.state.days[this.state.days.length-1].bugReports
                                                ?
                                                <span className="text-danger mr-2">
                                                    {parseInt((this.state.days[0].bugReports/this.state.days[this.state.days.length-1].bugReports))*-100 +'%'}
                                                </span>
                                                :
                                                <span className="text-success mr-2">
                                                    {parseInt((this.state.days[0].bugReports/this.state.days[this.state.days.length-1].bugReports)*100) +'%'}
                                                </span>
                                                }
                                                <span className="text-nowrap">
                                                    {this.state.days[0].Date+'/'+this.state.days[this.state.days.length-1].Date}
                                                </span>
                                                </>:null}

                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7 col-xl-6">
                            <div className="card ">
                                <div className="card-body" style={{position: "relative"}}>
                                    <div id="high-performing-product" className="align-items-center pt-4 pb-3">
                                         <div className="mar" style={{position:'relative'}}>
                                            <Chart type='line' title={this.state.chartTitle} chartData={this.SetData()}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </main>
        </div>
    </div>
    </div>
    )}
    }
export default Admin