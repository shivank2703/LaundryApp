// src/pages/AddClothingPage.js

import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';

/**
 * AddClothingPage:
 *  - onAddClothing (function) -> called when user submits the form
 *  - categories (array) -> used for category dropdown (defaults to [])
 */
export default function AddClothingPage({
  onAddClothing = () => {},
  categories = [],
}) {
  const [name, setName] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [wearCount, setWearCount] = useState('0');
  const [isOlder, setIsOlder] = useState(false);
  const [washInstr, setWashInstr] = useState('');
  const [dryInstr, setDryInstr] = useState('');

  // Example wash/dry options (you can hardcode or pass them as props)
  const WASH_OPTIONS = [
    'Machine Wash Cold',
    'Machine Wash Warm',
    'Hand Wash',
    'Dry Clean Only',
  ];
  const DRY_OPTIONS = [
    'Tumble Dry Low',
    'Hang Dry',
    'Line Dry',
    'No Heat',
  ];

  // Handle file input -> set base64 for local preview
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageURL(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Validate required fields -> call onAddClothing
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !category || !color || !washInstr || !dryInstr) {
      alert('Please fill all required fields (Name, Category, Color, Wash, Dry).');
      return;
    }

    // If older, we store wearCount as 'X'
    let finalWearCount = wearCount;
    if (isOlder) {
      finalWearCount = 'X';
    }

    const newItem = {
      name,
      imageURL,
      category,
      color,
      wearCount:
        finalWearCount === 'X'
          ? 'X'
          : parseInt(finalWearCount, 10) || 0,
      isOlder,
      washInstr,
      dryInstr,
    };

    // Pass to parent
    onAddClothing(newItem);

    // Reset form
    setName('');
    setImageURL('');
    setCategory('');
    setColor('');
    setWearCount('0');
    setIsOlder(false);
    setWashInstr('');
    setDryInstr('');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Add Clothing
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}
      >
        {/* Basic info */}
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* File input for an image */}
        <Button variant="contained" component="label">
          Upload Image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        {imageURL && (
          <Box
            component="img"
            src={imageURL}
            alt="Preview"
            sx={{ width: 200, height: 'auto' }}
          />
        )}

        {/* Category selection from categories prop */}
        <TextField
          select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <MenuItem value="">-- Select Category --</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>

        {/* Color (required) */}
        <TextField
          label="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          required
        />

        {/* If older, we disable the numeric input */}
        <TextField
          label="Number of Wears"
          type="number"
          value={wearCount}
          onChange={(e) => setWearCount(e.target.value)}
          disabled={isOlder}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={isOlder}
              onChange={(e) => setIsOlder(e.target.checked)}
            />
          }
          label="Is this an older item?"
        />

        {/* Wash instructions */}
        <FormControl required>
          <InputLabel>Wash Instructions</InputLabel>
          <Select
            value={washInstr}
            label="Wash Instructions"
            onChange={(e) => setWashInstr(e.target.value)}
          >
            <MenuItem value="">-- Select Wash --</MenuItem>
            {WASH_OPTIONS.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Dry instructions */}
        <FormControl required>
          <InputLabel>Dry Instructions</InputLabel>
          <Select
            value={dryInstr}
            label="Dry Instructions"
            onChange={(e) => setDryInstr(e.target.value)}
          >
            <MenuItem value="">-- Select Dry --</MenuItem>
            {DRY_OPTIONS.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" variant="contained">
          Add Clothing
        </Button>
      </Box>
    </Box>
  );
}
