import { useState, useCallback, useEffect } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";

const libraries = ["places", "marker"];
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};
const center = {
  lat: -3.745,
  lng: -38.523,
};

function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

const Maps = ({ keyword, type = "select", setSelectedLocationFront }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCbN9h2LsBeVQOs1dST4wqu0uhBB1SCedw",
    libraries,
  });

  const [map, setMap] = useState(null);
  const [results, setResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({}); // State to hold selected lat and long
  // const searchInputRef = useRef(null);

  const onMapClick = useCallback(
    (event) => {
      setSelectedLocation({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
      setSelectedLocationFront({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    },
    [setSelectedLocationFront]
  );

  const onMapLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const handleSearch = useCallback(async () => {
    if (keyword === "" || !map) return;

    const { Place } = window.google.maps.places;

    const applyLocation = (place) => {
      const location = place.location;
      map.setCenter(location);
      map.setZoom(14);
      const lat = location.lat();
      const lng = location.lng();
      setSelectedLocation({ lat, lng });
      setSelectedLocationFront({ lat, lng });
    };

    try {
      const { places } = await Place.searchByText({
        textQuery: keyword,
        fields: ["displayName", "location"],
      });

      if (places && places.length > 0) {
        setResults(places);
        applyLocation(places[0]);
      } else {
        const fallbackQuery = keyword.split(",").slice(-5).join(",").trim();
        const { places: fallbackPlaces } = await Place.searchByText({
          textQuery: fallbackQuery,
          fields: ["displayName", "location"],
        });

        if (fallbackPlaces && fallbackPlaces.length > 0) {
          setResults(fallbackPlaces);
          applyLocation(fallbackPlaces[0]);
        }
      }
    } catch (error) {
      console.error("Places search error:", error);
    }
  }, [keyword, map, setSelectedLocationFront]);

  useEffect(() => {
    const debouncedSearch = debounce(handleSearch, 1000);
    debouncedSearch();
  }, [handleSearch, keyword]);

  useEffect(() => {
    if (!map || !selectedLocation?.lat) return;

    const marker = new window.google.maps.marker.AdvancedMarkerElement({
      position: selectedLocation,
      map,
    });

    return () => {
      marker.map = null;
    };
  }, [map, selectedLocation]);

  // const handleChange = () => {
  //   debouncedSearch();
  // };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";
  return (
    <div>
      {/* <input
        type="text"
        ref={searchInputRef}
        placeholder="Search for places"
        style={{ width: '300px', padding: '10px', marginBottom: '10px' }}
        onChange={handleChange}
      /> */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={center}
        onLoad={onMapLoad}
        onClick={type === "select" ? onMapClick : null}
        options={{ mapId: "DEMO_MAP_ID" }}
      >
      </GoogleMap>
      {/* <div>
        {results.map((place, index) => (
          <div key={index}>
            <p>{place.name}</p>
          </div>
        ))}
      </div> */}
      {/* {selectedLocation && (
        <div>
          <p>Selected Location:</p>
          <p>Latitude: {selectedLocation.lat}</p>
          <p>Longitude: {selectedLocation.lng}</p>
        </div>
      )} */}
    </div>
  );
};

export default Maps;
