import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';


function LoginPage() {
    let navigate = useNavigate();

    const handleLoginManager = () => {
        navigate('/app'); // Navigates to the main app
    };

    const handleLoginEmployee = () => {
        navigate('/employeeLogin'); // Navigates to the main app
    }

    return (
        <div className='App'>
            <div className='App-header'>
                <h1>Login Page</h1>
                <hr />
            </div>
            <div className='mt-5'>
            <Button variant="primary" onClick={handleLoginManager} size="lg" className="me-3">Login As Manager</Button>
            <Button variant="primary" onClick={handleLoginEmployee} size="lg">Login As Employee</Button>
            </div>
        </div>
    );
}

export default LoginPage;
