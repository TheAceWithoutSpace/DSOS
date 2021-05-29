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
            UserName:false,
            Email:false,
            LoadingFlag:false
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
        this.props.Loading(true);
        axios.post('users/add',user)
            .then(async res=>{
                console.log(res.data)
                    let ts=Date.now()
                    let date_ob = new Date(ts);
                    let day= date_ob.getDate();
                    let month = date_ob.getMonth() + 1;
                    let year = date_ob.getFullYear();
                    await axios.post(`MonthDateRoute/users/${month}-${day}-${year}`)
                        .then((res)=>{console.log(res)})      
                        if(res.data[0])
                        {
                        localStorage.setItem('user', JSON.stringify({_id:res.data[0]._id,U:res.data[0].username,E:res.data[0].email,A:res.data[0].Admin,Ar:res.data[0].Architect,N:res.data[0].Nickname,Hail:res.data[0].Hail}));
                        console.log(res.data[0])
                    if(res.data[0].Admin){
                       window.location.href="/admin";
                    }else if(res.data[0].Architect){
                        window.location.href="/Architect";
                    }else{
                        window.location.href="/UserDashboard";
                    }
                    }
            })
            .catch((err)=>{
                console.log(err.response)
                if(err.response.data==="Email"){
                    this.props.msg(`The Email already exists, please choose another`);
                    this.props.Loading(false);
                    this.setState({
                        Email:true,
                        UserName:false,
                    })
                }else if(err.response.data==="User Name"){
                    this.props.msg(`The User Name already exists, please choose another`);
                    this.props.Loading(false);
                    this.setState({
                        UserName:true,
                        Email:false,
                    })
                }else{
                    this.props.msg("server connections err please try again later")
                }
            });
    }
    // rendering the formn
    render(){
            return(
                <div>
                <h3>SignUp</h3>
                <form onSubmit={this.onsubmit} className="needs-validation">
                    <div className="form-group">
                        <label>Username:</label>
                        <input type='text' required
                        className={`form-control ${this.state.UserName?`is-invalid`:""}`} value={this.state.username}
                        onChange={this.onChangeUsername}/>
                    </div>
                    <div className="form-group">
                        <label>NickName:</label>
                        <input type='text' required
                        className="form-control" value={this.state.NickName}
                        onChange={this.onChangNickName}/>
                    </div>
                    <div className="form-group">
                        <label>Hail:</label>
                        <select className="custom-select" required value={this.state.Team} onChange={this.onChangeTeam}>
                        <option value="" defaultValue disabled>--chose Hail--</option> 
                        <option value="AirForce">חיל האוויר הישראלי</option>
                        <option value="EngineeringForce">חיל ההנדסה הישראלי</option>
                        <option value="educationForce">חיל החינוך והנוער‏</option>
                        <option value="personnel-management">חיל השלישות‏</option>
                        <option value="ordnance corps">חיל החימוש</option>
                        <option value="Navy">חיל הים הישראלי</option>
                        <option value="Logistics Corps">חיל  הלוגיסטיקה‏</option>
                        <option value="Military Police">חיל המשטרה הצבאית</option>
                        <option value="women's corps">חיל נשים</option>
                        <option value="Chief Corps Officers">קציני חילות ראשיים בצה"ל</option>
                        <option value="Communications">חיל הקשר והתקשוב</option>
                        <option value="Infantry">חיל הרגלים הישראלי</option>
                        <option value="medical corps">חיל הרפואה</option>
                        <option value="Armored Corps">חיל השריון הישראלי</option>
                        <option value="Artillery Corps">חיל התותחנים הישראלי‏</option>

                        </select>
                    </div>
                    <div className="form-group">
                        <label>email:</label>
                        <input type='email' required
                        className={`form-control ${this.state.Email?`is-invalid`:''}`} value={this.state.email}
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