import { View, SafeAreaView, StyleSheet, Text, TouchableOpacity, Animated, Easing, Dimensions, ScrollView,  ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useRef, useRoute } from 'react'

import MapView, { PROVIDER_GOOGLE, Marker, Heatmap, Polygon, Polyline, Circle } from 'react-native-maps';


import {
  LineChart,
} from "react-native-chart-kit";

import monthlineSerive from '../db/linechartService2';
import datelineSerive from '../db/linechartService';
import chartConfig from '../../contanst/chartConfig'

import globalStyles from '../../contanst/globalStyle'
import colors from '../../contanst/colors'

import { demoData } from '../db/demo'

import Feather from 'react-native-vector-icons/Feather'

const { width, height } = Dimensions.get('screen');


import { firebase, firestore } from '../db/config'
import { addDays, format } from 'date-fns'; // ใช้ date-fns เพื่อจัดการวันที่



/**
 * @param {object} props
 * @param {IPage1} props.value
 * @param {(value: string) => void} props.onChanged
 */






 const getMapRegion = (stations) => {
  if (stations.length === 0) return null;

  const latitudes = stations.map(station => station.latitude);
  const longitudes = stations.map(station => station.longitude);

  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);
  const minLongitude = Math.min(...longitudes);
  const maxLongitude = Math.max(...longitudes);

  // Calculate the center of the bounding box
  const latitude = (minLatitude + maxLatitude) / 2;
  const longitude = (minLongitude + maxLongitude) / 2;

  // Calculate the delta (size) of the bounding box
  const latitudeDelta = maxLatitude - minLatitude + 0.05; // Added padding
  const longitudeDelta = maxLongitude - minLongitude + 0.04; // Added padding



  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
};

const Details = ({ route }) => {

  const { stations } = route.params;


  const [lineData1, setLinedata1] = useState([])
  const [linedata2, setLinedata2] = useState(new Array(30).fill(0));

  const [statusPoly, setStatusPoly] = useState([])
  const [stationmaker, setStationmarker] = useState([])

  const [region, setRegion] = useState(null);


  const [loading, setLoading] = useState(true);



  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
  const labels_month = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);

  const [label_dy, setLabels] = useState([]);

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: lineData1, // Your data for 7 days
        strokeWidth: 2, // optional
      },
    ],
  };

  const chartData2 = {
    labels: label_dy,
    datasets: [
      {
        data: lineData1, // Your data for 30 days
        strokeWidth: 2, // Optional
      },
    ],
  };



  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
    Animated.timing(slideAnim, {
      toValue: isFilterVisible ? 0 : 1, // slide up if visible, down if hidden
      duration: 300, // animation duration
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false, // Native driver for non-layout properties
    }).start();
  };

  const slideInterpolation = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '80%'] // Change these percentages based on your layout requirements
  });


  useEffect(() => {
    const newRegion = getMapRegion(stationmaker);
    setRegion(newRegion);
  }, [stationmaker]);

  //get data details 
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const stationCollection = await firestore().collection('station_realair').get();

  //       const stationListPromises = stationCollection.docs.map(async (doc) => {
  //         const subcollectionSnapshot = await firestore()
  //           .collection('station_realair')
  //           .doc(doc.id)
  //           .collection('status')
  //           .limit(1)
  //           .get();

  //         ;

  //         const subcollectionData = subcollectionSnapshot.docs.map(subDoc => ({
  //           id: subDoc.id,
  //           ...subDoc.data(),
  //         }));

  //         // console.log('check:', subcollectionData)

  //         return {
  //           id: doc.id,
  //           ...doc.data(),
  //           status: subcollectionData,
  //           status: subcollectionData.length > 0 ? subcollectionData[0] : null
  //         };
  //       });



  //       const stationsWithDetails = await Promise.all(stationListPromises);
  //       // const statusWithDetails = await Promise.all(statusListPromises);



  //       setStatusStation(stationsWithDetails);
  //       // console.log('check SubClass', stationsWithDetails);
  //       // const allStatus = stationsWithDetails.flatMap(station => station.status);
  //       // setStatusIs(allStatus);
  //     } catch (error) {
  //       console.error('Error fetching stations and subcollections: ', error);
  //     }
  //   };

  //   fetchData();
  // }, []);


  //lindata
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Ensure that "stations" ID is available from route.params
  //       if (!stations || !stations.id) {
  //         console.error('No station ID found in route parameters');
  //         return;
  //       }

  //       const stationDocRef = firestore()
  //         .collection('station_realair')
  //         .doc(stations.id); // Use the station ID from route.params

  //       // Fetch subcollection 'status' within the station document
  //       const subcollectionSnapshot = await stationDocRef
  //         .collection('status')
  //         .get(); // Fetch all subdocuments in 'status' subcollection for this station

  //       let aggregatedData = []; // To store all "status_pm" values

  //       subcollectionSnapshot.docs.forEach((subDoc) => {
  //         const subDocData = subDoc.data();
  //         // Check if "status_pm" exists and is a valid number
  //         if (subDocData.status_pm !== undefined && typeof subDocData.status_pm === 'number') {
  //           aggregatedData.push(subDocData.status_pm); // Push valid numbers
  //         }
  //       });

  //       if (aggregatedData.length === 0) {
  //         aggregatedData = [0]; // Example fallback data if no valid status_pm values are found
  //       }

  //       // Process or store the aggregatedData as needed
  //       // console.log('Aggregated status_pm for station:', aggregatedData);
  //       setLinedata1(aggregatedData); // Example: store in state for use in charts

  //     } catch (error) {
  //       console.error('Error fetching Firestore data:', error);
  //     }
  //   };

  //   fetchData();
  // }, [stations]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (!stations || !stations.id) {
  //         console.error('No station ID found in route parameters');
  //         return;
  //       }

  //       const stationDocRef = firestore()
  //         .collection('station_realair')
  //         .doc(stations.id);

  //       const currentDate = new Date();
  //       const sevenDaysAgo = addDays(currentDate, -7);

  //       const subcollectionSnapshot = await stationDocRef
  //         .collection('status')
  //         .where('status_datestamp', '>=', sevenDaysAgo)
  //         .orderBy('status_datestamp', 'desc')
  //         .get();

  //       let aggregatedData = [];

  //       subcollectionSnapshot.docs.forEach((subDoc) => {
  //         const subDocData = subDoc.data();
  //         if (subDocData.status_pm !== undefined && typeof subDocData.status_pm === 'number') {
  //           aggregatedData.push({
  //             date: subDocData.status_datestamp.toDate(),
  //             pmValue: subDocData.status_pm,
  //           });
  //         }
  //       });

  //       if (aggregatedData.length === 0) {
  //         aggregatedData = [{ date: currentDate, pmValue: 0 }];
  //       }

  //       // Ensure that these variables are defined
  //       const formattedLabels = aggregatedData.map(item => item.date.toLocaleDateString());
  //       const formattedData = aggregatedData.map(item => item.pmValue);

  //       // Set state with formatted data
  //       setLabels(formattedLabels);
  //       setLinedata1(formattedData);

  //     } catch (error) {
  //       console.error('Error fetching Firestore data:', error);
  //     }
  //   };

  //   fetchData();
  // }, [stations]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!stations || !stations.id) {
          console.error('No station ID found in route parameters');
          return;
        }

        const stationDocRef = firestore()
          .collection('station_realair')
          .doc(stations.id);

        const currentDate = new Date();
        const sevenDaysAgo = addDays(currentDate, -7);

        const subcollectionSnapshot = await stationDocRef
          .collection('status')
          .where('status_datestamp', '>=', sevenDaysAgo)
          .orderBy('status_datestamp', 'desc')
          .get();

        let aggregatedData = [];

        subcollectionSnapshot.docs.forEach((subDoc) => {
          const subDocData = subDoc.data();
          if (subDocData.status_pm !== undefined && typeof subDocData.status_pm === 'number') {
            aggregatedData.push({
              date: subDocData.status_datestamp.toDate(),
              pmValue: subDocData.status_pm,
            });
          }
        });

        if (aggregatedData.length === 0) {
          aggregatedData = [{ date: currentDate, pmValue: 0 }];
        }

        // Format the date to show only day and month
        const formattedLabels = aggregatedData.map(item =>
          item.date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
        );
        const formattedData = aggregatedData.map(item => item.pmValue);

        setLabels(formattedLabels);
        setLinedata1(formattedData);

      } catch (error) {
        console.error('Error fetching Firestore data:', error);
      }
    };

    fetchData();
  }, [stations]);

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

  //       setStatusPoly(validStations);

  //     } catch (error) {
  //       console.error('Error fetching stations and status: ', error);
  //     } finally {
  //       setLoading(false); // Hide loading indicator when data is loaded
  //     }
  //   };

  //   fetchStationsAndStatus(); // Call function on component mount
  // }, [stations]);

  useEffect(() => {
    const fetchStationAndStatus = async () => {
      try {
        // Ensure that "stations" ID is available from route.params
        if (!stations || !stations.id) {
          console.error('No station ID found in route parameters');
          return;
        }

        // Fetch the specific station document by ID from 'station_realair' collection
        const stationDocRef = firestore().collection('station_realair').doc(stations.id);
        const stationDocSnapshot = await stationDocRef.get();

        if (!stationDocSnapshot.exists) {
          console.error(`No station found with ID: ${stations.id}`);
          return;
        }

        const stationData = stationDocSnapshot.data();

        // Fetch the latest status from the 'status' subcollection for this specific station
        const statusSnapshot = await stationDocRef
          .collection('status')
          .orderBy('status_datestamp', 'desc') // Order by latest status
          .limit(1) // Limit to 1 document
          .get();

        const statusData = statusSnapshot.docs.map(subDoc => {
          const status = subDoc.data();

          // Convert Firestore Timestamp to Date
          const status_datestamp = status.status_datestamp.toDate();

          return {
            id: subDoc.id,
            ...status,
            status_datestamp: status_datestamp.toLocaleString() // Convert Date to string
          };
        });

        // Verify that the station has valid coordinates
        const coordinates = stationData.station_codinates;

        if (!coordinates || typeof coordinates.latitude === 'undefined' || typeof coordinates.longitude === 'undefined') {
          console.error(`Invalid or missing coordinates for station ${stations.id}`);
          return;
        }

        // Generate polygon coordinates around the central point (the station's coordinates)
        const radiusInMeters = 400; // Define the radius for the polygon
        const polygonCoordinates = generatePolygonCoordinates(coordinates, radiusInMeters);

        // Ensure polygon coordinates are valid
        if (!polygonCoordinates || polygonCoordinates.length === 0) {
          console.error(`No valid polygon coordinates for station ${stations.id}`);
          return;
        }

        // Construct the station data
        const stationDetails = {
          id: stationDocSnapshot.id,
          station_name: stationData.station_name,
          coordinates: polygonCoordinates,
          status: statusData.length > 0 ? statusData[0] : null // Use latest status
        };

        // Store the data in the state
        setStatusPoly([stationDetails]); // Set as an array with one station

      } catch (error) {
        console.error('Error fetching station and status: ', error);
      } finally {
        setLoading(false); // Hide loading indicator when data is loaded
      }
    };

    fetchStationAndStatus(); // Call function on component mount
  }, [stations]);

  useEffect(() => {
    const fetchStationAndStatus = async () => {
      try {
        // Ensure that "stations" ID is available from route.params
        if (!stations || !stations.id) {
          console.error('No station ID found in route parameters');
          return;
        }

        // Fetch the specific station document by ID from 'station_realair' collection
        const stationDocRef = firestore().collection('station_realair').doc(stations.id);
        const stationDocSnapshot = await stationDocRef.get();

        if (!stationDocSnapshot.exists) {
          console.error(`No station found with ID: ${stations.id}`);
          return;
        }

        const stationData = stationDocSnapshot.data();

        // Query to get the latest status from 'status' subcollection
        const statusSnapshot = await stationDocRef
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

        // Check if coordinates exist and are valid
        if (!coordinates || typeof coordinates.latitude !== 'number' || typeof coordinates.longitude !== 'number') {
          console.error(`Invalid or missing coordinates for station ${stations.id}`);
          return;
        }

        // Create the station details
        const stationDetails = {
          id: stationDocSnapshot.id,
          station_name: stationData.station_name,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          status: statusData.length > 0 ? statusData[0] : null
        };

        setStationmarker([stationDetails]); // Set the marker for this station only

      } catch (error) {
        console.error('Error fetching station and status: ', error);
      } finally {
        setLoading(false); // Hide loading indicator when data is loaded
      }
    };

    fetchStationAndStatus();
  }, [stations]);

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




  const Modalpopup = ({ navigation, navigate, props }) => {
    return (
      <View style={{ padding: 5, flex: 1 }}>
        <View style={{ width: '100%', height: 80, flexDirection: 'row', }}>

          <View style={{ width: '35%', height: '100%', alignItems: 'center', }}>
            <Text key={stations.id} style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold', color: colors.white, width: 100 }}>
              {stations.station_name || 'Unknown'}
            </Text>
          </View>



          {/* 
          {stations.status && stations.status.length > 0 && (
            stations.status.map((status, index) => (
              <View key={index} style={{ width: '60%', height: '100%', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>

                <View style={{ height: 70, width: 70, alignSelf: 'center', borderRightColor: '#fff', borderRightWidth: 5, }}>
                  <Feather
                    name={"calendar"}
                    size={40}
                    color={colors.white}
                    style={{ alignSelf: 'center', right: 5 }}
                  />

                  <Text style={{ color: colors.white, alignSelf: 'center', marginTop: 2, fontWeight: 'bold', fontSize: 16, width: 70, right: 5 }}>
                    {status.status_date || 'Unknown'}
                  </Text>
                </View>

                <View style={{ height: 70, width: 70, alignSelf: 'center', left: 2, borderRightColor: '#fff', borderRightWidth: 5, }}>
                  <Feather
                    name={"clock"}
                    size={40}
                    color={colors.white}
                    style={{ alignSelf: 'center', right: 5 }}
                  />
                  <Text style={{ color: colors.white, alignSelf: 'center', marginTop: 2, fontWeight: 'bold', fontSize: 16, right: 5 }}>
                    {status.status_time || 'Unknown'}
                  </Text>
                </View>

                <View style={{ height: 70, width: 40, alignSelf: 'center', left: 4, }}>
                  <Feather
                    name={"cloud"}
                    size={40}
                    color={colors.white}
                    style={{ alignSelf: 'center' }}
                  />
                  <Text style={{ color: colors.white, alignSelf: 'center', marginTop: 2, fontWeight: 'bold', fontSize: 16 }}>
                    {status.status_pm || 'Unknown'}
                  </Text>

                </View>

              </View>
            ))
          )} */}



          {stations.status && (

            <View style={{ height: '100%', width: '65%', backgroundColor: colors.bluemeduim, flexDirection: 'row', justifyContent: 'space-evenly', borderTopRightRadius: 20, borderBottomRightRadius: 20, padding: 5 }}>
              {/* Date */}
              <View style={{ height: 70, width: 110, alignSelf: 'center', justifyContent: 'flex-start' }}>
                <View style={{ flexDirection: "row", justifyContent: 'space-between', }}>
                  <Feather
                    name={"calendar"}
                    size={40}
                    color={colors.white}
                    style={{ alignSelf: 'center', }}
                  />
                  <Feather
                    name={"clock"}
                    size={40}
                    color={colors.white}
                    style={{ alignSelf: 'center', }}
                  />
                </View>

                <Text style={{ color: colors.white, marginTop: 2, fontWeight: 'bold', fontSize: 16, width: 180, alignSelf: 'center', left: 5 }}>
                  {stations.status.status_datestamp}
                </Text>
              </View>

              {/* PM2.5 */}
              <View style={{ height: 70, width: 40, alignSelf: 'center', }}>
                <Feather
                  name={"cloud"}
                  size={40}
                  color={colors.white}
                  style={{ alignSelf: 'center' }}
                />
                <Text style={{ color: colors.white, alignSelf: 'center', marginTop: 2, fontWeight: 'bold', fontSize: 16, width: 20 }}>
                  {stations.status.status_pm || 'not found'}
                </Text>
              </View>
            </View>

          )}


        </View>
      </View >


    );
  }

  const ModalpopupData = ({ data }) => {
    return (

      <View style={{ width: '100%', height: 80, top: 100 }}>

        <LineChart
          style={{ alignSelf: 'center', borderRadius: 20 }}
          data={chartData}
          width={width * 90 / 100}
          height={180}
          borderRadius={20}
          chartConfig={chartConfig}

        />

        <LineChart
          style={{ alignSelf: 'center', borderRadius: 20, marginTop: 10 }}
          data={chartData2}
          width={width * 90 / 100}
          height={180}
          chartConfig={chartConfig}
          line
        />

      </View>

    );
  }

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
          region={region}
        >


          {stationmaker.map((station, index) => (
            // Ensure that coordinates are valid before rendering the marker
            station.latitude && station.longitude ? (
              <Marker
                key={index}
                coordinate={{
                  latitude: station.latitude,
                  longitude: station.longitude
                }}
                title={station.station_name}
                description={`PM Status: ${station.status?.status_pm}`}
              />
            ) : null // Do not render the marker if coordinates are invalid
          ))}

          {statusPoly.map((station) => (
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
          ))}





        </MapView>




        {/* Modal Down */}
        {isFilterVisible && (
          <Animated.View style={{
            position: 'absolute',
            bottom: slideInterpolation,
            height: '80%',
            width: '100%',
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: colors.bluemeduim,
            alignSelf: 'center',
            alignItems: 'center'
          }}>
            <TouchableOpacity onPress={toggleFilter}>
              <Feather
                name={"chevrons-down"}
                size={30}
                color={colors.white}
                style={{ alignSelf: 'center' }}
              />
            </TouchableOpacity>



            <View style={{ padding: 5, width: '100%', flexDirection: 'column' }}>

              <Modalpopup />
              <ModalpopupData />

            </View>

          </Animated.View>
        )}

        {/* Modal Up */}
        {!isFilterVisible && (
          <Animated.View style={{
            backgroundColor: colors.bluemeduim,
            width: '100%',
            height: '20%',
            position: 'absolute',
            bottom: slideInterpolation,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
            <TouchableOpacity onPress={toggleFilter}>
              <Feather
                name={"chevrons-up"}
                size={30}
                color={colors.white}
                style={{ alignSelf: 'center' }}
              />
            </TouchableOpacity>
            <View style={{ padding: 10, flexDirection: 'row', width: '100%' }}>
              <Modalpopup />

            </View>
          </Animated.View>
        )}

      </View>

    </SafeAreaView>
  )
}

export default Details


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