import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AssignableTasksTable from './AssignableTasksTable';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';


const SERVER_URL = 'http://127.0.0.1:5000'


function AssignTaskButton({emp_id}) {
  const [show, setShow] = useState(false);
  const [task_id, setTask_id] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [weight, setWeight] = useState("");

  const triggerRefresh = () => {
    setRefresh(prevState => !prevState);
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleAssign = () => {
    // add the logic of checking if the weight is bigger than max weight
    fetch(`${SERVER_URL}/getRemainingWeight?task_id=${task_id}`, {
        method: 'GET'
    }).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            console.error('Failed to fetch remaining weight:', response);
        }
    }).then((data) => {
        if (parseInt(weight,10) > parseInt(data.remaining_weight,10)) {
            alert("The weight is bigger than the remaining weight");
        }
        else if(parseInt(weight,10) <= 0){
            alert("The weight should be bigger than 0");
        }
        else {
            assignTask();
        }
    }).catch(console.error);
  }


  const assignTask = async () => {
    fetch(`${SERVER_URL}/assignTask`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              empid: parseInt(emp_id,10),
              taskid: parseInt(task_id,10),
              weight: parseInt(weight,10)
          })
          }).then((response) => {
          if (response.ok) {
              triggerRefresh();
              setWeight("");
              handleClose();

          } else {
              console.error('Failed to assign task:', response);
          }
          }).catch(console.error);
  }


  return (
    <>
      <Button variant="secondary" onClick={handleShow} className='me-1'>
        Assign Task
      </Button>

      <Modal show={show} onHide={handleClose} size = "lg">
        <Modal.Header closeButton>
          <Modal.Title>Assignable Tasks</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <AssignableTasksTable emp_id = {emp_id} setTask_id = {setTask_id} refresh={refresh}></AssignableTasksTable>
            <InputGroup className="mt-3">
              <InputGroup.Text id="inputGroup-sizing-default">
                Weight
              </InputGroup.Text>
              <Form.Control
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                  value={weight}
                onChange={(e) => {setWeight(e.target.value)}}
              />
            </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAssign}>
            Assign
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AssignTaskButton;