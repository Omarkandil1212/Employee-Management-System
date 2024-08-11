import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function TaskInput({id, setId, taskName, setTaskName, description, setDescription, endDate, setEndDate}) {


  return (
    <>
        <InputGroup className="mb-3">
              <InputGroup.Text>ID</InputGroup.Text>
              <Form.Control
                value={id}
                onChange={e => setId(e.target.value)}
                type="text"
              />
        </InputGroup>
        <InputGroup className="mb-3">
              <InputGroup.Text>Task Name</InputGroup.Text>
              <Form.Control
                value={taskName}
                onChange={e => setTaskName(e.target.value)}
                type="text"
              />
        </InputGroup>
        <InputGroup className="mb-3">
              <InputGroup.Text>Description</InputGroup.Text>
              <Form.Control
                value={description}
                onChange={e => setDescription(e.target.value)}
                type="text"
              />
        </InputGroup>
        <InputGroup className="mb-3">
              <InputGroup.Text>End Date</InputGroup.Text>
              <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
        </InputGroup>
        
        


    </>
  );
}

export default TaskInput;