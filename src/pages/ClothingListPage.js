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
  if (item.travelDirty || item.dirty || (item.wearPoints ?? 0) >= 3) return 'Dirty';
  if ((item.wearPoints ?? 0) === 2) return 'Moderate Wear';
  if ((item.wearPoints ?? 0) === 1) return 'Light Wear';
  return 'Fresh';
}

export default function ClothingListPage({
  clothes = [],
  categories = [],
  colorList = [],
  brandList = []
}) {
  const [filterCategory, setFilterCategory] = useState('');
  const [searchColor, setSearchColor] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [brandSearch, setBrandSearch] = useState('');
  const [markerSearch, setMarkerSearch] = useState('');

  const filteredClothes = clothes.filter((item) => {
    // category
    const catMatch = filterCategory
      ? item.category === filterCategory
      : true;
    // color
    const firstColor = item.colors && item.colors[0]
      ? item.colors[0].toLowerCase()
      : '';
    const colorMatch = firstColor.includes(searchColor.toLowerCase());

    const status = getStatus(item);
    const statusMatch = statusFilter ? status === statusFilter : true;

    const brandVal = (item.brand || '').toLowerCase();
    const brandMatch = brandVal.includes(brandSearch.toLowerCase());

    let markerVal = true;
    if (markerSearch) {
      markerVal = (item.markers || [])
        .map(m => m.toLowerCase())
        .includes(markerSearch.toLowerCase());
    }

    return catMatch && colorMatch && statusMatch && brandMatch && markerVal;
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        All Clothes
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* color filter */}
        <Grid item xs={12} md={3}>
          <TextField
            label="Filter by Color"
            variant="outlined"
            fullWidth
            value={searchColor}
            onChange={(e) => setSearchColor(e.target.value)}
            helperText="Type a color substring. E.g. 'blu'"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Filter by Category</InputLabel>
            <Select
              value={filterCategory}
              label="Filter by Category"
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
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
        {/* brand filter */}
        <Grid item xs={12} md={3}>
          <TextField
            label="Brand"
            variant="outlined"
            fullWidth
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Marker Search"
            variant="outlined"
            fullWidth
            value={markerSearch}
            onChange={(e) => setMarkerSearch(e.target.value)}
            helperText="E.g. 'Casual', 'Winter', etc."
          />
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
