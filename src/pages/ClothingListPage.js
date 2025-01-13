// src/pages/ClothingListPage.js
import React, { useState } from 'react';
import {
  Grid,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box
} from '@mui/material';
import ClothingCard from '../components/ClothingCard';

function getStatus(item) {
  if (item.dirty || item.wearPoints >= 3) return 'Dirty';
  if (item.wearPoints === 2) return 'Moderate Wear';
  if (item.wearPoints === 1) return 'Light Wear';
  return 'Fresh';
}

export default function ClothingListPage({
  clothes = [],
  categories = [],
}) {
  const [filterCategory, setFilterCategory] = useState('');
  const [searchColor, setSearchColor] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Filter logic
  const filteredClothes = clothes.filter((item) => {
    // Filter by category
    const catMatch = filterCategory
      ? item.category === filterCategory
      : true;

    // Filter by color substring
    const colorMatch = item.color
      .toLowerCase()
      .includes(searchColor.toLowerCase());

    // Filter by wear status
    const status = getStatus(item);
    const statusMatch = statusFilter
      ? status === statusFilter
      : true;

    return catMatch && colorMatch && statusMatch;
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        All Clothes
      </Typography>

      {/* Filter Inputs */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Filter by Color"
            variant="outlined"
            fullWidth
            value={searchColor}
            onChange={(e) => setSearchColor(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Filter by Category</InputLabel>
            <Select
              value={filterCategory}
              label="Filter by Category"
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Filter by status */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Wear Status</InputLabel>
            <Select
              value={statusFilter}
              label="Wear Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Fresh">Fresh</MenuItem>
              <MenuItem value="Light Wear">Light Wear</MenuItem>
              <MenuItem value="Moderate Wear">Moderate Wear</MenuItem>
              <MenuItem value="Dirty">Dirty</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {filteredClothes.length === 0 ? (
        <Typography>No clothes found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {filteredClothes.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <ClothingCard item={item} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
