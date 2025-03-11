import React from 'react';
import { Link } from 'react-router-dom';

export default function NewUserPage() {
    return (
        <div>
            <div>
                <Link to="/login">Login</Link> if you already have an account or
                go to your nearest POC to get registered
            </div>
        </div>
    );
}
