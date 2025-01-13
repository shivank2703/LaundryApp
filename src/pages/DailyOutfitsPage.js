// src/pages/DailyOutfitsPage.js
import React, { useState } from 'react';
import {
  Typography,
  Box,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import ClothingCard from '../components/ClothingCard';

function getStatus(item) {
  if (item.travelDirty || item.dirty || (item.wearPoints ?? 0) >= 3) return 'Dirty';
  if ((item.wearPoints ?? 0) === 2) return 'Moderate Wear';
  if ((item.wearPoints ?? 0) === 1) return 'Light Wear';
  return 'Fresh';
}

export default function DailyOutfitsPage({
  clothes = [],
  categories = [],
  onWearClothing = () => {}
}) {
  const [searchColor, setSearchColor] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [brandSearch, setBrandSearch] = useState('');
  const [markerSearch, setMarkerSearch] = useState('');

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [wearLevel, setWearLevel] = useState('Light Wear');

  // Exclude items that are dirty or travelDirty
  const visibleClothes = clothes.filter(
    (item) => !(item.dirty || item.travelDirty || (item.wearPoints ?? 0) >= 3)
  );

  const filteredClothes = visibleClothes.filter((item) => {
    // cat
    const catMatch = filterCategory
      ? item.category === filterCategory
      : true;
    // color
    const firstColor = (item.colors && item.colors.length>0)
      ? item.colors[0].toLowerCase()
      : '';
    const colorMatch = firstColor.includes(searchColor.toLowerCase());
    // status
    const status = getStatus(item);
    const statusMatch = statusFilter
      ? status === statusFilter
      : true;
    // brand
    const brandVal = (item.brand || '').toLowerCase();
    const brandMatch = brandVal.includes(brandSearch.toLowerCase());
    // marker
    let markerVal = true;
    if (markerSearch) {
      markerVal = (item.markers||[]).map(m=>m.toLowerCase()).includes(markerSearch.toLowerCase());
    }

    return catMatch && colorMatch && statusMatch && brandMatch && markerVal;
  });

  const handleWearClick = (id) => {
    setSelectedItemId(id);
    setWearLevel('Light Wear');
    setOpenDialog(true);
  };

  const handleDialogClose = (confirm) => {
    if (confirm && selectedItemId) {
      onWearClothing(selectedItemId, wearLevel);
    }
    setOpenDialog(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Daily Outfits
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <TextField
            label="Filter by Color"
            variant="outlined"
            fullWidth
            value={searchColor}
            onChange={(e) => setSearchColor(e.target.value)}
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
        {/* brand */}
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
          />
        </Grid>
      </Grid>

      {filteredClothes.length === 0 ? (
        <Typography>No clothes available (or they're all dirty).</Typography>
      ) : (
        <Grid container spacing={2}>
          {filteredClothes.map((item) => {
            const status = getStatus(item);
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                <ClothingCard item={item} />
                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                  Status: {status}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => handleWearClick(item.id)}
                >
                  Wear This
                </Button>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={() => handleDialogClose(false)}>
        <DialogTitle>Choose Wear Level</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Wear Level</InputLabel>
            <Select
              value={wearLevel}
              label="Wear Level"
              onChange={(e) => setWearLevel(e.target.value)}
            >
              <MenuItem value="Light Wear">Light Wear</MenuItem>
              <MenuItem value="Moderate Wear">Moderate Wear</MenuItem>
              <MenuItem value="Heavy Wear">Heavy Wear</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)}>Cancel</Button>
          <Button onClick={() => handleDialogClose(true)}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
