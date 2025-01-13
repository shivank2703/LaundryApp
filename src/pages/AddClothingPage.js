// src/pages/AddClothingPage.js
import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  Select,
  Chip,
  OutlinedInput
} from '@mui/material';

const MARKER_OPTIONS = ['Casual','GoingOut','Winter','AtHome','Summer','Gym'];
const WASH_OPTIONS = ['Machine Wash Cold','Machine Wash Warm','Hand Wash','Dry Clean Only'];
const DRY_OPTIONS = ['Tumble Dry Low','Hang Dry','Line Dry','No Heat'];

export default function AddClothingPage({
  onAddClothing = () => {},
  categories = [],
  colorList = [],
  brandList = [],
  setColorList = () => {},
  setBrandList = () => {}
}) {
  const [name, setName] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [category, setCategory] = useState('');
  const [colors, setColors] = useState([]); // multi array
  const [wearCount, setWearCount] = useState('0');
  const [brand, setBrand] = useState('');
  const [markers, setMarkers] = useState([]);
  const [washInstr, setWashInstr] = useState('');
  const [dryInstr, setDryInstr] = useState('');

  useEffect(() => {
    // If user picks Hoodie, Sweater, or Jacket => auto-add "Winter"
    if (['Hoodie','Sweater','Jacket'].includes(category)) {
      if (!markers.includes('Winter')) {
        setMarkers(prev => [...prev, 'Winter']);
      }
    }
    // if Underwear => no color, no markers, no wearCount
    if (category === 'Underwear') {
      setColors([]);
      setMarkers([]);
      setWearCount('0');
    }
    // if Socks => no wearCount, markers only [Winter, Summer, Gym]
    if (category === 'Socks') {
      setWearCount('0');
      setMarkers(prev => prev.filter(m => ['Winter','Summer','Gym'].includes(m)));
    }
  }, [category]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImageURL(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !category || !washInstr || !dryInstr) {
      alert('Please fill required fields: Name, Category, Wash, Dry.');
      return;
    }
    let finalWearCount = parseInt(wearCount,10) || 0;
    if (category === 'Underwear' || category === 'Socks') {
      finalWearCount = 0;
    }

    const newItem = {
      name,
      imageURL,
      category,
      colors,
      wearCount: finalWearCount,
      brand,
      markers,
      washInstr,
      dryInstr
    };

    onAddClothing(newItem);

    // We also add brand to brandList if not present
    if (brand && !brandList.includes(brand)) {
      setBrandList((prev) => [...prev, brand]);
    }
    // For each color not in colorList, add it
    colors.forEach((c) => {
      if (!colorList.includes(c)) {
        setColorList((prev) => [...prev, c]);
      }
    });

    // reset
    setName('');
    setImageURL('');
    setCategory('');
    setColors([]);
    setWearCount('0');
    setBrand('');
    setMarkers([]);
    setWashInstr('');
    setDryInstr('');
  };

  // multi colors
  const handleColorChange = (e) => {
    // If user typed something not in colorList, we'll add it on Submit
    const value = e.target.value;
    setColors(typeof value === 'string' ? value.split(',') : value);
  };

  // Markers multi
  const handleMarkerChange = (e) => {
    let val = e.target.value;
    if (category === 'Underwear') val = [];
    if (category === 'Socks') {
      val = val.filter(m => ['Winter','Summer','Gym'].includes(m));
    }
    setMarkers(typeof val === 'string' ? val.split(',') : val);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Add Clothing
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 450 }}
      >
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        {/* Category */}
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

        {/* Colors: multi with new additions possible */}
        {category === 'Underwear' ? null : (
          <>
            <InputLabel>Colors</InputLabel>
            <Select
              multiple
              value={colors}
              onChange={handleColorChange}
              input={<OutlinedInput label="Colors" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((val) => (
                    <Chip key={val} label={val} />
                  ))}
                </Box>
              )}
            >
              {/* user can type new color? Usually we do a combo box or <Autocomplete> 
                  but let's list existing colorList + an "Add new color" approach */}
              {colorList.map((col) => (
                <MenuItem key={col} value={col}>
                  {col}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="Or type a new color"
              variant="outlined"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const newColor = e.currentTarget.value.trim();
                  if (newColor && !colors.includes(newColor)) {
                    setColors([...colors, newColor]);
                  }
                  e.currentTarget.value = '';
                }
              }}
              helperText="Press Enter to add"
            />
          </>
        )}

        {(category === 'Underwear' || category === 'Socks') ? null : (
          <TextField
            label="Number of Wears"
            type="number"
            value={wearCount}
            onChange={(e) => setWearCount(e.target.value)}
          />
        )}

        {/* brand dropdown or type new brand */}
        <InputLabel>Brand</InputLabel>
        <Select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          displayEmpty
          input={<OutlinedInput />}
        >
          <MenuItem value="">(No Brand)</MenuItem>
          {brandList.map((b) => (
            <MenuItem key={b} value={b}>
              {b}
            </MenuItem>
          ))}
        </Select>
        <TextField
          label="Or type new Brand"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const newB = e.currentTarget.value.trim();
              if (newB && newB !== brand) {
                setBrand(newB);
              }
              e.currentTarget.value = '';
            }
          }}
          helperText="Press Enter to set new brand"
        />

        {category === 'Underwear' ? null : (
          <>
            <InputLabel>Markers</InputLabel>
            <Select
              multiple
              value={markers}
              onChange={handleMarkerChange}
              input={<OutlinedInput label="Markers" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((val) => (
                    <Chip key={val} label={val} />
                  ))}
                </Box>
              )}
            >
              {MARKER_OPTIONS.map((marker) => (
                <MenuItem key={marker} value={marker}>
                  {marker}
                </MenuItem>
              ))}
            </Select>
          </>
        )}

        <TextField
          select
          label="Wash Instructions"
          value={washInstr}
          onChange={(e) => setWashInstr(e.target.value)}
          required
        >
          <MenuItem value="">-- Select Wash --</MenuItem>
          {WASH_OPTIONS.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Dry Instructions"
          value={dryInstr}
          onChange={(e) => setDryInstr(e.target.value)}
          required
        >
          <MenuItem value="">-- Select Dry --</MenuItem>
          {DRY_OPTIONS.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </TextField>

        <Button type="submit" variant="contained">
          Add Clothing
        </Button>
      </Box>
    </Box>
  );
}
