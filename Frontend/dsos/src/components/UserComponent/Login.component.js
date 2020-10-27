import React,{Component}from 'react';
import axios from 'axios';
import { withRouter } from "react-router-dom";

class Login extends Component{
    
    constructor(props){
        super(props);
        this.onChangeUsername=this.onChangeUsername.bind(this);
        this.onChangePassword=this.onChangePassword.bind(this);
        this.onsubmit=this.onsubmit.bind(this);
        
        this.state={
            username:'',
            password:'',
        }
    }
    // handeling the form fields
    onChangeUsername(e){
        this.setState({
            username:e.target.value
        });
    }
    onChangePassword(e){
        this.setState({
            password:e.target.value
        });
    }
    // submiting the form
    onsubmit(e){
        e.preventDefault();
        const User={
            username:this.state.username,
            password:this.state.password
        }

        // checking if the user username and password is the sane as saved as in the db
        axios.post('http://localhost:3000/users/login',User)
            .then(res=>{
                if(res.data)
                {   console.log(res.data[0])
                    this.props.Auth(res.data[0])
                    if(res.data[0].Admin){
                        this.props.history.push("/admin");
                    }else if(res.data[0].Architect){
                        this.props.history.push("/Architect");
                    }else{
                        this.props.history.push("/Home");
                    }
                }
            })
            .catch(err=>{(this.props.msg('UserName or password is incurrect'))
            })
        }
    // rendering the login form
    render(){
        return(
            <div>
            <h3>Login</h3>
            <form onSubmit={this.onsubmit}>
                <div className="form-group">
                    <label>Username:</label>
                    <input type='text' required
                    className="form-control" value={this.state.username}
                    onChange={this.onChangeUsername}/>
                </div>
                <div className="form-group">
                    <label>password:</label>
                    <input type='password' required
                    className="form-control" value={this.state.password}
                    onChange={this.onChangePassword}/>
                </div>
                <div>
                    <button type="submit" className="btn btn-outline-primary btn-block">Login</button>
                </div>
            </form>
        </div>
        )
    }
}
export default withRouter(Login)

