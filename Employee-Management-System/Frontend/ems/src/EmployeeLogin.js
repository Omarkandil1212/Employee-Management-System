import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';

function EmployeeLogin() {

    const [employeeID, setEmployeeID] = useState('');
    const navigate = useNavigate(); 

    const IDexists = async () => {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/checkEmployeeId?emp_id=${employeeID}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        console.log(data);
        return data.exists;
    }

    const login = async () => {
      if(await IDexists()){
      navigate('/employeePage',{state: {emp_id : employeeID}})
      }
      else if(isNaN(employeeID)){
        alert("Employee ID should be a number. Please enter a valid Employee ID.")
      }
      else{
        alert("Employee ID does not exist in the database. Please enter a valid Employee ID.")
      }
    }


  return (
    <div className='App'>
      <div className='App-header'>
        <h1>Employee Login</h1>
        <hr />
      </div>
      <InputGroup className="mb-3">
        <InputGroup.Text id="inputGroup-sizing-default">
          Employee ID
        </InputGroup.Text>
        <Form.Control
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
            value={employeeID}
          onChange={(e) => {setEmployeeID(e.target.value)}}
        />
      </InputGroup>
      <Button variant="primary" onClick={login} className = "me-1">Login</Button>
      <Button variant="danger" onClick={() => navigate('/') }>Back</Button>
      </div>
  );
}

export default EmployeeLogin;