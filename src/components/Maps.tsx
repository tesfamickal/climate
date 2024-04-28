import { useEffect, useRef, useState } from 'react'
import MapboxglSpiderifier, { popupOffsetForSpiderLeg } from 'mapboxgl-spiderifier'
import mapboxgl from 'mapbox-gl'
import TestData from "../data/bay_area_counties.json"
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { cn } from '../lib/utils';
import _ from 'lodash';
import 'mapbox-gl/dist/mapbox-gl.css';
import "../index.css"
mapboxgl.accessToken = 'pk.eyJ1IjoidGVzZmE3NzciLCJhIjoiY2xxYzBscHNjMDBiejJqcGdzdDN6amZyOSJ9.tqr_zoJSHvi3GCnp0oJhpA';
import { MapPin } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import Popup from './popup';
import ReactDOM from 'react-dom';

function Maps() {
  mapboxgl.Map
  const mapContainer = useRef<any>(null);
  const map = useRef<null | mapboxgl.Map>(null);
  const [lng, setLng] = useState(-121.2913);
  const [lat, setLat] = useState(37.8272);
  const [zoom, setZoom] = useState(7.5);
  const [data, setData] = useState<ActivityData | null>(null)
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }))
  const [showPopup, setShowPopup] = useState<boolean>(true);


  // Dynamically import county data based on the county name
  const importCountyData = async (countyName: any) => {
    try {
      const module = await import(`../data/counties/${countyName}.json`);
      return module.default;
    } catch (error) {
      console.error("Failed to load county data!", error);
      return null; // or handle the error as needed
    }
  };

  let countyData: string = ''
  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [lng, lat],
      zoom: zoom,
      logoPosition: 'bottom-right',
      attributionControl: false,
    });

    const spiderifier = new MapboxglSpiderifier(map.current, {
      animate: true,
      animationSpeed: 200,
      onClick: function(e: any, spiderLeg: any) {
        e.perventDefault
        console.log('Clicked on ', spiderLeg);
        setData(spiderLeg.feature.properties)
        setShowPopup(true)


        // const popupNode = document.createElement("div")
        // const popupRoot = createRoot(popupNode)
        //
        // popupRoot.render(
        //   <Popup
        //     data={spiderLeg.feature.properties}
        //   />,
        // )
        // if (map.current) {
        //   popUpRef.current
        //     .setLngLat({ lng: spiderLeg.feature.properties.lon, lat: spiderLeg.feature.properties.lat })
        //     .setDOMContent(popupNode)
        //     .addTo(map.current)
        // }
        // console.log("spider", spiderLeg.feature.properties.lngLat.wrap())
      },
      // initializeLeg: initializeSpiderLeg,
    });
    // function initializeSpiderLeg(spiderLeg: any) {
    //
    //   popUpRef.current = new mapboxgl.Popup({
    //     closeButton: true,
    //     closeOnClick: false,
    //     offset: popupOffsetForSpiderLeg(spiderLeg)
    //   });
    //
    //   const popupNode = document.querySelector(".spider-leg-pin")
    //   if (popupNode) {
    //     const popupRoot = createRoot(popupNode)
    //     console.log("popup", popupNode)
    //
    //     popupRoot.render(
    //       <Popup
    //         data={spiderLeg.feature.properties}
    //       />,
    //     )
    //     if (map.current) {
    //       popUpRef.current
    //         .setLngLat({ lng: spiderLeg.feature.properties.lon, lat: spiderLeg.feature.properties.lat })
    //         .setDOMContent(popupNode)
    //         .addTo(map.current)
    //     }
    //   }
    //   spiderLeg.mapboxMarker.setPopup(popUpRef.current);
    //   if (popUpRef.current) {
    //     popUpRef.current.remove();
    //   }
    // }



    map.current.on('load', () => {
      map.current?.addSource("bay", {
        type: 'geojson',
        data: TestData,
        promoteId: 'id'
      })

      map.current?.addLayer({
        id: "bay-fill",
        type: "fill",
        source: 'bay',
        paint: {
          'fill-color': [
            'match',
            ['get', 'id'],
            's7hs4j.1',
            'green',
            's7hs4j.2',
            'orange',
            's7hs4j.3',
            'brown',
            's7hs4j.4',
            'purple',
            's7hs4j.5',
            'red',
            's7hs4j.6',
            'violet',
            's7hs4j.7',
            'aqua',
            's7hs4j.8',
            'pink',
            's7hs4j.9',
            'yellow',
            'steelblue'
          ],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            1,
            0.5
          ]
        }
      })

      console.log(map.current)

      map.current?.on('click', async (e: any) => {
        const features: any = map.current?.queryRenderedFeatures(e.point, {
          layers: ['bay-fill']
        })

        map.current?.flyTo({
          center: e.lngLat.wrap(),
          zoom: 9
        })

        if (features[0] === undefined) {
          map.current?.flyTo({
            center: [lng, lat],
            zoom: zoom,
          })
        }

        let county: any = features[0].properties.COUNTY
        const countyNormalized = county.toLowerCase().replace(' ', '_')
        countyData = await importCountyData(countyNormalized);
        if (countyData) {
          const sourceId = 'counties'
          const layerId = 'county-fill'

          if (map.current?.getLayer(layerId)) {
            map.current?.removeLayer(layerId)
          }
          if (map.current?.getSource(sourceId)) {
            map.current?.removeSource(sourceId)
          }

          map.current?.addSource(sourceId, {
            type: 'geojson',
            data: countyData,
            promoteId: 'id',
          })
          map.current?.addLayer({
            id: layerId,
            type: 'circle',
            source: sourceId,
            paint: {
              'circle-radius': 4,
              'circle-color': 'black'
            }
          })

          map.current?.on('click', layerId, (e: any) => {
            const features: any = map.current?.queryRenderedFeatures(e.point, {
              layers: [layerId]
            })
            console.log("hello", features)
            if (!features.length) {
              spiderifier.unspiderfy()
            } else {
              features.map((f: any, index: any) => f.id = index)
              console.log("f", features)
              spiderifier.spiderfy(features[0].geometry.coordinates, features)


              // popUpRef.current = new mapboxgl.Popup({
              //   closeButton: true,
              //   closeOnClick: false,
              // });
              //
              // const popupNode = document.querySelector(".spider-leg-pin")
              // if (popupNode) {
              //   const popupRoot = createRoot(popupNode)
              //   console.log("popup", popupNode)
              //
              //   popupRoot.render(
              //     <Popup
              //       data={features.properties}
              //     />,
              //   )
              //   if (map.current) {
              //     popUpRef.current
              //       .setLngLat({ lng: features.properties.lon, lat: features.feature.properties.lat })
              //       .setDOMContent(popupNode)
              //       .addTo(map.current)
              //   }
              // }
            }
          })

          // const popup = new mapboxgl.Popup({ offset: 25 }).setText(data);
          map.current?.on('mousemove', (e) => {
            const features = map.current?.queryRenderedFeatures(e.point, { layers: [layerId] });
            if (map.current) {
              const canvas = map.current.getCanvas();
              if (canvas) {
                canvas.style.cursor = features && features.length ? 'pointer' : '';
              }
            }
          });
        }
      })

      let hoveredPolygonId: any = null
      map.current?.on('mousemove', 'bay-fill', (e: any) => {
        if (e.features.length > 0) {
          if (hoveredPolygonId !== null) {
            map.current && map.current.setFeatureState(
              { source: 'bay', id: hoveredPolygonId },
              { hover: false }
            );
          }
          hoveredPolygonId = e.features[0].id;
          map.current && map.current.setFeatureState(
            { source: 'bay', id: hoveredPolygonId },
            { hover: true }
          );
        }
      });
      // When the mouse leaves the state-fill layer, update the feature state of the
      // previously hovered feature.
      map.current?.on('mouseleave', 'bay-fill', () => {
        if (hoveredPolygonId !== null) {
          map.current && map.current.setFeatureState(
            { source: 'bay', id: hoveredPolygonId },
            { hover: false }
          );
        }
        hoveredPolygonId = null;
      });
    })
  }, [countyData]);

  console.log("activity", data)
  return (
    <>
      <div className='absolute w-screen h-screen justify-center items-center'>
        <div ref={mapContainer} className="w-full h-full" />
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        {showPopup && data && <Popup data={data} onClose={() => setShowPopup(false)}></Popup>}
      </div >
    </>
  )
}

export default Maps