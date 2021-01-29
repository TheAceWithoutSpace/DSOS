import React,{Component}from 'react';
import axios from 'axios';
import { withRouter } from "react-router-dom";

class createUser extends Component{
    
    constructor(props){
        super(props);
        this.onChangeUsername=this.onChangeUsername.bind(this);
        this.onChangeemail=this.onChangeemail.bind(this);
        this.onChangePassword=this.onChangePassword.bind(this);
        this.onChangeTeam=this.onChangeTeam.bind(this);
        this.onChangNickName=this.onChangNickName.bind(this);
        this.onsubmit=this.onsubmit.bind(this);
        
        this.state={
            username:'',
            NickName:'',
            email:'',
            password:'',
            Team:'',
        }
    }
    // handeling form fields
    onChangeUsername(e){
        this.setState({
            username:e.target.value
        });
    }
    onChangNickName(e){
        this.setState({
            NickName:e.target.value
        })
    }
    onChangeTeam(e){
        this.setState({
            Team:e.target.value
        });
    }
    onChangeemail(e){
        this.setState({
            email:e.target.value
        });
    }
    onChangePassword(e){
        this.setState({
            password:e.target.value
        });
    }
    // submiting the form and creating new user in the server
    onsubmit(e){
        e.preventDefault();
        const user={
            username:this.state.username,
            NickName:this.state.NickName,
            email:this.state.email,
            password:this.state.password,
            Team:this.state.Team,
        }

        axios.post('users/add',user)
            .then(async res=>{
                let ts=Date.now()
                let date_ob = new Date(ts);
                let day= date_ob.getDate();
                let month = date_ob.getMonth() + 1;
                let year = date_ob.getFullYear();
                await axios.post(`MonthDateRoute/users/${month}-${day}-${year}`)
                .then((res)=>{console.log(res)})
                if(res.data)
                {
                localStorage.setItem('user', JSON.stringify(res.data));
                console.log(res.data)
                if(res.data.Admin){
                   window.location.href="/admin";
                }else if(res.data.Architect){
                    window.location.href="/Architect";
                }else{
                    window.location.href="/Home";
                }
                }
            })
            .catch(err=>{this.props.msg('UserName or password is incurrect')});
    }
    // rendering the formn
    render(){
        return(
            <div>
            <h3>SignUp</h3>
            <form onSubmit={this.onsubmit}>
                <div className="form-group">
                    <label>Username:</label>
                    <input type='text' required
                    className="form-control" value={this.state.username}
                    onChange={this.onChangeUsername}/>
                </div>
                <div className="form-group">
                    <label>NickName:</label>
                    <input type='text' required
                    className="form-control" value={this.state.NickName}
                    onChange={this.onChangNickName}/>
                </div>
                <div className="form-group">
                    <label>Team:</label>
                    <input type='text' required
                    className="form-control" value={this.state.Team}
                    onChange={this.onChangeTeam}/>
                </div>
                <div className="form-group">
                    <label>email:</label>
                    <input type='email' required
                    className="form-control" value={this.state.email}
                    onChange={this.onChangeemail}/>
                </div>
                <div className="form-group">
                    <label>password:</label>
                    <input type='password' required
                    className="form-control" value={this.state.password}
                    onChange={this.onChangePassword}/>
                </div>
                <div>
                    <button type="submit" className="btn btn-outline-primary btn-block">createUser</button>
                </div>
            </form>
        </div>
        )
    }
}
export default withRouter(createUser)