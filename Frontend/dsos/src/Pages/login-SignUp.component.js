import React from 'react';
import Login from '../components/UserComponent/Login.component';
import Signup from '../components/UserComponent/createUser.component';
import Message from '../components/Message';
import axios from 'axios';
class Login_Signup extends React.Component{
    constructor(props){
        super(props);
        this.state={flag:true,ButtonMsg:'Sign Up',message:''};
        this.ToLogin=this.ToLogin.bind(this);
        this.setMsg=this.setMsg.bind(this);
    }

    ToLogin(flag)
    {
        this.setState({flag:flag})
        if(flag===true){
            this.setState({ButtonMsg:'Sign Up'});
        }else{
            this.setState({ButtonMsg:'Login'})
        }
    }
    setMsg(msg){
        this.setState({message:msg})
    }
    componentDidMount()
    {
        let ts=Date.now()
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        axios.get(`MonthDateRoute/Date/${month+"-"+date+"-"+year}`)
        .then(async(res)=>{
            if(!res.data[0]){
                await axios.post("MonthDateRoute/add")
            }
        })        
    }
    render()
    {
        return(
            <div className="container" >
                {this.state.message?<Message msg={this.state.message}/>:''}
                <div className="row"style={{marginLeft:'30%',paddingTop:'10%'}}>
                    {this.state.flag?
                    <div className="col-md-7">
                        <Login msg={this.setMsg}/>
                    </div>
                    :<div className="col-md-7">
                        <Signup msg={this.setMsg}/>
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
export default Login_Signup;