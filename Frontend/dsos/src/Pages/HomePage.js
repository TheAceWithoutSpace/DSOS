import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaw} from '@fortawesome/free-solid-svg-icons'
import "../components/Home.css"

class HomePage extends React.Component{

    render(){
         return(
        <div id="homeBody">
            <div className="container">
	            <div className="row">
		            <div className="col-lg-12">
                        <div id="content">
                            <h1 id="h1" style={{paddingRight:"5rem"}}>We provide the tools.</h1>
                            <h1 id="h1" style={{paddingLeft:"5rem"}}>You change the world.</h1>
                            <hr/>
                                <h3 id ="h3">
                                Achieve your goals with the freedom and flexibility to build,<br/>
                                manage, and deploy your applications anywhere.
                                Use your preferred languages, frameworks, and infrastructure to solve challenges large and small.
                                </h3>
                            <hr/>
                            <button onClick={()=>{window.location="/SignUP"}} className="btn btn-light btn-lg">
                                <FontAwesomeIcon   icon={faPaw}/>
                                  get started!
                            </button>
                        </div>
	                </div>
                </div>
            </div>
        </div>
        )
    }
}
export default HomePage;