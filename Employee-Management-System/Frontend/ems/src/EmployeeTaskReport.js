import { useEffect, useState, useCallback} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { Chart } from "react-google-charts";
import ProgressBar from 'react-bootstrap/ProgressBar';

const SERVER_URL = 'http://127.0.0.1:5000'




function EmployeeTaskReport({empid}) {

  const [show, setShow] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [tasks2, setTasks2] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (tasks.length > 0) {
      setShow(true);
    }
    else{
      alert("No tasks to show");
    }
  }

  const fetchTasks = useCallback(async () => {
    const response = await fetch(`${SERVER_URL}/getTaskUpdatesForEmployee?emp_id=${empid}`);
    if (response.ok) {
        const data = await response.json();
        console.log(data);
        setTasks(data);
    } else {
        console.error('Failed to fetch tasks:', response.status);
    }

    const response2 = await fetch(`${SERVER_URL}/getTasksForEmployee?emp_id=${empid}`,
        { method: 'GET' }
      );
    if (response2.ok) {
        const data = await response2.json();
        console.log(data);
        setTasks2(data);
    } else {
        console.error('Failed to fetch tasks:', response2.status);
    }
}, [empid]);

  useEffect(() => { fetchTasks(); },[show, fetchTasks]);

  const color = (completion,weight) => {
    if (weight === completion){
      return "success"
    }
    else{
      return "info"
    }
  }

  const data = [
    ['Task', 'Progress Percentage', { role: 'style' }],
    ...tasks.map(task => [task.name + "\nDate: " + task.datetime, parseInt(task.percentage, 10), 'color: green'])
  ];

  // Chart options
  const options = {
    title: "Task Progress",
    bar: { groupWidth: "95%" },
    legend: { position: "none" },
  };




  return (


    <>
      <Button variant="primary" onClick={handleShow}>
        Task Report
      </Button>

      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Task Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        

        <Chart
      chartType="ColumnChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Task ID</th>
          <th>Task Name</th>
          <th>Description</th>
          <th>Completion Percentage</th>
          <th>Weight Percentage</th>
        </tr>
      </thead>
      <tbody>
        {tasks2.map((task) => (
          <tr key={task.id}>
            <td>{task.id}</td>
            <td>{task.name}</td>
            <td>{task.description}</td>
            <td><ProgressBar animated now={task.percent_completion} label={task.percent_completion} variant={color(task.percent_completion,task.weight)}/></td>
            <td><ProgressBar now={task.weight} label={`${task.weight}%`}/></td>
          </tr>
        ))}
      </tbody>
    </Table>
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

export default EmployeeTaskReport;