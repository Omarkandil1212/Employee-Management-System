import { useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import ProgressBar from 'react-bootstrap/ProgressBar';

const SERVER_URL = 'http://127.0.0.1:5000'


function TasksTable({tasks, setTasks, refreshTasks}) {
    useEffect(() => {
        const fetchData = async () => {
          const response = await fetch(`${SERVER_URL}/getTasks`);
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            setTasks(data);
          } else {
            console.error('Failed to fetch tasks:', response.status);
          }
        };
    
        fetchData().catch(console.error);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [refreshTasks]);

  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>ID</th>
          <th>Task Name</th>
          <th>Description</th>
          <th>Completion Percentage</th>
          <th>Due Date</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td>{task.id}</td>
            <td>{task.name}</td>
            <td>{task.description}</td>
            <td><ProgressBar now={task.completion_percentage} label={`${task.completion_percentage}%`} /></td>
            <td>{task.due_date}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TasksTable;