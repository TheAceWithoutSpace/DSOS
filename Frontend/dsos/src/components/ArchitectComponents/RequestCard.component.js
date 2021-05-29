import React from'react';
import{Link} from 'react-router-dom';

export default class RequestCard extends React.Component{

    state={
        Username:this.props.Username,
        email:this.props.email,
        File:this.props.File,
        Name:this.props.Name,
        Amount:this.props.Amount,
        type:this.props.type
    }

    // the request card render by type or svm or volume
    render(){
        console.log(this.props)
        if(this.props.type==="volume")
        {
            return(
            <div className="card border-info" >
                <div className="card-body">
                <h4 className="card-title">{this.props.type}<br/> Request</h4>
                <h5>{this.props.Username}</h5>
                <p>{this.props.email}<br/>
                Request for: {this.props.Amount}GB</p>
                <Link className='btn btn-info' to={`/ArchitectViewRequest/${this.props.id}`}>ShowMore</Link>
            </div>
        </div>)
        }else{
        return(
        <div className="card border-info" >
            <div className="card-body">
                <h4 className="card-title">{this.props.type}<br/> Request</h4>
                <h5>{this.props.Username}</h5>
                <p>{this.props.email}</p>
                <br/>
                <Link className='btn btn-info' to={`/ArchitectViewRequest/${this.props.id}`}>ShowMore</Link>
            </div>
        </div>
    )}
    }
}
