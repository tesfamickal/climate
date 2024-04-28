import { useEffect, useRef, useState } from 'react'
import './App.css'
import mapboxgl from 'mapbox-gl'
import TestData from "./data/bay_area_counties.json"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';
import { Check } from 'lucide-react';
import { cn } from './lib/utils';
import Maps from './components/Maps';
import Navbar from './components/navbar';

mapboxgl.accessToken = 'pk.eyJ1IjoidGVzZmE3NzciLCJhIjoiY2xxYzBscHNjMDBiejJqcGdzdDN6amZyOSJ9.tqr_zoJSHvi3GCnp0oJhpA';

function App() {

  return (
    <>
      <Maps />
    </>
  )
}

export default App
