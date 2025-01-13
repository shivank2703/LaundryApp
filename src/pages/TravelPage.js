// src/pages/TravelPage.js

import React, { useState } from 'react';
import {
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import ClothingCard from '../components/ClothingCard';

/**
 * We define two phases:
 *   PHASE_PACKING: picking which clothes to pack (with suggested items).
 *   PHASE_TRAVELING: travelMode is on, we see a daily-outfits style of only packed clothes.
 */
const PHASE_PACKING = 'PACKING';
const PHASE_TRAVELING = 'TRAVELING';

function getStatus(item) {
  // If item has travelDirty, it's effectively dirty while traveling.
  if (item.travelDirty) return 'TravelDirty';
  if (item.dirty || (item.wearPoints ?? 0) >= 3) return 'Dirty';
  if ((item.wearPoints ?? 0) === 2) return 'Moderate Wear';
  if ((item.wearPoints ?? 0) === 1) return 'Light Wear';
  return 'Fresh';
}

export default function TravelPage({
  clothes = [],
  onWearClothing = () => {},
  travelMode,
  setTravelMode,
  endTravelMode
}) {
  const [phase, setPhase] = useState(PHASE_PACKING);
  const [days, setDays] = useState(1);
  const [weather, setWeather] = useState('Mild');

  // IDs of items that are "packed"
  const [packedIds, setPackedIds] = useState([]);

  // We'll store an array of "suggested" item IDs (like daily-outfits suggestions).
  const [suggestedIds, setSuggestedIds] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ----------------------------------------------------------------
  // PHASE 1: PACKING
  // ----------------------------------------------------------------

  /**
   * We do not suggest or allow packing of items already dirty or travelDirty.
   * So we skip those from the start.
   */
  const cleanClothes = clothes.filter(
    (c) => !c.travelDirty && !c.dirty && (c.wearPoints ?? 0) < 3
  );

  const handleSuggest = () => {
    setShowSuggestions(true);

    // (days + 1) underwear
    const underwear = cleanClothes.filter((c) => c.category === 'Underwear');
    const neededUnderwearCount = days + 1;
    const pickedUnderwear = underwear.slice(0, neededUnderwearCount);

    // Weather-based picks
    let weatherPicks = [];
    if (weather === 'Cold') {
      weatherPicks = cleanClothes.filter((c) => (c.markers||[]).includes('Winter'));
    } else if (weather === 'Hot') {
      weatherPicks = cleanClothes.filter((c) => (c.markers||[]).includes('Summer'));
    } else {
      // mild => casual
      weatherPicks = cleanClothes.filter((c) => (c.markers||[]).includes('Casual'));
    }

    // Combine underwear + weather picks
    const finalSet = new Set([
      ...pickedUnderwear.map(i => i.id),
      ...weatherPicks.map(i => i.id)
    ]);
    setSuggestedIds(Array.from(finalSet));
  };

  const handlePackToggle = (id, isPacked) => {
    if (isPacked) {
      setPackedIds((prev) => [...prev, id]);
    } else {
      setPackedIds((prev) => prev.filter(x => x !== id));
    }
  };

  const doStartTravel = () => {
    if (packedIds.length === 0) {
      alert("You haven't packed any clothes yet!");
      return;
    }
    setTravelMode(true);
    setPhase(PHASE_TRAVELING);
  };

  // Now separate out the "suggested" clean items vs "unsuggested" clean items
  const suggestedSet = new Set(suggestedIds);
  const suggestedClothes = cleanClothes.filter((c) => suggestedSet.has(c.id));
  const unsuggested = cleanClothes.filter((c) => !suggestedSet.has(c.id));

  // Group them by category
  const groupByCategory = (items) => {
    const map = {};
    items.forEach((c) => {
      const cat = c.category || 'Misc';
      if (!map[cat]) map[cat] = [];
      map[cat].push(c);
    });
    return map;
  };
  const catMapSuggested = groupByCategory(suggestedClothes);
  const catMapOthers = groupByCategory(unsuggested);

  // ----------------------------------------------------------------
  // PHASE 2: TRAVELING
  // ----------------------------------------------------------------

  // The user can only see or wear the packed items. 
  // If any item is now travelDirty, we show it after the clean ones.
  // So let's separate "packed and still clean" vs "packed & travelDirty"
  const travelingItems = clothes.filter((c) => packedIds.includes(c.id));

  const travelingClean = travelingItems.filter(
    (c) => !(c.travelDirty || c.dirty || (c.wearPoints??0) >=3)
  );
  const travelingDirty = travelingItems.filter(
    (c) => c.travelDirty || c.dirty || (c.wearPoints??0) >=3
  );

  // We'll let the user filter travelingClean by category
  const [filterCategory, setFilterCategory] = useState('');

  const travelingCleanFiltered = travelingClean.filter((c) => {
    if (!filterCategory) return true;
    return c.category === filterCategory;
  });

  const travelingCleanCatMap = groupByCategory(travelingCleanFiltered);
  const travelingDirtyCatMap = groupByCategory(travelingDirty);

  const handleWearTravelItem = (id, usage) => {
    onWearClothing(id, usage);
  };

  const handleEndTravel = () => {
    endTravelMode(); 
    // That sets travelDirty=>dirty in App.js 
    setTravelMode(false);
    setPhase(PHASE_PACKING);
    setPackedIds([]);
    setSuggestedIds([]);
    setShowSuggestions(false);
  };

  // ----------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------

  // PHASE_PACKING + !travelMode
  if (phase === PHASE_PACKING && !travelMode) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Plan Your Trip
        </Typography>
        <Box sx={{ display: 'flex', gap:2, mb:3, flexWrap:'wrap' }}>
          <TextField
            type="number"
            label="Days"
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value,10)||1)}
            sx={{ width:100 }}
          />
          <FormControl sx={{ width:200 }}>
            <InputLabel>Weather</InputLabel>
            <Select
              value={weather}
              label="Weather"
              onChange={(e) => setWeather(e.target.value)}
            >
              <MenuItem value="Cold">Cold</MenuItem>
              <MenuItem value="Hot">Hot</MenuItem>
              <MenuItem value="Mild">Mild</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleSuggest}>
            Suggest Items
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={doStartTravel}
          >
            Start Travel
          </Button>
        </Box>

        {showSuggestions && (
          <Box sx={{ mb:3 }}>
            <Typography variant="h5">Suggested Items</Typography>
            {Object.entries(catMapSuggested).map(([cat, items]) => (
              <Box key={cat} sx={{ mb:2 }}>
                <Typography variant="subtitle1">{cat}</Typography>
                <Grid container spacing={2}>
                  {items.map((it) => {
                    const isPacked = packedIds.includes(it.id);
                    return (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={it.id}>
                        <ClothingCard item={it} />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isPacked}
                              onChange={(e) => handlePackToggle(it.id, e.target.checked)}
                            />
                          }
                          label="Pack"
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            ))}
          </Box>
        )}

        {showSuggestions && (
          <Box>
            <Typography variant="h5">Other Clean Clothes</Typography>
            {Object.entries(catMapOthers).map(([cat, items]) => (
              <Box key={cat} sx={{ mb:2 }}>
                <Typography variant="subtitle1">{cat}</Typography>
                <Grid container spacing={2}>
                  {items.map((it) => {
                    const isPacked = packedIds.includes(it.id);
                    return (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={it.id}>
                        <ClothingCard item={it} />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isPacked}
                              onChange={(e) => handlePackToggle(it.id, e.target.checked)}
                            />
                          }
                          label="Pack"
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  }

  // PHASE_TRAVELING + travelMode
  if (phase === PHASE_TRAVELING && travelMode) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Traveling - Daily Outfits
        </Typography>
        <Typography sx={{ mb:2 }}>
          You can wear only the packed clothes here. 
          Clean clothes appear below; 
          travel-dirty clothes appear after that in a separate section.
        </Typography>

        <Box sx={{ display:'flex', gap:2, mb:3, flexWrap:'wrap' }}>
          <FormControl sx={{ width:200 }}>
            <InputLabel>Category Filter</InputLabel>
            <Select
              value={filterCategory}
              label="Category Filter"
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {[...new Set(travelingItems.map(c=>c.category))].map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="error" onClick={handleEndTravel}>
            End Travel
          </Button>
        </Box>

        {/* Clean traveling clothes */}
        <Typography variant="h5" gutterBottom>
          Clean Packed Clothes
        </Typography>
        <TravelCategoryListing
          items={travelingCleanFiltered}
          onWearClothing={onWearClothing}
        />

        {/* Travel-dirty items */}
        <Typography variant="h5" gutterBottom sx={{ mt:4 }}>
          Travel-Dirty Items
        </Typography>
        <TravelCategoryListing
          items={travelingDirty}
          onWearClothing={onWearClothing}
          isDirtySection
        />
      </Box>
    );
  }

  // fallback
  return (
    <Box>
      <Typography>Travel mode is off or unknown phase; returning to packing mode.</Typography>
      <Button variant="contained" onClick={() => {
        setPhase(PHASE_PACKING);
        setTravelMode(false);
      }}>
        Go to Packing
      </Button>
    </Box>
  );
}

/**
 * A small helper component to list items by category,
 * letting you wear them if they're not dirty (unless isDirtySection is true).
 */
function TravelCategoryListing({ items, onWearClothing, isDirtySection=false }) {
  // group by category
  const map = {};
  items.forEach((c) => {
    const cat = c.category || 'Misc';
    if (!map[cat]) map[cat] = [];
    map[cat].push(c);
  });

  const getStatus = (item) => {
    if (item.travelDirty) return 'TravelDirty';
    if (item.dirty || (item.wearPoints ??0)>=3) return 'Dirty';
    if ((item.wearPoints ??0)===2) return 'Moderate Wear';
    if ((item.wearPoints ??0)===1) return 'Light Wear';
    return 'Fresh';
  };

  return (
    <>
      {Object.entries(map).map(([cat, catItems]) => (
        <Box key={cat} sx={{ mb:2 }}>
          <Typography variant="subtitle1">{cat}</Typography>
          <Grid container spacing={2}>
            {catItems.map((it) => {
              const status = getStatus(it);
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={it.id}>
                  <ClothingCard item={it} />
                  <Typography>Status: {status}</Typography>
                  {!isDirtySection && status!=='Dirty' && status!=='TravelDirty' && (
                    <>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt:1 }}
                        onClick={() => onWearClothing(it.id, 'Light Wear')}
                      >
                        Wear (Light)
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt:1, ml:1 }}
                        onClick={() => onWearClothing(it.id, 'Moderate Wear')}
                      >
                        Wear (Mod)
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt:1, ml:1 }}
                        onClick={() => onWearClothing(it.id, 'Heavy Wear')}
                      >
                        Wear (Heavy)
                      </Button>
                    </>
                  )}
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ))}
    </>
  );
}
