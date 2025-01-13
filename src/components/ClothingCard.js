// src/components/ClothingCard.js
import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Typography,
  Collapse,
  Box
} from '@mui/material';

function getBarColor(item) {
  if (item.dirty || item.wearPoints >= 3) return 'red';
  if (item.wearPoints === 2) return 'orange';
  if (item.wearPoints === 1) return 'gold';
  return 'green'; // fresh
}

export default function ClothingCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const barColor = getBarColor(item);

  const handleToggle = () => setExpanded((prev) => !prev);

  return (
    <Card>
      <CardActionArea onClick={handleToggle}>
        <CardMedia
          component="img"
          height="160"
          image={item.imageURL || 'https://via.placeholder.com/300x160?text=No+Image'}
          alt={item.name}
          sx={{
            objectFit: 'cover',
            objectPosition: 'top',
          }}
        />
        <CardContent>
          <Typography variant="h6">{item.name}</Typography>
          {/* Colored bar to indicate wear state */}
          <Box
            sx={{
              mt: 1,
              height: '6px',
              backgroundColor: barColor,
              borderRadius: '4px'
            }}
          />
        </CardContent>
      </CardActionArea>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ p: 2 }}>
          <Typography variant="body2">
            Category: {item.category} <br />
            Color: {item.color} <br />
            Wears: {item.wearCount}
            {item.isOlder && ' (Older)'} <br />
            Wash: {item.washInstr || 'N/A'} <br />
            Dry: {item.dryInstr || 'N/A'}
          </Typography>
        </Box>
      </Collapse>
    </Card>
  );
}
