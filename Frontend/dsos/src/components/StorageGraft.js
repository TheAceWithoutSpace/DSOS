import React, { Component} from'react'
import axios from 'axios'
import LoadingAnimation from "./Loading"

// Admin Storage chart
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
        // get the aggregate by name 
        axios.get(`Aggregate/Aggre/${this.props.Aggre}`)
        .then(async(res)=>{
            Aggre=res.data.res[0];
            // get all the svms by aggregate name 
            await axios.get(`SvmRoute/SvmByAggreName/${this.props.Aggre}`)
            .then((res)=>{
            console.log(res.data.res)
            SVMSArray=res.data.res

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
      // create a bar to display the aggregate status for each svm inside the aggregate
    getBar(){
        return(
            this.state.SVMSArray.map((SVM)=>{
                let percentage=0;
                console.log(SVM)
                if(SVM.total!==0)
                    {
                        percentage=((SVM.total/this.state.Aggre.total)*100);
                        console.log(percentage)
                    }
                return(
                    <div key={SVM._id} className="progress-bar progress-bar-striped"
                    role="progressbar"
                    data-toggle="tooltip" data-placement="bottom" title={`${SVM.Name}--${SVM.total}GB`}
                    style={{width:`${percentage}%`,backgroundColor:`${this.getRandomColor()}`}}>
                        {percentage.toFixed(3)}%
                </div>
                )
            })
        )
    }
    // render the storage chart
    render(){
        console.log(this.state.Aggre)
        return(
            <>
            {this.state.Aggre?
                <div className="progress">
                    {this.state.Aggre.used!==0?
                    <>
                        {this.state.Aggre.total!==0?
                            <div className="progress-bar progress-bar-striped bg-success"
                                role="progressbar"
                                data-toggle="tooltip" data-placement="bottom" title={`Free Space--${this.state.Aggre.leftToAllocate}GB`}
                                style={{width:`${(this.state.Aggre.full)*-1+100}%`}}>
                                    {(this.state.Aggre.full)*-1+100}%
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
                             data-toggle="tooltip" data-placement="bottom" title={`Free Space--${this.state.Aggre.leftToAllocate}GB`}
                             style={{width:`${100}%`}}>
                                {100}%
                        </div>
                    }
                    {this.getBar()}
                </div>
                :<LoadingAnimation/>
                }
            </>
            );
    }

}
export default StorageGraft