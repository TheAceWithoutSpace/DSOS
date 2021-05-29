import React from 'react'
import {Modal} from 'react-bootstrap'
function ModleTemplate(showflag) {
    return(
      <div>
      <Modal show={showflag.showflag}  aria-labelledby="contained-modal-title-vcenter">
        <Modal.Header>
          <Modal.Title>Sending Request </Modal.Title>
        </Modal.Header>
        <Modal.Body>
              <div className="d-flex justify-content-center" style={{marginTop:"6%",marginBottom:"6%"}}>
                  <div className="spinner-grow ml-3"  style={{color:"pink",animationDuration:"1.5s"}} role="status"></div>
                  <div className="spinner-grow ml-3 text-warning" style={{animationDuration:"2.5s"}} role="status"></div>
                  <div className="spinner-grow ml-3 text-info"style={{animationDuration:"3s"}} role="status"></div>
              </div>
              Sending Request please wait ,you will be transfer to the home page when the pross is finished
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
      </div>
    )
  }
    export default ModleTemplate;
