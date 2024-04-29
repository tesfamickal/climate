import './App.css'
import mapboxgl from 'mapbox-gl'
import Maps from './components/Maps';
import Home from './components/home';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom"

mapboxgl.accessToken = 'pk.eyJ1IjoidGVzZmE3NzciLCJhIjoiY2xxYzBscHNjMDBiejJqcGdzdDN6amZyOSJ9.tqr_zoJSHvi3GCnp0oJhpA';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route index element={<Home />} />
      <Route path='/map' element={<Maps />} />
    </Route>
  )
)

function App() {
  return <RouterProvider router={router} />;
}

export default App
