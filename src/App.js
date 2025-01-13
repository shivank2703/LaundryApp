// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';

import NavBar from './components/NavBar';
import ClothingListPage from './pages/ClothingListPage';
import DailyOutfitsPage from './pages/DailyOutfitsPage';
import AddClothingPage from './pages/AddClothingPage';
import LoadPlannerPage from './pages/LoadPlannerPage';
import TravelPage from './pages/TravelPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';

/** You can store your color list and brand list in Firestore or keep them local.
 *  For simplicity, let's keep them local in memory, updated whenever we see new items.
 */

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
  const [userLoading, setUserLoading] = useState(true);
  const [clothes, setClothes] = useState([]);

  // We'll store dynamic colorList, brandList in state, updated whenever new clothes appear
  const [colorList, setColorList] = useState([
    'Black','White','Blue','Red','Gray',
    'Green','Yellow','Navy','Brown','Beige'
  ]);
  const [brandList, setBrandList] = useState([]);

  // travelMode
  const [travelMode, setTravelMode] = useState(false);

  // Weekly items if you want them...
  // etc.

  useEffect(() => {
    // Wait for onAuthStateChanged to finish
    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setUserLoading(false);

      if (firebaseUser) {
        const colRef = collection(db, 'users', firebaseUser.uid, 'clothes');
        const unsubSnapshot = onSnapshot(colRef, (snapshot) => {
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setClothes(items);

          // Extract dynamic brandList & colorList from items
          // We'll collect them from item.brand & item.colors
          const newBrands = [];
          const newColors = [...colorList]; // start with defaults
          items.forEach((c) => {
            if (c.brand && !newBrands.includes(c.brand)) {
              newBrands.push(c.brand);
            }
            if (Array.isArray(c.colors)) {
              c.colors.forEach((col) => {
                if (!newColors.includes(col)) {
                  newColors.push(col);
                }
              });
            }
          });
          setBrandList((prev) => {
            // merge old with new
            const merged = [...prev, ...newBrands.filter(b => !prev.includes(b))];
            return merged;
          });
          setColorList((prev) => {
            const merged = [...prev, ...newColors.filter(b => !prev.includes(b))];
            return merged;
          });
        });
        return () => unsubSnapshot();
      } else {
        setClothes([]);
      }
    });

    return () => unsubAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If travelMode is turned off, move all travelDirty => dirty
  const endTravelMode = async () => {
    if (!user) {
      setTravelMode(false);
      return;
    }
    // find all items with travelDirty
    const travelDirtyItems = clothes.filter((c) => c.travelDirty === true);
    for (const item of travelDirtyItems) {
      const docRef = doc(db, 'users', user.uid, 'clothes', item.id);
      await updateDoc(docRef, {
        travelDirty: false,
        dirty: true
      });
    }
    setTravelMode(false);
  };

  const handleAddClothing = async (item) => {
    if (!user) {
      alert('Please log in to add clothing!');
      return;
    }
    try {
      const newItem = {
        wearPoints: 0,
        dirty: false,
        travelDirty: false,
        createdAt: serverTimestamp(),
        ...item
      };
      await addDoc(collection(db, 'users', user.uid, 'clothes'), newItem);
    } catch (err) {
      alert('Failed to add clothing: ' + err.message);
    }
  };

  const handleWearClothing = async (itemId, usage) => {
    if (!user) return;
    const item = clothes.find((c) => c.id === itemId);
    if (!item || item.dirty || item.travelDirty) return;

    const added = usageToPoints(usage);
    const newPoints = (item.wearPoints ?? 0) + added;
    let updateData = { wearPoints: newPoints };

    // If it hits 3, check travelMode => set travelDirty or normal dirty
    if (newPoints >= 3) {
      if (travelMode) {
        updateData.travelDirty = true;
      } else {
        updateData.dirty = true;
      }
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

  // If we're still loading user, show a loader (so we don't forcibly redirect)
  if (userLoading) {
    return <div style={{ margin: '2rem' }}>Loading user...</div>;
  }

  // If we want an approach that does not forcibly redirect if user is not logged in,
  // we can let each route handle it conditionally.
  return (
    <>
      <NavBar user={user} />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Condition if not user, either do <Navigate to="/login" /> or let them see an error. 
              We'll do the typical approach. */}
          <Route
            path="/clothes"
            element={
              user ? (
                <ClothingListPage
                  clothes={clothes}
                  categories={[] /* pass an array of categories if you want */}
                  colorList={colorList}
                  brandList={brandList}
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
                  categories={[] /* or pass some categories */}
                  colorList={colorList}
                  brandList={brandList}
                  setColorList={setColorList}
                  setBrandList={setBrandList}
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
                  categories={[]}
                  onWearClothing={handleWearClothing}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/travel"
            element={
              user ? (
                <TravelPage
                  clothes={clothes}
                  onWearClothing={handleWearClothing}
                  travelMode={travelMode}
                  setTravelMode={setTravelMode}
                  endTravelMode={endTravelMode}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* If user wants to remain on the page after refresh, we can default to /clothes if logged in. */}
          <Route
            path="/"
            element={
              user ? <Navigate to="/clothes" /> : <Navigate to="/login" />
            }
          />

          <Route path="*" element={<Navigate to="/clothes" />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
