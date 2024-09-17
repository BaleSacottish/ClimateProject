import { View, SafeAreaView, StyleSheet, Text, forwardRef, Platform } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'

import MapView, { PROVIDER_GOOGLE, Marker, Heatmap, Polygon, Polyline, Circle } from 'react-native-maps';
import { Svg, Path } from 'react-native-svg';

import globalStyles from '../../contanst/globalStyle'
import colors from '../../contanst/colors'

import { demoData } from '../db/demo';

// import firestore from '@react-native-firebase/firestore';
import { firebase, firestore } from '../db/config'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';


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

const isoplethPolygonCoordinates = [
  { latitude: 14.8952927517974, longitude: 101.9948 },
  { latitude: 14.8907935571532, longitude: 101.9948 },
  { latitude: 14.8862943625091, longitude: 101.9948 },

  { latitude: 14.8817951678649, longitude: 101.9948 },
  { latitude: 14.8727967785766, longitude: 102.008297583932 },
  { latitude: 14.8727967785766, longitude: 102.012796778576 },

  { latitude: 14.8682975839324, longitude: 102.01729597322 },
  { latitude: 14.8682975839324, longitude: 102.021795167864 },
  { latitude: 14.8637983892883, longitude: 102.026294362509 },

  { latitude: 14.8592991946441, longitude: 102.035292751797 },
  { latitude: 14.8592991946441, longitude: 102.039791946441 },
  { latitude: 14.8637983892883, longitude: 102.039791946441 },
  { latitude: 14.8727967785766, longitude: 102.039791946441 },
  { latitude: 14.8727967785766, longitude: 102.035292751797 },
  { latitude: 14.8727967785766, longitude: 102.030793557153 },
  { latitude: 14.8817951678649, longitude: 102.026294362509 },
  { latitude: 14.8772959732207, longitude: 102.026294362509 },
  { latitude: 14.8862943625091, longitude: 102.021795167864 },
  { latitude: 14.8907935571532, longitude: 102.01729597322 },
  { latitude: 14.8952927517974, longitude: 102.01729597322 },
  { latitude: 14.8952927517974, longitude: 102.012796778576 },
  { latitude: 14.8952927517974, longitude: 102.008297583932 },
  { latitude: 14.8952927517974, longitude: 102.003798389288 },
  { latitude: 14.8952927517974, longitude: 101.999299194644 },
];

const isoplethPolygonCoordinates1 = [
  { latitude: 14.86829758, longitude: 102.0352928 },
  { latitude: 14.86379839, longitude: 102.0397919 },
  { latitude: 14.8592991946441, longitude: 102.039791946441 },
  { latitude: 14.8592991946441, longitude: 102.035292751797 },
  { latitude: 14.86379839, longitude: 102.0307936 },
  { latitude: 14.8637983892883, longitude: 102.035292751797 },
];

const isoplethPolygonCoordinates2 = [
  { latitude: 14.8952927517974, longitude: 102.01729597322 },
  { latitude: 14.8907935571532, longitude: 102.012796778576 },

  { latitude: 14.88629436, longitude: 102.0082946 },
  { latitude: 14.88629436, longitude: 102.0127968 },

  { latitude: 14.88629436, longitude: 102.017296 },
  { latitude: 14.88629436, longitude: 102.0217952 },
  { latitude: 14.89079356, longitude: 102.017296 },
];

const isoplethPolygonCoordinates3 = [
  { latitude: 14.89529275, longitude: 101.9948 },
  { latitude: 14.8952927517974, longitude: 102.01729597322 },

  { latitude: 14.88629436, longitude: 102.0082946 },
  { latitude: 14.88629436, longitude: 101.9948 },

];

const isoplethPolygonCoordinates4 = [
  { latitude: 14.8952927517974, longitude: 102.003798389288 },
  { latitude: 14.88629436, longitude: 101.9948 },
  { latitude: 14.88629436, longitude: 102.0037984 },
];

const isoplethPolygonCoordinates5 = [
  { latitude: 14.88629436, longitude: 101.9948 },
  { latitude: 14.87729597, longitude: 101.9992992 },
  { latitude: 14.87279678, longitude: 102.0082976 },

  { latitude: 14.87279678, longitude: 102.0127968 },
  { latitude: 14.87729597, longitude: 102.0082976 },
  { latitude: 14.88629436, longitude: 102.0037984 },


];

const isoplethPolygonCoordinates6 = [
  { latitude: 14.8592991946441, longitude: 102.035292751797 },
  { latitude: 14.8637983892883, longitude: 102.026294362509 },
  { latitude: 14.86829758, longitude: 102.0217952 },

  { latitude: 14.86829758, longitude: 102.02624944 },
  { latitude: 14.86829758, longitude: 102.03 },
  { latitude: 14.86379839, longitude: 102.0307936 },





];
const isoplethPolygonCoordinates7 = [
  { latitude: 14.86829758, longitude: 102.03 },

  { latitude: 14.87279678, longitude: 102.0307936 },
  { latitude: 14.87279678, longitude: 102.0262944 },

  { latitude: 14.87279678, longitude: 102.0217952 },

  { latitude: 14.86829758, longitude: 102.0217952 },
  { latitude: 14.86829758, longitude: 102.02624944 },

];
const isoplethPolygonCoordinates8 = [
  { latitude: 14.87279678, longitude: 102.0127968 },

  { latitude: 14.87279678, longitude: 102.017296 },


  { latitude: 14.87279678, longitude: 102.0217952 },

  { latitude: 14.86829758, longitude: 102.0217952 },
  { latitude: 14.86829758, longitude: 102.017296 },

];

const isoplethPolygonCoordinates9 = [
  { latitude: 14.86829758, longitude: 102.0352928 },
  { latitude: 14.86379839, longitude: 102.0352928 },

  { latitude: 14.86379839, longitude: 102.0307936 },
  { latitude: 14.86829758, longitude: 102.0307936 },

  { latitude: 14.87279678, longitude: 102.0307936 },

  { latitude: 14.87279678, longitude: 102.0397919 },
  { latitude: 14.86379839, longitude: 102.0397919 },

];
const isoplethPolygonCoordinates10 = [
  { latitude: 14.87279678, longitude: 102.0307936 },
  { latitude: 14.88179517, longitude: 102.0262944 },

  { latitude: 14.88629436, longitude: 102.0217952 },
  { latitude: 14.88629436, longitude: 102.0127968 },

  { latitude: 14.88179517, longitude: 102.017296 },

  { latitude: 14.87279678, longitude: 102.0217952 },


];



const Mapiso = ({ navigation, latitude, longitude }) => {

  const [stations, setStations] = useState([]);
  const [stationmaker, setStationmarker] = useState([])
  const [loading, setLoading] = useState(true);

  const [zonestatus1, setZonestatus1] = useState([]);
  const [zonestatus2, setZonestatus2] = useState([]);
  const [zonestatus3, setZonestatus3] = useState([]);
  const [zonestatus4, setZonestatus4] = useState([]);
  const [zonestatus5, setZonestatus5] = useState([]);
  const [zonestatus6, setZonestatus6] = useState([]);
  const [zonestatus7, setZonestatus7] = useState([]);
  const [zonestatus8, setZonestatus8] = useState([]);
  const [zonestatus9, setZonestatus9] = useState([]);
  const [zonestatus10, setZonestatus10] = useState([]);

  const getColor = (pm25) => {
    const value = parseFloat(pm25);
    if (isNaN(value)) return '#02AEEE'; // Default color if PM2.5 is not a number
    if (value < 10) return '#02AEEE'; // Blue
    if (value > 10 && value <= 15) return '#32B648';
    if (value > 15 && value <= 20) return '#FDFC01';
    if (value > 20 && value <= 25) return '#F37135';
    return '#EC1D25'; // Red
  };

  // useEffect(() => {
  //   const fetchStationsAndStatus = async () => {
  //     try {
  //       // Fetch data from 'station_realair' collection
  //       const stationCollection = await firestore().collection('station_realair').get();

  //       const stationListPromises = stationCollection.docs.map(async (doc) => {
  //         const stationData = doc.data();

  //         // Query to get the latest status from 'status' subcollection
  //         const statusSnapshot = await firestore()
  //           .collection('station_realair')
  //           .doc(doc.id)
  //           .collection('status')
  //           .orderBy('status_datestamp', 'desc') // Order by latest status
  //           .limit(1) // Limit to 1 document
  //           .get();

  //         const statusData = statusSnapshot.docs.map(subDoc => {
  //           const status = subDoc.data();

  //           // Convert status_datestamp from Firestore Timestamp to Date
  //           const status_datestamp = status.status_datestamp.toDate();

  //           return {
  //             id: subDoc.id,
  //             ...status,
  //             status_datestamp: status_datestamp.toLocaleString() // Convert Date to string
  //           };
  //         });

  //         // Verify coordinate data
  //         const coordinates = stationData.station_codinates;

  //         if (!coordinates || typeof coordinates.latitude === 'undefined' || typeof coordinates.longitude === 'undefined') {
  //           console.error(`Invalid or missing coordinates for document ${doc.id}`);
  //           return null;
  //         }

  //         return {
  //           id: doc.id,
  //           station_name: stationData.station_name,
  //           coordinates: coordinates, // No need to generate separate polygons now
  //           status: statusData.length > 0 ? statusData[0] : null // Use latest status
  //         };
  //       });

  //       const stationsWithDetails = await Promise.all(stationListPromises);

  //       // Filter out null values
  //       const validStations = stationsWithDetails.filter(station => station !== null);

  //       // Collect coordinates from all valid stations for a single polygon
  //       const polygonCoordinates = validStations.map(station => ({
  //         latitude: station.coordinates.latitude,
  //         longitude: station.coordinates.longitude,
  //       }));

  //       setPolygon(polygonCoordinates); // Set collected coordinates as the polygon

  //     } catch (error) {
  //       console.error('Error fetching stations and status: ', error);
  //     } finally {
  //       setLoading(false); // Hide loading indicator when data is loaded
  //     }
  //   };

  //   fetchStationsAndStatus(); // Call function on component mount
  // }, []);



  // const generatePolygonCoordinates = (center, radiusInMeters, numSides = 36) => {
  //   const coordinates = [];
  //   const angleStep = (2 * Math.PI) / numSides; // Angle between each vertex

  //   // Convert radius from meters to degrees
  //   const radiusLat = radiusInMeters / 111320; // Latitude degrees
  //   const radiusLng = radiusInMeters / (111320 * Math.cos(center.latitude * (Math.PI / 180))); // Longitude degrees

  //   for (let i = 0; i < numSides; i++) {
  //     const angle = i * angleStep;
  //     const latOffset = radiusLat * Math.cos(angle);
  //     const lngOffset = radiusLng * Math.sin(angle);

  //     coordinates.push({
  //       latitude: center.latitude + latOffset,
  //       longitude: center.longitude + lngOffset,
  //     });
  //   }

  //   return coordinates;
  // };



  // marker and colort

  //defalt position

  const initialRegion = {
    latitude: 14.881474,
    longitude: 102.015555,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  };


 

  useEffect(() => {
    const fetchStationsAndStatus = async () => {
      try {
        // ดึงข้อมูลจาก collection 'station_realair'
        const stationCollection = await firestore().collection('station_realair').get();

        const stationListPromises = stationCollection.docs.map(async (doc) => {
          const stationData = doc.data();

          // Query เพื่อดึงสถานะล่าสุดจาก subcollection 'status'
          const statusSnapshot = await firestore()
            .collection('station_realair')
            .doc(doc.id)
            .collection('status')
            .orderBy('status_datestamp', 'desc') // เรียงตามสถานะล่าสุด
            .limit(1) // จำกัดให้ดึงเพียง 1 document
            .get();

          const statusData = statusSnapshot.docs.map(subDoc => {
            const status = subDoc.data();

            // แปลง status_datestamp ที่เป็น Firestore Timestamp ให้เป็น Date
            const status_datestamp = status.status_datestamp.toDate();

            return {
              id: subDoc.id,
              ...status,
              status_datestamp: status_datestamp.toLocaleString() // แปลง Date เป็น string
            };
          });

          // ตรวจสอบข้อมูลตำแหน่ง
          const cordinates = stationData.station_codinates;

          if (!cordinates || typeof cordinates.latitude === 'undefined' || typeof cordinates.longitude === 'undefined') {
            console.error(`Invalid or missing coordinates for document ${doc.id}`);
            return null;
          }

          return {
            id: doc.id,
            station_name: stationData.station_name,
            latitude: cordinates.latitude,
            longitude: cordinates.longitude,
            status: statusData.length > 0 ? statusData[0] : null // ถ้ามีสถานะ ใช้ statusData[0]
          };
        });

        const stationsWithDetails = await Promise.all(stationListPromises);

        // Filter out null values
        const validStations = stationsWithDetails.filter(station => station !== null);

        setStationmarker(validStations);

      } catch (error) {
        console.error('Error fetching stations and status: ', error);
      } finally {
        setLoading(false); // ซ่อน loading indicator เมื่อข้อมูลโหลดเสร็จ
      }
    };

    fetchStationsAndStatus(); // เรียกฟังก์ชันเมื่อ component ทำการ mount
  }, []);

  // polygonColor

  // useEffect(() => {
  //   const fetchStationsAndStatus = async () => {
  //     try {
  //       // Fetch data from 'station_realair' collection
  //       const stationCollection = await firestore().collection('station_realair').get();

  //       const stationListPromises = stationCollection.docs.map(async (doc) => {
  //         const stationData = doc.data();

  //         // Query to get the latest status from 'status' subcollection
  //         const statusSnapshot = await firestore()
  //           .collection('station_realair')
  //           .doc(doc.id)
  //           .collection('status')
  //           .orderBy('status_datestamp', 'desc') // Order by latest status
  //           .limit(1) // Limit to 1 document
  //           .get();

  //         const statusData = statusSnapshot.docs.map(subDoc => {
  //           const status = subDoc.data();

  //           // Convert status_datestamp from Firestore Timestamp to Date
  //           const status_datestamp = status.status_datestamp.toDate();

  //           return {
  //             id: subDoc.id,
  //             ...status,
  //             status_datestamp: status_datestamp.toLocaleString() // Convert Date to string
  //           };
  //         });

  //         // Verify coordinate data
  //         const cordinates = stationData.station_codinates;

  //         if (!cordinates || typeof cordinates.latitude === 'undefined' || typeof cordinates.longitude === 'undefined') {
  //           console.error(`Invalid or missing coordinates for document ${doc.id}`);
  //           return null;
  //         }

  //         // Generate polygon coordinates around the central point
  //         const radiusInMeters = 400; // Define the radius for the polygon
  //         const polygonCoordinates = generatePolygonCoordinates(cordinates, radiusInMeters);

  //         // Ensure polygon coordinates are valid
  //         if (!polygonCoordinates || polygonCoordinates.length === 0) {
  //           console.error(`No valid coordinates for document ${doc.id}`);
  //           return null;
  //         }

  //         return {
  //           id: doc.id,
  //           station_name: stationData.station_name,
  //           coordinates: polygonCoordinates,
  //           status: statusData.length > 0 ? statusData[0] : null // Use latest status
  //         };
  //       });

  //       const stationsWithDetails = await Promise.all(stationListPromises);

  //       // Filter out null values
  //       const validStations = stationsWithDetails.filter(station => station !== null);

  //       setStations(validStations);

  //     } catch (error) {
  //       console.error('Error fetching stations and status: ', error);
  //     } finally {
  //       setLoading(false); // Hide loading indicator when data is loaded
  //     }
  //   };

  //   fetchStationsAndStatus(); // Call function on component mount
  // }, []);

  // useEffect(() => {
  //   const fetchStationsAndStatus = async () => {
  //     try {
  //       const stationCollection = await firestore().collection('station_realair').get();

  //       const stationListPromises = stationCollection.docs.map(async (doc) => {
  //         const stationData = doc.data();

  //         const statusSnapshot = await firestore()
  //           .collection('station_realair')
  //           .doc(doc.id)
  //           .collection('status')
  //           .orderBy('status_datestamp', 'desc')
  //           .limit(1)
  //           .get();

  //         const statusData = statusSnapshot.docs.map(subDoc => {
  //           const status = subDoc.data();
  //           const status_datestamp = status.status_datestamp.toDate();
  //           return {
  //             id: subDoc.id,
  //             ...status,
  //             status_datestamp: status_datestamp.toLocaleString()
  //           };
  //         });

  //         const coordinates = stationData.station_codinates;

  //         if (!coordinates || typeof coordinates.latitude === 'undefined' || typeof coordinates.longitude === 'undefined') {
  //           console.error(`Invalid or missing coordinates for document ${doc.id}`);
  //           return null;
  //         }

  //         // Check if the station's coordinates fall within the specified polygon area
  //         const isInsidePolygon = isPointInPolygon(coordinates, isoplethPolygonCoordinates2);

  //         if (!isInsidePolygon) {
  //           return null;
  //         }

  //         return {
  //           id: doc.id,
  //           station_name: stationData.station_name,
  //           coordinates: coordinates,
  //           status: statusData.length > 0 ? statusData[0] : null
  //         };
  //       });

  //       const stationsWithDetails = await Promise.all(stationListPromises);
  //       const validStations = stationsWithDetails.filter(station => station !== null);

  //       setStations(validStations);

  //     } catch (error) {
  //       console.error('Error fetching stations and status: ', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchStationsAndStatus();
  // }, []);

  // Determine the color based on status_pm

 function generatePolygonCoordinates(center, radiusInMeters, numPoints = 6) {
    const coordinates = [];
    const angleStep = (2 * Math.PI) / numPoints;

    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep;
      const xOffset = radiusInMeters * Math.cos(angle);
      const yOffset = radiusInMeters * Math.sin(angle);

      // Convert offsets to latitude and longitude (assumes small distances)
      const latOffset = xOffset / 111320; // Approximate conversion from meters to latitude
      const lngOffset = yOffset / (111320 * Math.cos(center.latitude * (Math.PI / 180))); // Approximate conversion

      coordinates.push({
        latitude: center.latitude + latOffset,
        longitude: center.longitude + lngOffset
      });
    }

    return coordinates;
  }
  // // Zone1
  // useEffect(() => {
  //   const fetchStationsAndStatus = async () => {
  //     try {
  //       const stationCollection = await firestore().collection('station_realair').get();

  //       const stationListPromises = stationCollection.docs.map(async (doc) => {
  //         const stationData = doc.data();

  //         const statusSnapshot = await firestore()
  //           .collection('station_realair')
  //           .doc('XXAmTY4YV5zDLtbCK0Z7')
  //           .collection('status')
  //           .orderBy('status_datestamp', 'desc')
  //           .limit(1)
  //           .get();

  //         const statusData = statusSnapshot.docs.map(subDoc => {
  //           const status = subDoc.data();
  //           const status_datestamp = status.status_datestamp.toDate();
  //           return {
  //             id: subDoc.id,
  //             ...status,
  //             status_datestamp: status_datestamp.toLocaleString()
  //           };
  //         });

  //         const coordinates = stationData.station_codinates;

  //         if (!coordinates || typeof coordinates.latitude === 'undefined' || typeof coordinates.longitude === 'undefined') {
  //           console.error(`Invalid or missing coordinates for document ${doc.id}`);
  //           return null;
  //         }

  //         return {
  //           id: doc.id,
  //           station_name: stationData.station_name,
  //           latitude: coordinates.latitude,
  //           longitude: coordinates.longitude,
  //           status: statusData.length > 0 ? statusData[0] : null
  //         };
  //       });

  //       const stationsWithDetails = await Promise.all(stationListPromises);
  //       const validStations = stationsWithDetails.filter(station => station !== null);

  //       setZonestatus1(validStations);

  //     } catch (error) {
  //       console.error('Error fetching stations and status: ', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchStationsAndStatus();
  // }, []);

  // // Zone2
  // useEffect(() => {
  //   const fetchStationsAndStatus = async () => {
  //     try {
  //       const stationCollection = await firestore().collection('station_realair').get();

  //       const stationListPromises = stationCollection.docs.map(async (doc) => {
  //         const stationData = doc.data();

  //         const statusSnapshot = await firestore()
  //           .collection('station_realair')
  //           .doc('klx7b9neRfTaVJBSU82N') //station 1
  //           .collection('status')
  //           .orderBy('status_datestamp', 'desc')
  //           .limit(1)
  //           .get();

  //         const statusData = statusSnapshot.docs.map(subDoc => {
  //           const status = subDoc.data();
  //           const status_datestamp = status.status_datestamp.toDate();
  //           return {
  //             id: subDoc.id,
  //             ...status,
  //             status_datestamp: status_datestamp.toLocaleString()
  //           };
  //         });

  //         const coordinates = stationData.station_codinates;

  //         if (!coordinates || typeof coordinates.latitude === 'undefined' || typeof coordinates.longitude === 'undefined') {
  //           console.error(`Invalid or missing coordinates for document ${doc.id}`);
  //           return null;
  //         }

  //         return {
  //           id: doc.id,
  //           station_name: stationData.station_name,
  //           latitude: coordinates.latitude,
  //           longitude: coordinates.longitude,
  //           status: statusData.length > 0 ? statusData[0] : null
  //         };
  //       });

  //       const stationsWithDetails = await Promise.all(stationListPromises);
  //       const validStations = stationsWithDetails.filter(station => station !== null);

  //       setZonestatus2(validStations);
  //       // console.log(zonestatus1)

  //     } catch (error) {
  //       console.error('Error fetching stations and status: ', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchStationsAndStatus();
  // }, []);

  // // Zone3
  // useEffect(() => {
  //   const fetchStationsAndStatus = async () => {
  //     try {
  //       const stationCollection = await firestore().collection('station_realair').get();

  //       const stationListPromises = stationCollection.docs.map(async (doc) => {
  //         const stationData = doc.data();

  //         const statusSnapshot = await firestore()
  //           .collection('station_realair')
  //           .doc('DxgbNH6cyUaePrhRczpT') //station 1
  //           .collection('status')
  //           .orderBy('status_datestamp', 'desc')
  //           .limit(1)
  //           .get();

  //         const statusData = statusSnapshot.docs.map(subDoc => {
  //           const status = subDoc.data();
  //           const status_datestamp = status.status_datestamp.toDate();
  //           return {
  //             id: subDoc.id,
  //             ...status,
  //             status_datestamp: status_datestamp.toLocaleString()
  //           };
  //         });

  //         const coordinates = stationData.station_codinates;

  //         if (!coordinates || typeof coordinates.latitude === 'undefined' || typeof coordinates.longitude === 'undefined') {
  //           console.error(`Invalid or missing coordinates for document ${doc.id}`);
  //           return null;
  //         }

  //         return {
  //           id: doc.id,
  //           station_name: stationData.station_name,
  //           latitude: coordinates.latitude,
  //           longitude: coordinates.longitude,
  //           status: statusData.length > 0 ? statusData[0] : null
  //         };
  //       });

  //       const stationsWithDetails = await Promise.all(stationListPromises);
  //       const validStations = stationsWithDetails.filter(station => station !== null);

  //       setZonestatus3(validStations);
  //       // console.log(zonestatus1)

  //     } catch (error) {
  //       console.error('Error fetching stations and status: ', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchStationsAndStatus();
  // }, []);

  // // Zone4
  // useEffect(() => {
  //   const fetchStationsAndStatus = async () => {
  //     try {
  //       const stationCollection = await firestore().collection('station_realair').get();

  //       const stationListPromises = stationCollection.docs.map(async (doc) => {
  //         const stationData = doc.data();

  //         const statusSnapshot = await firestore()
  //           .collection('station_realair')
  //           .doc('VZIJIRdEjjjlCEJCn1fi') //station 1
  //           .collection('status')
  //           .orderBy('status_datestamp', 'desc')
  //           .limit(1)
  //           .get();

  //         const statusData = statusSnapshot.docs.map(subDoc => {
  //           const status = subDoc.data();
  //           const status_datestamp = status.status_datestamp.toDate();
  //           return {
  //             id: subDoc.id,
  //             ...status,
  //             status_datestamp: status_datestamp.toLocaleString()
  //           };
  //         });

  //         const coordinates = stationData.station_codinates;

  //         if (!coordinates || typeof coordinates.latitude === 'undefined' || typeof coordinates.longitude === 'undefined') {
  //           console.error(`Invalid or missing coordinates for document ${doc.id}`);
  //           return null;
  //         }

  //         return {
  //           id: doc.id,
  //           station_name: stationData.station_name,
  //           latitude: coordinates.latitude,
  //           longitude: coordinates.longitude,
  //           status: statusData.length > 0 ? statusData[0] : null
  //         };
  //       });

  //       const stationsWithDetails = await Promise.all(stationListPromises);
  //       const validStations = stationsWithDetails.filter(station => station !== null);

  //       setZonestatus4(validStations);
  //       // console.log(zonestatus1)

  //     } catch (error) {
  //       console.error('Error fetching stations and status: ', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchStationsAndStatus();
  // }, []);

  // // Zone5
  // useEffect(() => {
  //   const fetchStationsAndStatus = async () => {
  //     try {
  //       const stationCollection = await firestore().collection('station_realair').get();

  //       const stationListPromises = stationCollection.docs.map(async (doc) => {
  //         const stationData = doc.data();

  //         const statusSnapshot = await firestore()
  //           .collection('station_realair')
  //           .doc('JL25tJDmw2a6kF6pVVAn') //station 1
  //           .collection('status')
  //           .orderBy('status_datestamp', 'desc')
  //           .limit(1)
  //           .get();

  //         const statusData = statusSnapshot.docs.map(subDoc => {
  //           const status = subDoc.data();
  //           const status_datestamp = status.status_datestamp.toDate();
  //           return {
  //             id: subDoc.id,
  //             ...status,
  //             status_datestamp: status_datestamp.toLocaleString()
  //           };
  //         });

  //         const coordinates = stationData.station_codinates;

  //         if (!coordinates || typeof coordinates.latitude === 'undefined' || typeof coordinates.longitude === 'undefined') {
  //           console.error(`Invalid or missing coordinates for document ${doc.id}`);
  //           return null;
  //         }

  //         return {
  //           id: doc.id,
  //           station_name: stationData.station_name,
  //           latitude: coordinates.latitude,
  //           longitude: coordinates.longitude,
  //           status: statusData.length > 0 ? statusData[0] : null
  //         };
  //       });

  //       const stationsWithDetails = await Promise.all(stationListPromises);
  //       const validStations = stationsWithDetails.filter(station => station !== null);

  //       setZonestatus5(validStations);
  //       // console.log(zonestatus1)

  //     } catch (error) {
  //       console.error('Error fetching stations and status: ', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchStationsAndStatus();
  // }, []);

  // // Zone6
  // useEffect(() => {
  //   const fetchStationsAndStatus = async () => {
  //     try {
  //       const stationCollection = await firestore().collection('station_realair').get();

  //       const stationListPromises = stationCollection.docs.map(async (doc) => {
  //         const stationData = doc.data();

  //         const statusSnapshot = await firestore()
  //           .collection('station_realair')
  //           .doc('fXgV3ELF2nA6l8wGi7If') //station 1
  //           .collection('status')
  //           .orderBy('status_datestamp', 'desc')
  //           .limit(1)
  //           .get();

  //         const statusData = statusSnapshot.docs.map(subDoc => {
  //           const status = subDoc.data();
  //           const status_datestamp = status.status_datestamp.toDate();
  //           return {
  //             id: subDoc.id,
  //             ...status,
  //             status_datestamp: status_datestamp.toLocaleString()
  //           };
  //         });

  //         const coordinates = stationData.station_codinates;

  //         if (!coordinates || typeof coordinates.latitude === 'undefined' || typeof coordinates.longitude === 'undefined') {
  //           console.error(`Invalid or missing coordinates for document ${doc.id}`);
  //           return null;
  //         }

  //         return {
  //           id: doc.id,
  //           station_name: stationData.station_name,
  //           latitude: coordinates.latitude,
  //           longitude: coordinates.longitude,
  //           status: statusData.length > 0 ? statusData[0] : null
  //         };
  //       });

  //       const stationsWithDetails = await Promise.all(stationListPromises);
  //       const validStations = stationsWithDetails.filter(station => station !== null);

  //       setZonestatus6(validStations);
  //       // console.log(zonestatus1)

  //     } catch (error) {
  //       console.error('Error fetching stations and status: ', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchStationsAndStatus();
  // }, []);

  // // Zone7
  // useEffect(() => {
  //   const fetchStationsAndStatus = async () => {
  //     try {
  //       const stationCollection = await firestore().collection('station_realair').get();

  //       const stationListPromises = stationCollection.docs.map(async (doc) => {
  //         const stationData = doc.data();

  //         const statusSnapshot = await firestore()
  //           .collection('station_realair')
  //           .doc('6SHNRZf1D1n7BcuAR4py') //station 1
  //           .collection('status')
  //           .orderBy('status_datestamp', 'desc')
  //           .limit(1)
  //           .get();

  //         const statusData = statusSnapshot.docs.map(subDoc => {
  //           const status = subDoc.data();
  //           const status_datestamp = status.status_datestamp.toDate();
  //           return {
  //             id: subDoc.id,
  //             ...status,
  //             status_datestamp: status_datestamp.toLocaleString()
  //           };
  //         });

  //         const coordinates = stationData.station_codinates;

  //         if (!coordinates || typeof coordinates.latitude === 'undefined' || typeof coordinates.longitude === 'undefined') {
  //           console.error(`Invalid or missing coordinates for document ${doc.id}`);
  //           return null;
  //         }

  //         return {
  //           id: doc.id,
  //           station_name: stationData.station_name,
  //           latitude: coordinates.latitude,
  //           longitude: coordinates.longitude,
  //           status: statusData.length > 0 ? statusData[0] : null
  //         };
  //       });

  //       const stationsWithDetails = await Promise.all(stationListPromises);
  //       const validStations = stationsWithDetails.filter(station => station !== null);

  //       setZonestatus7(validStations);
  //       // console.log(zonestatus1)

  //     } catch (error) {
  //       console.error('Error fetching stations and status: ', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchStationsAndStatus();
  // }, []);
  // // Zone8
  // useEffect(() => {
  //   const fetchStationsAndStatus = async () => {
  //     try {
  //       const stationCollection = await firestore().collection('station_realair').get();

  //       const stationListPromises = stationCollection.docs.map(async (doc) => {
  //         const stationData = doc.data();

  //         const statusSnapshot = await firestore()
  //           .collection('station_realair')
  //           .doc('hUcheViR4agNhkx4k8Pa') //station 1
  //           .collection('status')
  //           .orderBy('status_datestamp', 'desc')
  //           .limit(1)
  //           .get();

  //         const statusData = statusSnapshot.docs.map(subDoc => {
  //           const status = subDoc.data();
  //           const status_datestamp = status.status_datestamp.toDate();
  //           return {
  //             id: subDoc.id,
  //             ...status,
  //             status_datestamp: status_datestamp.toLocaleString()
  //           };
  //         });

  //         const coordinates = stationData.station_codinates;

  //         if (!coordinates || typeof coordinates.latitude === 'undefined' || typeof coordinates.longitude === 'undefined') {
  //           console.error(`Invalid or missing coordinates for document ${doc.id}`);
  //           return null;
  //         }

  //         return {
  //           id: doc.id,
  //           station_name: stationData.station_name,
  //           latitude: coordinates.latitude,
  //           longitude: coordinates.longitude,
  //           status: statusData.length > 0 ? statusData[0] : null
  //         };
  //       });

  //       const stationsWithDetails = await Promise.all(stationListPromises);
  //       const validStations = stationsWithDetails.filter(station => station !== null);

  //       setZonestatus8(validStations);
  //       // console.log(zonestatus1)

  //     } catch (error) {
  //       console.error('Error fetching stations and status: ', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchStationsAndStatus();
  // }, []);

  // // Zone9
  // useEffect(() => {
  //   const fetchStationsAndStatus = async () => {
  //     try {
  //       const stationCollection = await firestore().collection('station_realair').get();

  //       const stationListPromises = stationCollection.docs.map(async (doc) => {
  //         const stationData = doc.data();

  //         const statusSnapshot = await firestore()
  //           .collection('station_realair')
  //           .doc('Gtco7rRPvZXYHadniwPw') //station 1
  //           .collection('status')
  //           .orderBy('status_datestamp', 'desc')
  //           .limit(1)
  //           .get();

  //         const statusData = statusSnapshot.docs.map(subDoc => {
  //           const status = subDoc.data();
  //           const status_datestamp = status.status_datestamp.toDate();
  //           return {
  //             id: subDoc.id,
  //             ...status,
  //             status_datestamp: status_datestamp.toLocaleString()
  //           };
  //         });

  //         const coordinates = stationData.station_codinates;

  //         if (!coordinates || typeof coordinates.latitude === 'undefined' || typeof coordinates.longitude === 'undefined') {
  //           console.error(`Invalid or missing coordinates for document ${doc.id}`);
  //           return null;
  //         }

  //         return {
  //           id: doc.id,
  //           station_name: stationData.station_name,
  //           latitude: coordinates.latitude,
  //           longitude: coordinates.longitude,
  //           status: statusData.length > 0 ? statusData[0] : null
  //         };
  //       });

  //       const stationsWithDetails = await Promise.all(stationListPromises);
  //       const validStations = stationsWithDetails.filter(station => station !== null);

  //       setZonestatus9(validStations);
  //       // console.log(zonestatus1)

  //     } catch (error) {
  //       console.error('Error fetching stations and status: ', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchStationsAndStatus();
  // }, []);

  // // Zone10
  // useEffect(() => {
  //   const fetchStationsAndStatus = async () => {
  //     try {
  //       const stationCollection = await firestore().collection('station_realair').get();

  //       const stationListPromises = stationCollection.docs.map(async (doc) => {
  //         const stationData = doc.data();

  //         const statusSnapshot = await firestore()
  //           .collection('station_realair')
  //           .doc('y2CzpLPtpagoU6f3yzeV') //station 1
  //           .collection('status')
  //           .orderBy('status_datestamp', 'desc')
  //           .limit(1)
  //           .get();

  //         const statusData = statusSnapshot.docs.map(subDoc => {
  //           const status = subDoc.data();
  //           const status_datestamp = status.status_datestamp.toDate();
  //           return {
  //             id: subDoc.id,
  //             ...status,
  //             status_datestamp: status_datestamp.toLocaleString()
  //           };
  //         });

  //         const coordinates = stationData.station_codinates;

  //         if (!coordinates || typeof coordinates.latitude === 'undefined' || typeof coordinates.longitude === 'undefined') {
  //           console.error(`Invalid or missing coordinates for document ${doc.id}`);
  //           return null;
  //         }

  //         return {
  //           id: doc.id,
  //           station_name: stationData.station_name,
  //           latitude: coordinates.latitude,
  //           longitude: coordinates.longitude,
  //           status: statusData.length > 0 ? statusData[0] : null
  //         };
  //       });

  //       const stationsWithDetails = await Promise.all(stationListPromises);
  //       const validStations = stationsWithDetails.filter(station => station !== null);

  //       setZonestatus10(validStations);
  //       // console.log(zonestatus1)

  //     } catch (error) {
  //       console.error('Error fetching stations and status: ', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchStationsAndStatus();
  // }, []);

  const getColorBasedOnStatusPm = (statusPm) => {


    if (statusPm < 10) return `rgba(2, 174, 238, 0.4)`;
    if (statusPm >= 10 && statusPm < 15) return `rgba(50, 182, 72, 0.5)`;
    if (statusPm >= 15 && statusPm < 20) return `rgba(253, 252, 1, 0.5)`;
    if (statusPm >= 20 && statusPm < 25) return `rgba(2243, 113, 53, 0.5)`;
    return `rgba(236, 29, 37,0.5)`;
  };








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





          {stationmaker.map((station) => (
            <Marker
              key={station.id}
              coordinate={{ latitude: station.latitude, longitude: station.longitude }}
              title={station.station_name}
              description={`Status PM: ${station.status ? station.status.status_pm : 'N/A'}`}
              pinColor="red"
              style={{
                width: 10, height: 10 // Adjust scale factor as needed
              }}
            >
            </Marker>
          ))}


          {/* {stations.map((station) => (
            <Polygon
              key={station.id}
              coordinates={station.coordinates} // ใช้พิกัดที่ได้จาก Firestore
              strokeColor="#000" // สีขอบของ Polygon
              fillColor={
                station.status ?
                  (station.status.status_pm < 10 ? 'rgba(2, 174, 238, 0.5)' : // ฟ้า (PM < 10)
                    station.status.status_pm >= 10 && station.status.status_pm < 15 ? 'rgba(50, 182, 72, 0.5)' : // เขียว (10 <= PM < 15)
                      station.status.status_pm >= 15 && station.status.status_pm < 20 ? 'rgba(253, 252, 1, 0.5)' : // เหลือง (15 <= PM < 20)
                        station.status.status_pm >= 20 && station.status.status_pm < 25 ? 'rgba(243, 113, 53, 0.5)' : // ส้ม (20 <= PM < 25)
                          'rgba(236, 29, 37, 0.5)') // แดง (PM >= 25)
                  : 'gray' // หากไม่มีข้อมูล PM ให้แสดงสีเทาon.status.status_pm > 10 ? '#02AEEE' : 'gray')

              } // สีเติมภายใน Polygon
              strokeWidth={0.001} // ความหนาของขอบ
            />
          ))} */}

          <Polygon
            coordinates={isoplethPolygonCoordinates}
            strokeColor="#000" // Polygon border color
            fillColor="rgba(2, 174, 238, 1)" // Polygon fill color
            strokeWidth={0.01} // Polygon border width
          />

          {/* {stations.map(station => (
            <Polygon
              key={station.id}
              coordinates={isoplethPolygonCoordinates2}
              strokeColor="#000" // Polygon border color
              fillColor={polygonColor} // Polygon fill color
              strokeWidth={0.01} // Polygon border width
            />
          ))} */}



          {/* {zonestatus1.map(station => {
            const { status } = station;
            if (status) {
              const color = getColorBasedOnStatusPm(status.status_pm);


              return (
                <Polygon
                  key={station.id}
                  coordinates={isoplethPolygonCoordinates1}
                  strokeColor={color}
                  fillColor={color}
                  strokeWidth={0.2}
                />
              );
            }
            return null;
          })}

          {zonestatus2.map(station => {
            const { status } = station;
            if (status) {
              const color = getColorBasedOnStatusPm(status.status_pm);
              return (
                <Polygon
                  key={station.id}
                  coordinates={isoplethPolygonCoordinates2}
                  strokeColor={color}
                  fillColor={color}
                  strokeWidth={2}
                />
              );
            }
            return null;
          })}

          {zonestatus3.map(station => {
            const { status } = station;
            if (status) {
              const color = getColorBasedOnStatusPm(status.status_pm);
              return (
                <Polygon
                  key={station.id}
                  coordinates={isoplethPolygonCoordinates3}
                  strokeColor={color}
                  fillColor={color}
                  strokeWidth={2}
                />
              );
            }
            return null;
          })}


          {zonestatus4.map(station => {
            const { status } = station;
            if (status) {
              const color = getColorBasedOnStatusPm(status.status_pm);
              return (
                <Polygon
                  key={station.id}
                  coordinates={isoplethPolygonCoordinates4}
                  strokeColor={color}
                  fillColor={color}
                  strokeWidth={2}
                />
              );
            }
            return null;
          })}

          {zonestatus5.map(station => {
            const { status } = station;
            if (status) {
              const color = getColorBasedOnStatusPm(status.status_pm);
              return (
                <Polygon
                  key={station.id}
                  coordinates={isoplethPolygonCoordinates5}
                  strokeColor={color}
                  fillColor={color}
                  strokeWidth={2}
                />
              );
            }
            return null;
          })}

          {zonestatus6.map(station => {
            const { status } = station;
            if (status) {
              const color = getColorBasedOnStatusPm(status.status_pm);
              return (
                <Polygon
                  key={station.id}
                  coordinates={isoplethPolygonCoordinates6}
                  strokeColor={color}
                  fillColor={color}
                  strokeWidth={2}
                />
              );
            }
            return null;
          })}

          {zonestatus7.map(station => {
            const { status } = station;
            if (status) {
              const color = getColorBasedOnStatusPm(status.status_pm);
              return (
                <Polygon
                  key={station.id}
                  coordinates={isoplethPolygonCoordinates7}
                  strokeColor={color}
                  fillColor={color}
                  strokeWidth={2}
                />
              );
            }
            return null;
          })}

          {zonestatus8.map(station => {
            const { status } = station;
            if (status) {
              const color = getColorBasedOnStatusPm(status.status_pm);
              return (
                <Polygon
                  key={station.id}
                  coordinates={isoplethPolygonCoordinates8}
                  strokeColor={color}
                  fillColor={color}
                  strokeWidth={2}
                />
              );
            }
            return null;
          })}

          {zonestatus9.map(station => {
            const { status } = station;
            if (status) {
              const color = getColorBasedOnStatusPm(status.status_pm);
              return (
                <Polygon
                  key={station.id}
                  coordinates={isoplethPolygonCoordinates9}
                  strokeColor={color}
                  fillColor={color}
                  strokeWidth={2}
                />
              );
            }
            return null;
          })}

          {zonestatus10.map(station => {
            const { status } = station;
            if (status) {
              const color = getColorBasedOnStatusPm(status.status_pm);
              return (
                <Polygon
                  key={station.id}
                  coordinates={isoplethPolygonCoordinates10}
                  strokeColor={color}
                  fillColor={color}
                  strokeWidth={2}
                />
              );
            }
            return null;
          })} */}









        </MapView>

      </View>
    </SafeAreaView >
  )
}

export default Mapiso


