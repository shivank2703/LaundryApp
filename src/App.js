// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';

import NavBar from './components/NavBar';
import ClothingListPage from './pages/ClothingListPage';
import DailyOutfitsPage from './pages/DailyOutfitsPage';
import AddClothingPage from './pages/AddClothingPage';
import LoadPlannerPage from './pages/LoadPlannerPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Firebase
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc
} from 'firebase/firestore';

// Example categories
const CATEGORIES = [
  'T-Shirt',
  'Polo',
  'Shirt',
  'Gym Shorts',
  'Shorts',
  'Sweater',
  'Hoodie',
  'Jacket',
  'Jeans',
  'Sweatpants',
  'At-Home Clothes',
];

// Converts usage selection into wear points
function usageToPoints(usage) {
  switch (usage) {
    case 'Light Wear': return 1;
    case 'Moderate Wear': return 2;
    case 'Heavy Wear': return 3;
    default: return 0;
  }
}

function App() {
  const [user, setUser] = useState(null);
  const [clothes, setClothes] = useState([]);

  useEffect(() => {
    console.log('App.js: Checking auth state...');
    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('onAuthStateChanged user = ', firebaseUser);
      setUser(firebaseUser);

      if (firebaseUser) {
        // Listen to user's clothes
        const colRef = collection(db, 'users', firebaseUser.uid, 'clothes');
        const unsubSnapshot = onSnapshot(
          colRef,
          (snapshot) => {
            const items = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            console.log('Fetched clothes:', items);
            setClothes(items);
          },
          (error) => {
            console.error('Firestore error reading clothes:', error);
            setClothes([]);
          }
        );
        return () => unsubSnapshot();
      } else {
        setClothes([]);
      }
    });
    return () => unsubAuth();
  }, []);

  // Add new clothing
  const handleAddClothing = async (item) => {
    if (!user) {
      alert('Please log in to add clothing!');
      return;
    }
    try {
      const newItem = { wearPoints: 0, dirty: false, ...item };
      const colRef = collection(db, 'users', user.uid, 'clothes');
      await addDoc(colRef, newItem);
    } catch (err) {
      alert('Failed to add clothing: ' + err.message);
    }
  };

  // Wear logic
  const handleWearClothing = async (itemId, usage) => {
    if (!user) return;

    const item = clothes.find((c) => c.id === itemId);
    if (!item || item.dirty) return;

    const added = usageToPoints(usage);
    const newPoints = item.wearPoints + added;

    let updateData = { wearPoints: newPoints };
    if (newPoints >= 3) {
      updateData.dirty = true;
      if (typeof item.wearCount === 'number') {
        updateData.wearCount = item.wearCount + 1;
      }
    }

    try {
      const docRef = doc(db, 'users', user.uid, 'clothes', itemId);
      await updateDoc(docRef, updateData);
    } catch (err) {
      alert('Failed to update item usage: ' + err.message);
    }
  };

  return (
    <>
      <NavBar user={user} />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Routes>
          {/* By default, go to /login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected routes (must be logged in) */}
          <Route
            path="/clothes"
            element={
              user ? (
                <ClothingListPage
                  clothes={clothes}
                  categories={CATEGORIES}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/add"
            element={
              user ? (
                <AddClothingPage
                  onAddClothing={handleAddClothing}
                  categories={CATEGORIES}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/laundry"
            element={
              user ? (
                <LoadPlannerPage clothes={clothes} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/daily-outfits"
            element={
              user ? (
                <DailyOutfitsPage
                  clothes={clothes}
                  categories={CATEGORIES}
                  onWearClothing={handleWearClothing}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* catch all */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
