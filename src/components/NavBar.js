// src/components/NavBar.js
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function NavBar({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      alert('Failed to logout: ' + err.message);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Laundry Webapp
        </Typography>

        {user ? (
          <>
            <Button color="inherit" component={Link} to="/clothes">
              Clothes
            </Button>
            <Button color="inherit" component={Link} to="/add">
              Add Clothing
            </Button>
            <Button color="inherit" component={Link} to="/laundry">
              Laundry Loads
            </Button>
            <Button color="inherit" component={Link} to="/daily-outfits">
              Daily Outfits
            </Button>
            <Button color="inherit" component={Link} to="/travel">
              Travel
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/signup">
              Signup
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
