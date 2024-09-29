import {
  View,
  SafeAreaView,
  StyleSheet,
  Animated,
  Image,
  Button,
  Linking,
  Alert,
  Modal,
  TouchableOpacity,
  Easing,
  Text
} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'

import MapView, { PROVIDER_GOOGLE, Marker, Polygon, } from 'react-native-maps';
import WebView from 'react-native-webview';

import AsyncStorage from '@react-native-async-storage/async-storage';

import globalStyles from '../../contanst/globalStyle'
import colors from '../../contanst/colors'

import Feather from 'react-native-vector-icons/Feather'

// import firestore from '@react-native-firebase/firestore';
import { firebase, firestore } from '../db/config'
// import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';



// ฟังก์ชันสุ่มค่า status_pm
const getRandomStatusPm = () => {
  const min = 0;  // ค่าต่ำสุดของ PM 2.5
  const max = 50; // ค่าสูงสุดของ PM 2.5
  return (Math.random() * (max - min) + min).toFixed(2); // ส่งคืนเป็นทศนิยม 2 ตำแหน่ง
};






const Mapiso = ({ navigation, latitude, longitude }) => {


  const [loading, setLoading] = useState(true);


  const [zonestatus1, setZonestatus1] = useState([]);
  const [zonestatus2, setZonestatus2] = useState([]);



  const [modalVisible, setModalVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
    Animated.timing(slideAnim, {
      toValue: isFilterVisible ? 0 : 1, // slide up if visible, down if hidden
      duration: 300, // animation duration
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false, // Native driver for non-layout properties
    }).start();
  };

  const openMap = () => {
    setModalVisible(true);
  };

  const closeMap = () => {
    setModalVisible(false);
  };

  const fetchStationsAndStatus = async (stationIds, setters) => {
    try {

      // Create an array of promises to fetch data for each station ID
      const fetchPromises = stationIds.map(async ({ id, setter }) => {
        // Fetch only 10 stations
        const stationCollection = await firestore()
          .collection('station_realair')
          .limit(10) // Limit to 10 stations
          .get();

        // console.log('Fetched stationCollection:', stationCollection.docs.length);

        const stationListPromises = stationCollection.docs.map(async (doc) => {
          const stationData = doc.data();
          // console.log(`Station data for ${doc.id}:`, stationData);

          const statusSnapshot = await firestore()
            .collection('station_realair')
            .doc(id)  // Make sure 'id' exists in station_realair collection
            .collection('status')
            .orderBy('status_datestamp', 'desc')
            .limit(1)
            .get();

          const statusData = statusSnapshot.docs.map(subDoc => {
            const status = subDoc.data();
            const status_datestamp = status.status_datestamp.toDate();
            // console.log(`Status data for ${doc.id}:`, status);

            return {
              id: subDoc.id,
              ...status,
              status_datestamp: status_datestamp.toLocaleString()
            };
          });

          const coordinates = stationData.station_codinates;

          if (!coordinates || typeof coordinates.latitude === 'undefined' || typeof coordinates.longitude === 'undefined') {
            // console.warn(`Invalid or missing coordinates for document ${doc.id}`);
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

        console.log('Valid stations:', validStations);
        setter(validStations);
      });

      await Promise.all(fetchPromises);
      // console.log('All stations fetched successfully.');
    } catch (error) {
      console.error('Error fetching stations and status: ', error);
    } finally {
      setLoading(false);
    }
  };

  const getColorBasedOnStatusPm = (statusPm) => {

    if (statusPm < 15) return `rgba(2, 174, 238, 0.02)`;
    if (statusPm >= 15 && statusPm < 25) return `rgba(50, 182, 72, 0.03)`;
    if (statusPm >= 25 && statusPm < 38) return `rgba(253, 252, 1, 0.03)`;
    if (statusPm >= 38 && statusPm < 70) return `rgba(243, 113, 53, 0.03)`;
    return `rgba(236, 29, 37,0.03)`;
  };

  const getColorBased = (statusPm) => {

    if (statusPm < 10) return `rgba(2, 174, 238, 0.1)`;
    if (statusPm >= 10 && statusPm < 15) return `rgba(50, 182, 72, 0.1)`;
    if (statusPm >= 15 && statusPm < 20) return `rgba(253, 252, 1, 0.1)`;
    if (statusPm >= 20 && statusPm < 25) return `rgba(243, 113, 53, 0.1)`;
    return `rgba(236, 29, 37,0.1)`;
  };

  const polygons = [
    isoplethPolygonCoordinates3,
    isoplethPolygonCoordinates4,
    isoplethPolygonCoordinates5,
    isoplethPolygonCoordinates6,
    isoplethPolygonCoordinates7,
    isoplethPolygonCoordinates8,
    isoplethPolygonCoordinates9,
    isoplethPolygonCoordinates10,
    isoplethPolygonCoordinates11]; // 



  useEffect(() => {
    // Define the list of zone IDs and their respective state setters
    const stationIds = [
      { id: 'XXAmTY4YV5zDLtbCK0Z7', setter: setZonestatus1 },  // Zone 1
      { id: 'klx7b9neRfTaVJBSU82N', setter: setZonestatus2 },  // Zone 2
    ];

    fetchStationsAndStatus(stationIds, [
      setZonestatus1, setZonestatus2,
    ]);
  }, []);






  const initialRegion = {
    latitude: 14.881474,
    longitude: 102.015555,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  };



  const ModalIsoMapurl = ({ }) => {
    return (
      <View style={styles.containerbutton}>
        <Button title="Show Map" onPress={openMap} style={styles.button} />

        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={closeMap}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <Button title="Close" onPress={closeMap} />
            <WebView
              source={{ uri: 'https://streamlit-app-ke5w.onrender.com' }}
              style={styles.webview}
            />
          </View>
        </Modal>
      </View>
    );
  }




  //Loading
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (loading) {
      // Define the animation sequence
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Stop the animation when not loading
      Animated.timing(scaleAnim).stop();
    }
  }, [loading, scaleAnim]);


  if (loading) {

    return (
      <SafeAreaView style={styles.containerloading}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Image
            source={require('../../assest/images/Logo.png')}
            style={styles.image}
          />
        </Animated.View>
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


          {/* Render markers or other components using stations data */}


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


          {polygons.map((coordinates, index) => {
            const randomStatusPm = getRandomStatusPm(); // สุ่มค่า status_pm สำหรับแต่ละ polygon
            const fillColor = getColorBased(randomStatusPm); // หาสีตามค่า status_pm

            return (
              <Polygon
                key={index}
                coordinates={coordinates} // พิกัดที่ใช้วาด polygon
                fillColor={fillColor} // สีของ polygon
                strokeColor={fillColor} // สีเส้นขอบ
                strokeWidth={1} // ความกว้างเส้นขอบ
              />
            );
          })}

        </MapView>

        <View style={{ width: '90%', height: 80, backgroundColor: '#fff', borderRadius: 20, alignSelf: 'center', justifyContent: 'center', marginTop: 40 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center',marginTop:10 }}>
            <View style={{ backgroundColor: colors.blue_volumn, width: '17%', height: 10 }}></View>
            <View style={{ backgroundColor: colors.green_volumn, width: '19%', height: 10 }}></View>
            <View style={{ backgroundColor: colors.yellow_volumn, width: '20%', height: 10 }}></View>
            <View style={{ backgroundColor: colors.orange_volumn, width: '19%', height: 10 }}></View>
            <View style={{ backgroundColor: colors.red_volnum, width: '17%', height: 10 }}></View>
          </View>
          <View style={{ flexDirection: 'row',justifyContent:'space-around',marginTop:5 }}>
            <Text style={{fontSize:10, left:15 }} >0-15</Text>
            <Text style={{fontSize:10,left:20}}>15-25</Text>
            <Text style={{fontSize:10,left:20}}>25-37</Text>
            <Text style={{fontSize:10,left:20}}>37-75</Text>
            <Text style={{fontSize:10,left:5}}>More than 75</Text>
          </View>
          <View style={{ flexDirection: 'row',justifyContent:'space-around',marginTop:5 }}>
            <Text style={{fontSize:10, left:10,}} >VeryGood</Text>
            <Text style={{fontSize:10,}}>Good</Text>
            <Text style={{fontSize:10,right:5}}>Medium</Text>
            <Text style={{fontSize:10,right:10}}>Risky</Text>
            <Text style={{fontSize:10, right:10}}>Danger</Text>
          </View>

        </View>


        <ModalIsoMapurl />
       
        


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
    alignItems: 'flex-end'
  },
  containerbutton: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    bottom: 15, // ระยะห่างจากด้านล่าง
    right: 10,  // ระยะห่างจากด้านขวา
  },
  button: {
    position: 'absolute',
    bottom: 40, // ระยะห่างจากด้านล่าง
    right: 10,  // ระยะห่างจากด้านขวา
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    width: '90%', // ความกว้างของ modal
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
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
    width: '100%', // ใช้ความกว้างเต็มที่
    height: '100%',

  },
  containerloading: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedView: {
    justifyContent: 'center',
    alignItems: 'center',
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