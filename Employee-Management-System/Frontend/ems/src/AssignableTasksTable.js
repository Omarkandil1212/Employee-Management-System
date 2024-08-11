import { useEffect , useState} from 'react';
import Form from 'react-bootstrap/Form';

const SERVER_URL = 'http://127.0.0.1:5000'


function AssignableTasksTable({emp_id,setTask_id}) {

    const [tasks, setTasks] = useState([]);

    // const [refresh, setRefresh] = useState(false);

    // const triggerRefresh = () => {
    //     setRefresh(prevState => !prevState);
    // }

    useEffect(() => {
        const fetchData = async () => {
          const response = await fetch(`${SERVER_URL}/getAssignableTasks?emp_id=${emp_id}`);
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            setTasks(data);
            if (data.length > 0) {
              setTask_id(data[0].id);
            }
          } else {
            console.error('Failed to fetch tasks:', response.status);
          }
        };
    
        fetchData().catch(console.error);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

    
      const handleSelectChange = (event) => {
        setTask_id(event.target.value); // Update task_id in the parent component
    };

  return (
    <Form.Select aria-label="Default select example" onChange={handleSelectChange}>
        {tasks.map((task) => (
            <option key={task.id} value={task.id}>
            ID: {task.id} | Task Name: {task.name} | Task Due Date: {task.due_date} | Remaining Weight: {task.remaining_weight}
        </option>

        ))}

    </Form.Select>
  );
}

export default AssignableTasksTable;