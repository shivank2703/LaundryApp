// src/pages/LoadPlannerPage.js
import React from 'react';
import { Typography, Box } from '@mui/material';

export default function LoadPlannerPage({ clothes = [] }) {
  // filter only normal dirty items, skip travelDirty
  const dirty = clothes.filter(
    (c) => !c.travelDirty && (c.dirty || (c.wearPoints ?? 0) >= 3)
  );

  const grouped = dirty.reduce((acc, item) => {
    const key = item.washInstr || 'General';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const LOAD_SIZE = 10; 
  const groupKeys = Object.keys(grouped);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Laundry Loads
      </Typography>
      {dirty.length === 0 && (
        <Typography>No dirty clothes (outside travel items).</Typography>
      )}
      {groupKeys.map((washType) => {
        const items = grouped[washType];
        const loads = [];
        for (let i=0; i<items.length; i+=LOAD_SIZE) {
          loads.push(items.slice(i, i+LOAD_SIZE));
        }

        return (
          <Box key={washType} sx={{ mb: 3 }}>
            <Typography variant="h5">{washType} Wash</Typography>
            {loads.map((loadItems, idx) => (
              <Box key={idx} sx={{ ml: 2 }}>
                <Typography variant="subtitle1">
                  Load #{idx+1} (max {LOAD_SIZE} items)
                </Typography>
                <ul>
                  {loadItems.map((it) => (
                    <li key={it.id}>
                      {it.name} {it.brand ? `(${it.brand})` : ''} – 
                      Colors: {(it.colors||[]).join(', ')} 
                      – Markers: {(it.markers||[]).join(', ')}
                    </li>
                  ))}
                </ul>
              </Box>
            ))}
          </Box>
        );
      })}
      <Typography sx={{ mt: 2, fontStyle:'italic' }}>
        Travel-dirty items are hidden until travel mode is turned off.
      </Typography>
    </Box>
  );
}
