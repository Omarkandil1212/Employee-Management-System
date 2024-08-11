import React, { useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import AssignTaskButton from './AssignTaskButton';
import EmployeeTaskReport from './EmployeeTaskReport';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';


const SERVER_URL = 'http://127.0.0.1:5000'



function EmployeeTable({employeesProp,setEmployeesProp,triggerEmployeeValue}) {



  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${SERVER_URL}/getEmployees`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setEmployeesProp(data);
      } else {
        console.error('Failed to fetch employees:', response.status);
      }
    };

    fetchData().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerEmployeeValue]);

  const getColor = (score) => {
    if (score <= 3) return 'danger';
    if (score <= 6) return 'warning';
    return 'success';
  };

  const sendEmail = async (emp_id) => {
    const response = await fetch(`${SERVER_URL}/requestMeeting?emp_id=${emp_id}`);
    if (response.ok) {
      console.log('Email sent');
      alert("Email Sent");
    } else {
      console.error('Failed to send email:', response.status);
      alert("Failed to send email");
    }
  }

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Age</th>
          <th>Job Title</th>
          <th>Salary</th>
          <th>Strengths</th>
          <th>Weaknesses</th>
          <th>Productivity Score</th>
          <th>Tasks</th>
          <th>Meeting</th>
        </tr>
      </thead>
      <tbody>
        {employeesProp.map((employee) => (
          <tr key={employee.id}>
            <td>{employee.id}</td>
            <td>{employee.name}</td>
            <td>{employee.email}</td>
            <td>{employee.age}</td>
            <td>{employee.job_title}</td>
            <td>{employee.salary}</td>
            <td>{employee.strengths}</td>
            <td>{employee.weaknesses}</td>
            <td><ProgressBar variant={getColor(employee.productivity_score)} now={employee.productivity_score * 10} label={`${employee.productivity_score}`} /></td>
            <td><AssignTaskButton emp_id={employee.id}/><EmployeeTaskReport empid={employee.id}/></td>
            <td><Button variant="info" onClick={() => sendEmail(employee.id)}>Request Meeting</Button></td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default EmployeeTable;
