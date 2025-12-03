import { useState, useCallback, useEffect } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";

const libraries = ["places"];
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
    [setSelectedLocationFront],
  );

  const onMapLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const handleSearch = useCallback(() => {
    // if (searchInputRef.current.value === '') return;
    if (keyword === "") return;

    const service = new window.google.maps.places.PlacesService(map);

    const request = {
      // query: searchInputRef.current.value,
      query: keyword,
      fields: ["name", "geometry"],
    };

    const keywordTemp = keyword;
    const alamatParts = keywordTemp.split(",");
    const resultSecond = alamatParts.slice(-5).join(",").trim();
    const requestSecond = {
      query: resultSecond,
      fields: ["name", "geometry"],
    };

    service.textSearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setResults(results);

        const firstResultLocation = results[0].geometry.location;
        map.setCenter(firstResultLocation);
        map.setZoom(14);

        // Extract latitude and longitude
        const lat = firstResultLocation.lat();
        const lng = firstResultLocation.lng();

        // Store selected location
        setSelectedLocation({ lat, lng });
        setSelectedLocationFront({ lat, lng });
      } else {
        service.textSearch(requestSecond, (fallbackResults, fallbackStatus) => {
          if (
            fallbackStatus ===
              window.google.maps.places.PlacesServiceStatus.OK &&
            fallbackResults &&
            fallbackResults.length > 0
          ) {
            setResults(fallbackResults);

            const firstResultLocation = fallbackResults[0].geometry.location;
            map.setCenter(firstResultLocation);
            map.setZoom(14);

            // Extract latitude and longitude
            const lat = firstResultLocation.lat();
            const lng = firstResultLocation.lng();

            // Store selected location
            setSelectedLocation({ lat, lng });
            setSelectedLocationFront({ lat, lng });
          }
        });
      }
    });
  }, [keyword, map, setSelectedLocationFront]);

  // const debouncedSearch = useCallback(debounce(handleSearch, 800), [map]);
  useEffect(() => {
    const debouncedSearch = debounce(handleSearch, 1000);

    debouncedSearch();
  }, [handleSearch, keyword]);

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
        onClick={type === "select" ? onMapClick : null} // Only trigger onMapClick}
      >
        {selectedLocation && (
          <MarkerF
            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
          />
        )}
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
