import { View, SafeAreaView, StyleSheet, Text, forwardRef, Platform,Animated,  ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'

import MapView, { PROVIDER_GOOGLE, Marker, Heatmap, Polygon, Polyline, Circle } from 'react-native-maps';


import globalStyles from '../../contanst/globalStyle'
import colors from '../../contanst/colors'

import { demoData } from '../db/demo';

// import firestore from '@react-native-firebase/firestore';
import { firebase, firestore } from '../db/config'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';





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
  const [zonestatus11, setZonestatus11] = useState([]);



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

  // marker
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
      }
      finally {
            setLoading(false); // Hide loading indicator when data is loaded
          }
    };

    fetchStationsAndStatus(); // เรียกฟังก์ชันเมื่อ component ทำการ mount
  }, []);


  // useEffect(() => {
  //   const fetchStationsAndStatus = async () => {
  //     try {
  //       // ดึงข้อมูลจาก collection 'station_realair'
  //       const stationCollection = await firestore().collection('station_realair').get();

  //       const stationListPromises = stationCollection.docs.map(async (doc) => {
  //         const stationData = doc.data();

  //         // Query เพื่อดึงสถานะล่าสุดจาก subcollection 'status'
  //         const statusSnapshot = await firestore()
  //           .collection('station_realair')
  //           .doc(doc.id)
  //           .collection('status')
  //           .orderBy('status_datestamp', 'desc') // เรียงตามสถานะล่าสุด
  //           .limit(1) // จำกัดให้ดึงเพียง 1 document
  //           .get();

  //         const statusData = statusSnapshot.docs.map(subDoc => {
  //           const status = subDoc.data();

  //           // แปลง status_datestamp ที่เป็น Firestore Timestamp ให้เป็น Date
  //           const status_datestamp = status.status_datestamp.toDate();

  //           return {
  //             id: subDoc.id,
  //             ...status,
  //             status_datestamp: status_datestamp.toLocaleString() // แปลง Date เป็น string
  //           };
  //         });

  //         // ตรวจสอบข้อมูลตำแหน่ง
  //         const cordinates = stationData.station_codinates;

  //         if (!cordinates || typeof cordinates.latitude === 'undefined' || typeof cordinates.longitude === 'undefined') {
  //           console.error(`Invalid or missing coordinates for document ${doc.id}`);
  //           return null;
  //         }

  //         return {
  //           id: doc.id,
  //           station_name: stationData.station_name,
  //           latitude: cordinates.latitude,
  //           longitude: cordinates.longitude,
  //           status: statusData.length > 0 ? statusData[0] : null // ถ้ามีสถานะ ใช้ statusData[0]
  //         };
  //       });

  //       const stationsWithDetails = await Promise.all(stationListPromises);

  //       // Filter out null values
  //       const validStations = stationsWithDetails.filter(station => station !== null);

  //       setStationmarker(validStations);

  //     } catch (error) {
  //       console.error('Error fetching stations and status: ', error);
  //     } finally {
  //       setLoading(false); // ซ่อน loading indicator เมื่อข้อมูลโหลดเสร็จ
  //     }
  //   };

  //   fetchStationsAndStatus(); // เรียกฟังก์ชันเมื่อ component ทำการ mount
  // }, []);

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

  
  
  const fetchStationsAndStatus = async (stationIds, setters) => {
    try {
      // Create an array of promises to fetch data for each station ID
      const fetchPromises = stationIds.map(async ({ id, setter }) => {
        const stationCollection = await firestore().collection('station_realair').get();

        const stationListPromises = stationCollection.docs.map(async (doc) => {
          const stationData = doc.data();

          const statusSnapshot = await firestore()
            .collection('station_realair')
            .doc(id)
            .collection('status')
            .orderBy('status_datestamp', 'desc')
            .limit(1)
            .get();

          const statusData = statusSnapshot.docs.map(subDoc => {
            const status = subDoc.data();
            const status_datestamp = status.status_datestamp.toDate();
            return {
              id: subDoc.id,
              ...status,
              status_datestamp: status_datestamp.toLocaleString()
            };
          });

          const coordinates = stationData.station_codinates;

          if (!coordinates || typeof coordinates.latitude === 'undefined' || typeof coordinates.longitude === 'undefined') {
            console.error(`Invalid or missing coordinates for document ${doc.id}`);
            return null;
          }

          return {
            id: doc.id,
            station_name: stationData.station_name,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            status: statusData.length > 0 ? statusData[0] : null
          };
        });

        const stationsWithDetails = await Promise.all(stationListPromises);
        const validStations = stationsWithDetails.filter(station => station !== null);

        // Update the respective state
        setter(validStations);
      });

      await Promise.all(fetchPromises);
    } catch (error) {
      console.error('Error fetching stations and status: ', error);
    } finally {
      setLoading(false); // Hide loading indicator when data is loaded
    }
  };

  useEffect(() => {
    // Define the list of zone IDs and their respective state setters
    const stationIds = [
      { id: 'XXAmTY4YV5zDLtbCK0Z7', setter: setZonestatus1 },  // Zone 1
      { id: 'klx7b9neRfTaVJBSU82N', setter: setZonestatus2 },  // Zone 2
      { id: 'FZaowBdWAO1LNpK3fG7U', setter: setZonestatus3 },  // Zone 3
      { id: 'VZIJIRdEjjjlCEJCn1fi', setter: setZonestatus4 },  // Zone 4
      { id: 'DnoaGJyS4B7kq3i9gduz', setter: setZonestatus4 },  // Zone 4
      { id: '6SHNRZf1D1n7BcuAR4py', setter: setZonestatus5 },  // Zone 5
      { id: 'L0gJJwgn8egnc5j3Z3QG', setter: setZonestatus6 },  // Zone 6
      { id: 'gWI7GA7nv5zB8tGXNNRn', setter: setZonestatus7 },  // Zone 7
      { id: 'hUcheViR4agNhkx4k8Pa', setter: setZonestatus8 },  // Zone 8
      { id: 'CUxU9GTgcane7rKLTtMT', setter: setZonestatus9 },  // Zone 9
      { id: 'EXb1fYqJtYk9yUZlJFIR', setter: setZonestatus10 }, // Zone 10
      { id: 'fXgV3ELF2nA6l8wGi7If', setter: setZonestatus11 }  // Zone 11
    ];

    fetchStationsAndStatus(stationIds, [
      setZonestatus1, setZonestatus2, setZonestatus3, setZonestatus4, setZonestatus5,
      setZonestatus6, setZonestatus7, setZonestatus8, setZonestatus9, setZonestatus10, setZonestatus11
    ]);
  }, []);

  const getColorBasedOnStatusPm = (statusPm) => {


    if (statusPm < 10) return `rgba(2, 174, 238, 0.01)`;
    if (statusPm >= 10 && statusPm < 15) return `rgba(50, 182, 72, 0.01)`;
    if (statusPm >= 15 && statusPm < 20) return `rgba(253, 252, 1, 0.01)`;
    if (statusPm >= 20 && statusPm < 25) return `rgba(243, 113, 53, 0.01)`;
    return `rgba(236, 29, 37,0.01)`;
  };



  if (loading) {

    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }




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



          {zonestatus1.map(station => {
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
                  strokeWidth={0.2}
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
                  strokeWidth={0.2}
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
                  strokeWidth={0.2}
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
                  strokeWidth={0.2}
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
                  strokeWidth={0.2}
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
                  strokeWidth={0.2}
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
                  strokeWidth={0.2}
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
                  strokeWidth={0.2}
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
                  strokeWidth={0.2}
                />
              );
            }
            return null;
          })}

          {zonestatus11.map(station => {
            const { status } = station;
            if (status) {
              const color = getColorBasedOnStatusPm(status.status_pm);
              return (
                <Polygon
                  key={station.id}
                  coordinates={isoplethPolygonCoordinates11}
                  strokeColor={color}
                  fillColor={color}
                  strokeWidth={0.2}
                />
              );
            }
            return null;
          })}










        </MapView>

      </View>
    </SafeAreaView >
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
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 50,
  },
  webview: {
    flex: 1,
  },
});


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

  { latitude: 14.88179517, longitude: 102.0082976 },
  { latitude: 14.88629436, longitude: 102.0037984 },


];

const isoplethPolygonCoordinates6 = [
  { latitude: 14.8592991946441, longitude: 102.035292751797 },
  { latitude: 14.8637983892883, longitude: 102.026294362509 },
  { latitude: 14.86829758, longitude: 102.0217952 },

  { latitude: 14.86829758, longitude: 102.02624944 },
  { latitude: 14.86829758, longitude: 102.0307936 },
  { latitude: 14.86379839, longitude: 102.0307936 },





];
const isoplethPolygonCoordinates7 = [
  { latitude: 14.86829758, longitude: 102.0307936 },

  { latitude: 14.87279678, longitude: 102.0307936 },//19

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

  { latitude: 14.88179517, longitude: 102.0127968 },

  { latitude: 14.87279678, longitude: 102.0217952 },


];
const isoplethPolygonCoordinates11 = [
  { latitude: 14.88629436, longitude: 102.0127968 },
  { latitude: 14.88179517, longitude: 102.0217952 },

  { latitude: 14.87279678, longitude: 102.0217952 },
  { latitude: 14.87279678, longitude: 102.0127968 },

  { latitude: 14.88179517, longitude: 102.0082976 },
  { latitude: 14.88629436, longitude: 102.0037984 },
];