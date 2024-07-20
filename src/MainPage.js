import { useNavigate } from "react-router-dom";
import React from 'react';
import { Button } from 'antd';



export default function MainPage() {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate('/register');
    };

    return(
        <div>
            <header>
                <h2>Welcome to our page!</h2>
            </header>
            <body>
                <Button size="large" onClick={handleRedirect}><b>Register or Login</b></Button>
            </body>
        </div>
    );
}