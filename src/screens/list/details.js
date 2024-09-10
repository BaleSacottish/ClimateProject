import { View, SafeAreaView, StyleSheet, Text, TouchableOpacity, Animated, Easing, Dimensions, ScrollView } from 'react-native'
import React, { useState, useEffect, useRef, useRoute } from 'react'

import MapView, { PROVIDER_GOOGLE, Marker, Heatmap, } from 'react-native-maps';


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


/**
 * @param {object} props
 * @param {IPage1} props.value
 * @param {(value: string) => void} props.onChanged
 */



const Details = ({ route }) => {

  const { stations } = route.params;

  const [lineData1, setLinedata1] = useState([])
  const [linedata2, setLinedata2] = useState(new Array(30).fill(0));

  const [datalive1, setDataline1] = useState(lineData1)
  const [datalive2, setDataline2] = useState(linedata2)

  const [statusPm, setStatusPm] = useState(null);


  const [pinmark, setPinmark] = useState(demoData)

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // const [stations, setStations] = useState([]);
  const [statusStation, setStatusStation] = useState([]);

  const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
  const labels_month = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);


  console.log(lineData1)

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
    labels: labels,
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

  const markers = pinmark.map(coord => ({
    id: coord.id,
    coordinate: {
      latitude: coord.latitude,
      longitude: coord.longitude
    },
    title: coord.title,
    description: coord.description,
    weight: coord.weight
  }));

  const points = markers.map(marker => ({
    latitude: marker.coordinate.latitude,
    longitude: marker.coordinate.longitude,
    weight: marker.weight || 1, // default weight if not defined
  }));



  //get data details 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const stationCollection = await firestore().collection('satationTesting').get();

        const stationListPromises = stationCollection.docs.map(async (doc) => {
          const subcollectionSnapshot = await firestore()
            .collection('satationTesting')
            .doc(doc.id)
            .collection('status')
            .limit(1)
            .get();

          ;

          const subcollectionData = subcollectionSnapshot.docs.map(subDoc => ({
            id: subDoc.id,
            ...subDoc.data(),
          }));

          // console.log('check:', subcollectionData)

          return {
            id: doc.id,
            ...doc.data(),
            status: subcollectionData,
            status: subcollectionData.length > 0 ? subcollectionData[0] : null
          };
        });



        const stationsWithDetails = await Promise.all(stationListPromises);
        // const statusWithDetails = await Promise.all(statusListPromises);



        setStatusStation(stationsWithDetails);
        // console.log('check SubClass', stationsWithDetails);
        // const allStatus = stationsWithDetails.flatMap(station => station.status);
        // setStatusIs(allStatus);

      } catch (error) {
        console.error('Error fetching stations and subcollections: ', error);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {

  //   const fetchData = async () => {
  //     try {
  //       const stationCollection = await firestore()
  //         .collection('satationTesting')
  //         .get();

  //       let aggregatedData = []; // To store aggregated "status_pm" values
  //       const documentIds = []; // Array to store document IDs

  //       // Collect IDs of documents
  //       stationCollection.docs.forEach(doc => {
  //         documentIds.push(doc.id);
  //       });

  //       // Fetch data from each specific document ID
  //       const stationListPromises = documentIds.map(async (docId) => {
  //         const subcollectionSnapshot = await firestore()
  //           .collection('satationTesting')
  //           .doc(docId)
  //           .collection('status')
  //           .get();

  //         subcollectionSnapshot.docs.forEach((subDoc) => {
  //           const subDocData = subDoc.data();
  //           // Check if "status_pm" exists and is a valid number
  //           if (subDocData.status_pm !== undefined && typeof subDocData.status_pm === 'number') {
  //             aggregatedData.push(subDocData.status_pm); // Only push valid numbers
  //           }
  //         });
  //       });

  //       // Wait for all promises to resolve
  //       await Promise.all(stationListPromises);

  //       if (aggregatedData.length === 0) {
  //         aggregatedData = [0, 0, 0, 0, 0, 0, 0]; // Example fallback data
  //       }

  //       if (aggregatedData.length > 0) {
  //         const fetchedData = {
  //           labels: ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."], // Customize labels if necessary
  //           datasets: [
  //             {
  //               data: aggregatedData, // Use aggregated "status_pm" data
  //               color: (opacity = 1) => `rgba(22, 49, 194, ${opacity})`,
  //               strokeWidth: 2,
  //             }
  //           ],
  //           legend: ["หนึ่งสัปดาห์"],
  //         };

  //         setLinedata1(fetchedData);
  //         // console.log(fetchedData);
  //       }

  //     } catch (error) {
  //       console.error('Error fetching Firestore data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);


  // ฟังก์ชันดึงข้อมูลจาก Firestore

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ensure that "stations" ID is available from route.params
        if (!stations || !stations.id) {
          console.error('No station ID found in route parameters');
          return;
        }

        const stationDocRef = firestore()
          .collection('satationTesting')
          .doc(stations.id); // Use the station ID from route.params

        // Fetch subcollection 'status' within the station document
        const subcollectionSnapshot = await stationDocRef
          .collection('status')
          .get(); // Fetch all subdocuments in 'status' subcollection for this station

        let aggregatedData = []; // To store all "status_pm" values

        subcollectionSnapshot.docs.forEach((subDoc) => {
          const subDocData = subDoc.data();
          // Check if "status_pm" exists and is a valid number
          if (subDocData.status_pm !== undefined && typeof subDocData.status_pm === 'number') {
            aggregatedData.push(subDocData.status_pm); // Push valid numbers
          }
        });

        if (aggregatedData.length === 0) {
          aggregatedData = [0]; // Example fallback data if no valid status_pm values are found
        }

        // Process or store the aggregatedData as needed
        console.log('Aggregated status_pm for station:', aggregatedData);
        setLinedata1(aggregatedData); // Example: store in state for use in charts

      } catch (error) {
        console.error('Error fetching Firestore data:', error);
      }
    };

    fetchData();
  }, [stations]);




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
            <View style={{ height: '100%', width: '65%', backgroundColor: colors.bluemeduim, flexDirection: 'row', justifyContent: 'space-around', borderTopRightRadius: 20, borderBottomRightRadius: 20, padding: 5 }}>
              {/* Date */}
              <View style={{ height: 70, width: 70, alignSelf: 'center', borderRightColor: '#fff', borderRightWidth: 5 }}>
                <Feather
                  name={"calendar"}
                  size={40}
                  color={colors.white}
                  style={{ alignSelf: 'center', right: 5 }}
                />
                <Text style={{ color: colors.white, alignSelf: 'center', marginTop: 2, fontWeight: 'bold', fontSize: 16, width: 70, right: 3 }}>
                  {stations.status.status_date || 'not found'}
                </Text>
              </View>

              {/* Time */}
              <View style={{ height: 70, width: 70, alignSelf: 'center', left: 2, borderRightColor: '#fff', borderRightWidth: 5 }}>
                <Feather
                  name={"clock"}
                  size={40}
                  color={colors.white}
                  style={{ alignSelf: 'center', right: 5 }}
                />
                <Text style={{ color: colors.white, alignSelf: 'center', marginTop: 2, fontWeight: 'bold', fontSize: 16, width: 70, right: 3 }}>
                  {stations.status.status_time || 'not found'}
                </Text>
              </View>

              {/* PM2.5 */}
              <View style={{ height: 70, width: 40, alignSelf: 'center', left: 4 }}>
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
      </View>


    );
  }

  const ModalpopupData = ({ navigation, navigate, props }) => {
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


  return (
    <SafeAreaView style={{ flex: 1 }}>

      <View style={{
        ...globalStyles.welcome_padding2
      }}>

        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: 14.881474,
            longitude: 102.015555,
            latitudeDelta: 0.05,
            longitudeDelta: 0.04,
          }}
        >

          {markers.map(marker => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
            >

            </Marker>
          ))}

          <Heatmap

            points={points}
            radius={50} // Adjust radius to control the spread of the heatmap
            opacity={0.6} // Adjust opacity for visibility
            gradient={{
              colors: ['#00ff00', '#ffff00', '#ff0000'],
              startPoints: [0.1, 0.5, 1.0,],
              colorMapSize: 256,
            }}
          >

          </Heatmap>


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