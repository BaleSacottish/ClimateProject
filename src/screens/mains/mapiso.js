import { View, SafeAreaView, StyleSheet, Text, forwardRef, Platform } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'

import MapView, { PROVIDER_GOOGLE, Marker, Heatmap, Polygon, Polyline } from 'react-native-maps';

import globalStyles from '../../contanst/globalStyle'
import colors from '../../contanst/colors'

import { demoData } from '../db/demo';


const metersToDegreesLat = (meters) => meters / 111000;
const metersToDegreesLon = (meters, latitude) => meters / (111000 * Math.cos(latitude * Math.PI / 180));

const generatePolygonCoordinates2 = (latitude, longitude, distanceInMeters) => {
  const offsetLat = metersToDegreesLat(distanceInMeters);
  const offsetLon = metersToDegreesLon(distanceInMeters, latitude);

  return [
    { latitude: latitude + offsetLat, longitude: longitude }, // Top
    { latitude: latitude + offsetLat / 2, longitude: longitude + offsetLon }, // Top-right
    { latitude: latitude - offsetLat / 2, longitude: longitude + offsetLon }, // Bottom-right
    { latitude: latitude - offsetLat, longitude: longitude }, // Bottom
    { latitude: latitude - offsetLat / 2, longitude: longitude - offsetLon }, // Bottom-left
    { latitude: latitude + offsetLat / 2, longitude: longitude - offsetLon }, // Top-left
  ];
};

// const generatePolygonCoordinates = (data) => {
//   const coordinates = demoData.map(item => ({
//     latitude: item.latitude,
//     longitude: item.longitude
//   }));

//   // Optionally close the polygon by connecting the last point back to the first
//   if (coordinates.length > 0) {
//     coordinates.push(coordinates[0]);
//   }

//   return coordinates;
// };

const calculateCentroid = (points) => {
  const centroid = points.reduce((acc, point) => {
    acc.latitude += point.latitude;
    acc.longitude += point.longitude;
    return acc;
  }, { latitude: 0, longitude: 0 });

  centroid.latitude /= points.length;
  centroid.longitude /= points.length;

  return centroid;
};

const sortPointsClockwise = (points) => {
  const centroid = calculateCentroid(points);

  return points.sort((a, b) => {
    const angleA = Math.atan2(a.latitude - centroid.latitude, a.longitude - centroid.longitude);
    const angleB = Math.atan2(b.latitude - centroid.latitude, b.longitude - centroid.longitude);
    return angleA - angleB;
  });
};

const generatePolygonCoordinates = (data) => {
  const coordinates = demoData.map(item => ({
    latitude: item.latitude,
    longitude: item.longitude
  }));

  // Sort points to form a better polygon
  const sortedCoordinates = sortPointsClockwise(coordinates);

  // Optionally close the polygon by connecting the last point back to the first
  if (sortedCoordinates.length > 0) {
    sortedCoordinates.push(sortedCoordinates[0]);
  }

  return sortedCoordinates;
};










const Mapiso = () => {


  const getColor = (pm25) => {
    const value = parseFloat(pm25);
    if (isNaN(value)) return '#02AEEE'; // Default color if PM2.5 is not a number
    if (value < 10) return '#02AEEE'; // Blue
    if (value > 10 && value <= 15) return '#32B648';
    if (value > 15 && value <= 20) return '#FDFC01';
    if (value > 20 && value <= 25) return '#F37135';
    return '#EC1D25'; // Red
  };

  const markers = [
    {
      id: '1',
      coordinate: { latitude: 14.8818, longitude: 102.0173 },
      title: "Marker 1",
      description: "This is marker 1",
      weight: 1
    },
    {
      id: '2',
      coordinate: { latitude: 14.8638, longitude: 102.03529 },
      title: "Marker 2",
      description: "This is marker 2",
      weight: 1
    },
  ];

  const points = [
    { id: '2', latitude: 14.8818, longitude: 102.0173, },
    { id: '1', latitude: 14.8638, longitude: 102.03529, },

    // Add more points with weights
  ];

  //defalt position
  const initialRegion = {
    latitude: 14.881474,
    longitude: 102.015555,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  };

  const isoplethPolygonCoordinates = [
    { latitude: 14.8818, longitude: 102.0173 },
    { latitude: 14.8825, longitude: 102.0185 },
    { latitude: 14.8682975839324, longitude: 102.01729597322 },
    { latitude: 14.8727967785766, longitude: 102.012796778576 },
    { latitude: 14.8772959732207, longitude: 102.003798389288 },

  ];


  const distanceInMeters = 400;

  const layer1 = demoData.filter(item => item.Pm25 < 10);  // PM2.5 < 10
  const layer2 = demoData.filter(item => item.Pm25 > 10 && item.Pm25 < 15);  // 10 ≤ PM2.5 ≤ 15
  const layer3 = demoData.filter(item => item.Pm25 > 15 && item.Pm25 <= 20);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{
        ...globalStyles.welcome_padding2
      }}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={initialRegion}
        >
          {/* Marker */}
          {demoData.map(station => (
            <Marker
              key={station.id.toString()}
              coordinate={{ latitude: station.latitude, longitude: station.longitude }}
              title={station.station}
              description={`PM2.5: ${station.Pm25},`}

            />
          ))}




          {/* 
          {demoData.map((item) => {
            // Generate coordinates
            const coordinates = generatePolygonCoordinates(item.latitude, item.longitude, distanceInMeters);

            return (
              <Polygon
                key={item.id}
                coordinates={coordinates}
                strokeColor={getColor(item.Pm25)}
                strokeWidth={1}
                fillColor={getColor(item.Pm25) + '50'} // Adding transparency
              />
            );
          })} */}

          {/* 
          {demoData.map((data, index) => {
            const polygonCoords = generatePolygonCoordinates2(
              data.latitude,
              data.longitude,
              distanceInMeters
            );

            return (
              <Polygon
                key={index}
                coordinates={polygonCoords}
                fillColor={getColor(data.Pm25) + "60"}
                strokeColor="rgba(0,0,0,0.5)"
                strokeWidth={0.02}
              />
            );
          })} */}



{/* 
          {demoData.map((item) => {
            // Generate coordinates
            const coordinates = generatePolygonCoordinates(item.latitude, item.longitude, distanceInMeters);

            return (
              <Polygon
                key={item.id}
                coordinates={coordinates}
                strokeColor={getColor(item.Pm25)}
                strokeWidth={1}
                fillColor={getColor(item.Pm25) + '50'} // Adding transparency
              />


            );
          })} */}

   

      




















        </MapView>





      </View>
    </SafeAreaView>
  )
}

export default Mapiso

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});