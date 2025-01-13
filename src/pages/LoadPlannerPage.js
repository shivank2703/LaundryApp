// src/pages/LoadPlannerPage.js
import React from 'react';
import { Typography, Box } from '@mui/material';

export default function LoadPlannerPage({ clothes }) {
  // Group by wash instructions
  const grouped = clothes.reduce((acc, item) => {
    const key = item.washInstr || 'General';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const groupKeys = Object.keys(grouped);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Laundry Loads
      </Typography>

      {groupKeys.length === 0 && (
        <Typography>No clothes yet.</Typography>
      )}
      {groupKeys.map((washType) => (
        <Box key={washType} sx={{ mb: 2 }}>
          <Typography variant="h6">{washType} Wash</Typography>
          <ul>
            {grouped[washType].map((item) => {
              const isDirty = item.dirty || item.wearPoints >= 3;
              return (
                <li key={item.id}>
                  {item.name} — {isDirty ? 'DIRTY' : 'Clean'} | Dry: {item.dryInstr || 'N/A'}
                </li>
              );
            })}
          </ul>
        </Box>
      ))}
    </Box>
  );
}
