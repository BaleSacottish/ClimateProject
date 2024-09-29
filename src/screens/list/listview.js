import { View, SafeAreaView, StyleSheet, Text, Animated, Image, TextInput, ScrollView, TouchableOpacity, } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'

// import firestore from '@react-native-firebase/firestore'

import Feather from 'react-native-vector-icons/Feather'

import colors from '../../contanst/colors'
import globalStyles from '../../contanst/globalStyle'


import { demoData } from '../db/demo'

import { firebase, firestore } from '../db/config'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';





const Listview = ({ navigation }) => {


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const usersCollection = await firestore().collection('station').get();
  //       const usersList = usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //       setStation(usersList);
  //     } catch (error) {
  //       console.error("Error fetching users: ", error);
  //     }
  //   };

  //   fetchData();
  // }, []);


  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filteredStations, setFilteredStations] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');

  const currentDate = new Date();

  useEffect(() => {
    const fetchStationsAndStatus = async () => {
      try {
        // Fetch data from 'station_realair' collection
        const stationCollection = await firestore().collection('station_realair').get();

        const stationListPromises = stationCollection.docs.map(async (doc) => {
          const stationData = doc.data();

          // Query to fetch the latest status from the 'status' subcollection
          const statusSnapshot = await firestore()
            .collection('station_realair')
            .doc(doc.id)
            .collection('status')
            .orderBy('status_datestamp', 'desc') // Order by the latest status
            .limit(1) // Limit to 1 document
            .get();

          const statusData = statusSnapshot.docs.map(subDoc => {
            const status = subDoc.data();

            // Convert status_datestamp from Firestore Timestamp to Date
            const status_datestamp = status.status_datestamp.toDate();

            return {
              id: subDoc.id,
              ...status,
              status_datestamp: status_datestamp.toLocaleString() // Convert Date to string
            };
          });

          return {
            id: doc.id,
            station_name: stationData.station_name,
            station_codinates: stationData.station_codinates || {}, // Fetch station_codinates (default to empty object if not present)
            status: statusData.length > 0 ? statusData[0] : null // If there is status, use statusData[0]
          };
        });

        const stationsWithDetails = await Promise.all(stationListPromises);

        setStations(stationsWithDetails);
        setFilteredStations(stationsWithDetails);

      } catch (error) {
        console.error('Error fetching stations and status: ', error);
      } finally {
        setLoading(false); // Hide loading indicator when data is loaded
      }
    };

    fetchStationsAndStatus(); // Call the function when component mounts
  }, []);



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
  //           status: subcollectionData.length > 0 ? subcollectionData[0] : null
  //         };
  //       });


  //       const stationsWithDetails = await Promise.all(stationListPromises);
  //       // const statusWithDetails = await Promise.all(statusListPromises);



  //       setStations(stationsWithDetails);
  //       setFilteredStations(stationsWithDetails)
  //       // console.log('check SubClass', stationsWithDetails);
  //       // const allStatus = stationsWithDetails.flatMap(station => station.status);
  //       // setStatusIs(allStatus);

  //     } catch (error) {
  //       console.error('Error fetching stations and subcollections: ', error);
  //     }
  //   };

  //   fetchData();
  // }, []);


  const filterStationsByOrder = () => {
    const sortedStations = [...stations].sort((a, b) => a.id.localeCompare(b.id)); // Sort or filter based on your criteria
    setStations(sortedStations);
  };

  const sortStationsByPM = () => {
    const sorted = [...stations].sort((a, b) => {
      const pmA = a.status?.status_pm || 0;
      const pmB = b.status?.status_pm || 0;
      return pmB - pmA; // Sort in descending order
    });
    setStations(sorted);
  };

  // const handleSearch = (text) => {
  //   setSearchQuery(text);
  //   const filtered = stations.filter(station => {
  //     const stationName = station.station_name?.toLowerCase() || '';
  //     const statusDate = station.status?.status_date || '';

  //     return (
  //       stationName.includes(text.toLowerCase()) ||
  //       statusDate.includes(text)
  //     );
  //   });
  //   setStations(filtered);
  // };
  const handleSearch = (text) => {
    setSearchQuery(text);

    const filtered = stations.filter(station => {
      const stationName = station.station_name?.toLowerCase() || '';
      const statusDate = station.status?.status_date || '';

      // Convert both the search text and station name/status date to lowercase for case-insensitive comparison
      return (
        stationName.includes(text.toLowerCase()) ||
        statusDate.includes(text)
      );
    });

    setStations(filtered);
  };

  const fetchStationsAndStatus = async () => {
    try {
      const stationsSnapshot = await getDocs(collection(firestore, 'station_realair'));
      const stationsData = [];

      // Iterate over all documents in the station_realair collection
      for (const stationDoc of stationsSnapshot.docs) {
        const stationData = stationDoc.data();

        // Query to fetch the latest status document with the most recent status_datestamp
        const statusQuery = query(
          collection(stationDoc.ref, 'status'),
          orderBy('status_datestamp', 'desc'), // Order by status_datestamp in descending order
          limit(1) // Limit to 1 document
        );

        const statusSnapshot = await getDocs(statusQuery);
        const statusData = statusSnapshot.docs.map((statusDoc) => ({
          ...statusDoc.data(), // Spread the status data
        }));

        // If there is a latest status document, add it to the stationsData array
        if (statusData.length > 0) {
          stationsData.push({
            id: stationDoc.id,
            station_name: stationData.station_name,
            status: statusData[0], // Include only the latest status document
          });
        }
      }

      setStations(stationsData); // Set the fetched station data
    } catch (error) {
      console.error('Error fetching stations and status:', error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };





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
        {/* Header (Search and filter) */}
        <View style={{ height: 80, width: '100%', flexDirection: "row", marginTop: 20, padding: 20, justifyContent: 'flex-start' }}>

          {/* SearBar */}
          <View style={{ height: 50, width: '100%', backgroundColor: colors.white, borderRadius: 20, padding: 10, flexDirection: 'row', justifyContent: 'flex-start', }}>

            <Feather
              name={"search"}
              size={22}
              color={colors.bluemeduim}
              style={{ alignSelf: 'center' }}
            />
            <TextInput style={{ flex: 1, hei1sght: 40, bottom: 4 }}
              value={searchQuery}
              onChangeText={handleSearch}
            />

          </View>

          {/* <TouchableOpacity style={{ height: 50, width: 60, backgroundColor: colors.white, borderRadius: 20, marginLeft: 3, justifyContent: 'center' }}
            onPress={() => setIsFilterVisible(!isFilterVisible)}
          >

            <Feather
              name={"filter"}
              size={22}
              color={colors.bluemeduim}
              style={{ alignSelf: 'center' }}
            />
          </TouchableOpacity> */}

        </View>


        {/* modal filter  */}

        {isFilterVisible && (< View style={{ height: 80, width: '87%', flexDirection: "row", bottom: 5, padding: 20, right: 5, borderRadius: 20, backgroundColor: '#fff', alignSelf: 'center', justifyContent: 'flex-start', alignItems: 'center' }}>

          <TouchableOpacity style={{ height: 60, width: 60, backgroundColor: colors.bluemeduim, borderRadius: 20, justifyContent: 'center' }}
            onPress={filterStationsByOrder}
          >
            <Text style={{ color: colors.white, alignSelf: 'center' }}>station</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ height: 60, width: 60, backgroundColor: colors.bluemeduim, borderRadius: 20, left: 10, justifyContent: 'center' }}
            onPress={sortStationsByPM}
          >
            <Text style={{ color: colors.white, alignSelf: 'center' }}>PM</Text>
          </TouchableOpacity>

        </View>)}

        {/* select itemlist */}
        <View style={{ padding: 20 }}>

          <ScrollView contentContainerStyle={{ alignItems: 'center', }}>


            {stations.length > 0 ? (
              stations.sort((a, b) => {
                // ใช้ Regular Expression เพื่อดึงตัวเลขออกจาก station_name ที่เป็นภาษาไทย
                const extractNumber = (name) => {
                  const match = name.match(/\d+/); // ดึงเฉพาะตัวเลขออกมา
                  return match ? parseInt(match[0], 10) : 0; // แปลงตัวเลขเป็น int หรือคืนค่า 0 ถ้าไม่มีตัวเลข
                };

                const stationA = extractNumber(a.station_name);
                const stationB = extractNumber(b.station_name);

                return stationA - stationB; // เรียงลำดับจากน้อยไปมาก
              })
                .slice(0, 10)
                .map((item) => (
                  <TouchableOpacity key={item.id}
                    style={{
                      height: 150,
                      width: '100%',
                      marginTop: 10,
                      flexDirection: 'row',
                      borderRadius: 20
                    }}
                    onPress={() => navigation.navigate('Details', { stations: item })}
                  >

                    {/* NameSpace */}
                    <View style={{ backgroundColor: colors.blueheavy, borderTopLeftRadius: 20, borderBottomLeftRadius: 20, width: '35%', height: '100%', justifyContent: 'center', alignItems: 'center', borderRightColor: '#fff', borderRightWidth: 5, }}>
                      <Text style={{ color: colors.white, alignSelf: 'center', fontWeight: 'bold', fontSize: 16, }} >
                        {item.station_name || 'Unknown'}
                      </Text>
                    </View>

                    {item.status && (
                      <View style={{ height: '100%', width: '65%', backgroundColor: colors.bluemeduim, flexDirection: 'row', justifyContent: 'space-evenly', borderTopRightRadius: 20, borderBottomRightRadius: 20, padding: 5 }}>
                        {/* Date */}
                        <View style={{ height: 70, width: 110, alignSelf: 'center', justifyContent: 'flex-start' }}>
                          <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
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

                          <Text style={{ color: colors.white, marginTop: 2, fontWeight: 'bold', fontSize: 12, width: 150, alignSelf: 'center', left: 15 }}>
                            {currentDate.toLocaleDateString()} {currentDate.toLocaleTimeString()} 
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
                          <Text style={{ color: colors.white, alignSelf: 'center', marginTop: 2, fontWeight: 'bold', fontSize: 12, width: 20 }}>
                            {item.status.status_pm || 'not found'}
                          </Text>
                        </View>
                      </View>
                    )}

                  </TouchableOpacity>
                ))
            ) : (
              <Text>No station status available</Text>
            )}

          </ScrollView>



        </View>

      </View>
    </SafeAreaView>
  )
}

export default Listview


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  stationContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  stationName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  statusText: {
    fontSize: 16,
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
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },

});
