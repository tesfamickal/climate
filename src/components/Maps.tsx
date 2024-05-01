import { useEffect, useRef, useState } from 'react'
import MapboxglSpiderifier from 'mapboxgl-spiderifier'
import mapboxgl from 'mapbox-gl'
import BayAreaJson from "../data/bay_area_counties.json"
import _ from 'lodash';
import 'mapbox-gl/dist/mapbox-gl.css';
import "../index.css"
import Popup from './popup';

function Maps() {
  mapboxgl.Map
  const mapContainer = useRef<any>(null);
  const map = useRef<null | mapboxgl.Map>(null);
  const lng = -121.2913;
  const lat = 37.8272;
  const zoom  = 7.5;
  const [data, setData] = useState<ActivityData | null>(null)
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
        setData(spiderLeg.feature.properties)
        setShowPopup(true)
      },
    });

    map.current.on('load', () => {
      map.current?.addSource("bay", {
        type: 'geojson',
        data: BayAreaJson as any,
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
            '#464D77',
            's7hs4j.2',
            '#188FA7',
            's7hs4j.3',
            '#F2BAC9',
            's7hs4j.4',
            '#CFD186',
            's7hs4j.5',
            '#60712F',
            's7hs4j.6',
            '#E1BC29',
            's7hs4j.7',
            '#778DA9',
            's7hs4j.8',
            '#C16E70',
            's7hs4j.9',
            '#AA1155',
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
            if (!features.length) {
              spiderifier.unspiderfy()
            } else {
              features.map((f: any, index: any) => f.id = index)
              spiderifier.spiderfy(features[0].geometry.coordinates, features)
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
