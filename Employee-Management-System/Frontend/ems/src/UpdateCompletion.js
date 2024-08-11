import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';


function UpdateCompletion({empid,taskid,refresh,weight,completion_percentage}) {

    const SERVER_URL = 'http://127.0.0.1:5000'

  const [show, setShow] = useState(false);
  const [percent, setPercent] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

    const handleUpdate = async () => {
        if (isNaN(percent)){
          alert("Percentage Added Must Be A Number")
          return
        }
        if (percent % 1 !== 0){
          alert("Percentage Added Must Be An Integer")
          return
        }
        if (percent > weight - completion_percentage){
          alert("Percentage Added Exceeds Max Weight For This Task")
          return
        }
        else if (percent <= 0){
          alert("Percentage Added Must Be Greater Than 0")
          return
        }
        console.log(percent);
        fetch(`${SERVER_URL}/updateCompletion`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({empid: parseInt(empid,10),taskid: parseInt(taskid,10), completion: parseFloat(percent)}),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            setPercent("");
            refresh();
            handleClose();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }



  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add Completion
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Completion Percentage</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <InputGroup className="mb-3">
        <InputGroup.Text id="inputGroup-sizing-default">
          Completion Percentage
        </InputGroup.Text>
        <Form.Control
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
          value={percent}
          onChange={(e) => setPercent(e.target.value)}
        />
      </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateCompletion;