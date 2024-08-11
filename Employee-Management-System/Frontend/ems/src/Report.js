import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Chart } from "react-google-charts";

const SERVER_URL = 'http://127.0.0.1:5000'


function Report() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
      if(tasks.length > 0){
          setShow(true);
      }
        else{
            alert("No tasks to show");
        }
  };

  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const response = await fetch(`${SERVER_URL}/getTaskGraphs`,
        { method: 'GET' }
      );
    if (response.ok) {
        const data = await response.json();
        console.log(data);
        setTasks(data);
    }
    else {
        console.error('Failed to fetch tasks:', response.status);
    }
    }


  useEffect(() => { fetchTasks(); } ,[show]);




  return (
    <>
      <Button variant="primary" onClick={handleShow} className='mt-4'>
        Report
      </Button>

      <Modal show={show} onHide={handleClose} size = "xl">
        <Modal.Header closeButton>
          <Modal.Title>Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {tasks.map((task) => (
                (task.updates.length <= 0 || <div>
                    <h3>{task.name}</h3>
                    <h6>{task.description}</h6>
                    <Chart
                        width={'100%'}
                        height={'300px'}
                        chartType="ColumnChart"
                        data={[
                            ['Employee', 'Progress Percentage'],
                            ...task.updates.map(update => [update.emp_name.toString() + "\n" + update.date, parseInt(update.completion_percentage, 10)])
                        ]}
                    />
                </div>)
            ))
            }


        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Report;