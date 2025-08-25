import React, {useState} from 'react'
import { GoogleMap, LoadScript, MarkerF, useJsApiLoader } from '@react-google-maps/api'

const GoogleMapsCustom = ({
  zoom,
  selectedLocation,
  onMapClick,
}) => {

  const mapStyles = {
    height: '400px',
    width: '100%'
  };
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCbN9h2LsBeVQOs1dST4wqu0uhBB1SCedw"
  })

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={mapStyles}
      zoom={zoom}
      center={selectedLocation}
      onClick={onMapClick}
    >
      {selectedLocation && (
        <MarkerF
          position={selectedLocation}
        />
      )}
    </GoogleMap>
    ) :
  <></>
}

export default GoogleMapsCustom