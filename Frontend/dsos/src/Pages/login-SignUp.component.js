import React from 'react';
import Login from '../components/UserComponent/Login.component';
import Signup from '../components/UserComponent/createUser.component';
import Message from '../components/Message';
class Login_Signup extends React.Component{
    constructor(props){
        super(props);
        this.state={flag:false,ButtonMsg:'Sign Up',message:''};
        this.ToLogin=this.ToLogin.bind(this);
        this.setMsg=this.setMsg.bind(this);
    }

    componentDidMount(){
            this.setState({flag:!this.state.flag})
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
    render()
    {
        console.log(this.state.message)
        return(
            <div className="container" >
                {this.state.message?<Message msg={this.state.message}/>:''}
                <div className="row"style={{marginLeft:'30%',paddingTop:'10%'}}>
                    {this.state.flag?
                    <div className="col-md-7">
                        <Login Auth={this.props.setUser} msg={this.setMsg}/>
                    </div>
                    :<div className="col-md-7">
                        <Signup  Auth={this.props.setUser} msg={this.setMsg}/>
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