// src/pages/LoginPage.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // If success, go to /clothes
      navigate('/clothes');
    } catch (err) {
      // Friendly error messages
      switch (err.code) {
        case 'auth/invalid-email':
          setErrorMsg('Invalid email address.');
          break;
        case 'auth/wrong-password':
          setErrorMsg('Incorrect password.');
          break;
        case 'auth/user-not-found':
          setErrorMsg('No user found with this email.');
          break;
        default:
          setErrorMsg('Login failed: ' + err.message);
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form
        onSubmit={handleLogin}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
          }
          label="Show Password"
        />

        {errorMsg && (
          <Typography color="error">{errorMsg}</Typography>
        )}

        <Button variant="contained" type="submit">
          Login
        </Button>
      </form>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Don&rsquo;t have an account? <Link to="/signup">Sign up here</Link>
      </Typography>
    </Box>
  );
}
