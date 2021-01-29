import React, { Component} from'react'
import axios from 'axios'


class StorageGraft extends Component{
    constructor(props){
        super(props);
        this.state={
            Aggre:'',
            SVMSArray:[],
        }
    }
    componentDidMount(){
        let Aggre;
        let SVMSArray;
        console.log(this.props)
        axios.get(`Aggregate/Aggre/${this.props.Aggre}`)
        .then(async(res)=>{
            Aggre=res.data[0];
            await axios.get(`SvmRoute/SvmByAggreName/${this.props.Aggre}`)
            .then((res)=>{
            console.log(res.data)
            SVMSArray=res.data

            });
            this.setState({Aggre:Aggre,SVMSArray:SVMSArray})
         });
    
    }
    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
    getBar(){
        return(
            this.state.SVMSArray.map((SVM)=>{
                let percentage=0;
                if(SVM.Amount!==0)
                    percentage=(SVM.Amount/this.state.Aggre.TotalAmount)*100;
                return(
                    <div key={SVM._id} className="progress-bar progress-bar-striped"
                    role="progressbar"
                    data-toggle="tooltip" data-placement="bottom" title={`${SVM.name}--${SVM.Amount}GB`}
                    style={{width:`${percentage-0.5}%`,backgroundColor:`${this.getRandomColor()}`}}>
                        {percentage}%
                </div>
                )
            })
        )
    }
    
    render(){
        console.log(this.state.Aggre)
        return(
            <>
            {this.state.Aggre?
                <div className="progress">
                    {this.state.Aggre.Amount!==0?
                    <>
                        {this.state.Aggre.TotalAmount!==0?
                            <div className="progress-bar progress-bar-striped bg-success"
                                role="progressbar"
                                data-toggle="tooltip" data-placement="bottom" title={`Free Space--${this.state.Aggre.TotalAmount-this.state.Aggre.Amount}GB`}
                                style={{width:`${((this.state.Aggre.Amount/this.state.Aggre.TotalAmount)*-100)+100}%`}}>
                                    {((this.state.Aggre.Amount/this.state.Aggre.TotalAmount)*-100)+100}%
                            </div>
                        :       <div className="progress-bar progress-bar-striped bg-danger tooltip"
                                role="progressbar"
                                data-toggle="tooltip" data-placement="bottom" title={'Data Error'}
                                style={{width:`${100}%`}}>
                                {Error}%
                                </div>
                            }
                    </>
                    :<div className="progress-bar progress-bar-striped bg-success"
                             role="progressbar"
                             data-toggle="tooltip" data-placement="bottom" title={`Free Space--${this.state.Aggre.TotalAmount-this.state.Aggre.Amount}GB`}
                             style={{width:`${100}%`}}>
                                {100}%
                        </div>
                    }
                    {this.getBar()}
                </div>
                :
                <div className="spinner-grow spinner-grow-sm" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                }
            </>
            );
    }

}
export default StorageGraft