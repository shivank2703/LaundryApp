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
  if (item.dirty || (item.wearPoints ?? 0) >= 3) return 'red';
  if ((item.wearPoints ?? 0) === 2) return 'orange';
  if ((item.wearPoints ?? 0) === 1) return 'gold';
  return 'green'; // fresh
}

export default function ClothingCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const barColor = getBarColor(item);

  const handleToggle = () => setExpanded((prev) => !prev);

  // Display createdAt if we have it
  let dateStr = 'N/A';
  if (item.createdAt && item.createdAt.toDate) {
    dateStr = item.createdAt.toDate().toLocaleString();
  }

  const isUnderwear = item.category === 'Underwear';

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
            Category: {item.category}<br />
            {isUnderwear ? null : <>Color(s): {(item.colors || []).join(', ')}<br /></>}
            {item.brand ? <>Brand: {item.brand}<br /></> : null}
            {!isUnderwear && item.markers?.length ? 
              <>Markers: {item.markers.join(', ')}<br /></> 
              : null}
            Created: {dateStr}<br />
            {/* If we do track wearCount for socks or normal clothes, but not underwear if you said no wearCount */}
            {isUnderwear ? null : <>WearCount: {item.wearCount ?? 0}<br /></>}
            Wash: {item.washInstr || 'N/A'}<br />
            Dry: {item.dryInstr || 'N/A'}<br />
          </Typography>
        </Box>
      </Collapse>
    </Card>
  );
}
