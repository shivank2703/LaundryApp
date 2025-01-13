// src/pages/SignupPage.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
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

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // If success, go to /clothes
      navigate('/clothes');
    } catch (err) {
      switch (err.code) {
        case 'auth/invalid-email':
          setErrorMsg('Invalid email address.');
          break;
        case 'auth/weak-password':
          setErrorMsg('Password is too weak (min 6 characters).');
          break;
        case 'auth/email-already-in-use':
          setErrorMsg('Email already in use.');
          break;
        default:
          setErrorMsg('Signup failed: ' + err.message);
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>
      <form
        onSubmit={handleSignup}
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
          Create Account
        </Button>
      </form>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Already have an account? <Link to="/login">Login here</Link>
      </Typography>
    </Box>
  );
}
