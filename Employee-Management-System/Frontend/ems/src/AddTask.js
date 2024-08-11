import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import TasksTable from './TasksTable.js';
import TaskInput from './TaskInput.js';
import moment from 'moment';

const SERVER_URL = 'http://127.0.0.1:5000'

function AddTask() {
    const [show, setShow] = useState(false);

    const [id, setId] = useState('');
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [endDate, setEndDate] = useState("");


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleAdd = async () => {
        if (id === '' || taskName === '' || description === '' || endDate === '') {
            alert('Please fill all fields');
            return;
        }
        if (isNaN(id)) {
            alert('ID must be a number');
            return;
        }
        // check if id is stricly positive
        if (parseInt(id,10) <= 0) {
            alert('ID must be strictly positive');
            return;
        }
        // check if end date is in the future
        if (moment(endDate).isBefore(moment().format('YYYY-MM-DD'))) {
            alert('End date must be in the future');
            return;
        }
        // check if date is valid
        if (!moment(endDate).isValid()) {
            alert('End date must be valid');
            return;
        }
        const newTaskk = {
            id: parseInt(id,10),
            name: taskName,
            description: description,
            due_date: moment(endDate).format('YYYY-MM-DD')

        }
        const response = await fetch(`${SERVER_URL}/addTask`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTaskk)
          });
          if (response.ok) {
            triggerTaskRefresh();
            setId(''); 
            setTaskName('');
            setDescription('');
            setEndDate('');
            // handleClose();
          }
          if (!response.ok) {
            console.error('Failed to add task:', response.status);
          }
        
    }

    const [tasks, setTasks] = useState([]);
    const [refreshTasks, setRefreshTasks] = useState(false);

    const triggerTaskRefresh = () => {
        setRefreshTasks(prevState => !prevState);
    }

    return (
        <>
            <Button variant="secondary" onClick={handleShow}>
                Check And Add Task
            </Button>

            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Add Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TasksTable tasks={tasks} setTasks={setTasks} refreshTasks={refreshTasks}/>
                    <br/>
                    <TaskInput id={id} setId={setId} taskName={taskName} setTaskName={setTaskName} description={description} setDescription={setDescription} endDate={endDate} setEndDate={setEndDate}/>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAdd}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddTask;
