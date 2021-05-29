import React from 'react';
import Login from '../components/UserComponent/Login.component';
import Signup from '../components/UserComponent/createUser.component';
import Message from '../components/Message';
import axios from 'axios';
import LoadingAnimation from'../components/Loading.js'

class Login_Signup extends React.Component{
    constructor(props){
        super(props);
        this.state={flag:this.props.flag,ButtonMsg:'Sign Up',message:'',LoadingFlag:false};
        this.ToLogin=this.ToLogin.bind(this);
        this.setMsg=this.setMsg.bind(this);
        this.Loading=this.Loading.bind(this);
    }
    //flag that handle the transformation between login to sign up
    ToLogin(flag)
    {
        this.setState({flag:flag})
        if(flag===true){
            this.setState({ButtonMsg:'Sign Up'});
        }else{
            this.setState({ButtonMsg:'Login'})
        }
    }
    //error massge
    setMsg(msg){
        this.setState({message:msg})
    }
    Loading(Flag){
        this.setState({LoadingFlag:Flag});
    }
    componentDidMount()
    {
        let ts=Date.now()
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        //check if the corrent day exsist if not create a new one
        axios.get(`MonthDateRoute/Date/${month+"-"+year}`)
        .then(async(res)=>{
            if(res.data.res[0].Data[res.data.res[0].Data.length-1].Date!==date){
                
                await axios.post("MonthDateRoute/add")
            }
        })        
    }
    render()
    {
        if(this.state.LoadingFlag){
            return(<LoadingAnimation/>)
        }else{
            return(
                <div className="container" >
                    {this.state.message?<Message msg={this.state.message}/>:''}
                    <div className="row"style={{marginLeft:'30%',paddingTop:'10%'}}>
                        {this.state.flag?
                        <div className="col-md-7">
                            <Login msg={this.setMsg} Loading={this.Loading}/>
                        </div>
                        :<div className="col-md-7">
                            <Signup msg={this.setMsg} Loading={this.Loading}/>
                        </div>}
                        <div className="col-md-7">
                            <br/>
                        <button onClick={()=>{this.ToLogin(!this.state.flag)}} className="btn btn-outline-info btn-block">{this.state.ButtonMsg}</button>
                        </div> 
                </div>
                </div>
                )
        }
    }
}
export default Login_Signup;