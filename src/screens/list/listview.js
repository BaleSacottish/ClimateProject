import {
  View,
  Text,
  SafeAreaView,
  Image,
  FlatList,
  Pressable,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from 'react-native'
import React, { useState, useEffect } from 'react'
// import firestore from '@react-native-firebase/firestore'

import Feather from 'react-native-vector-icons/Feather'

import colors from '../../contanst/colors'
import globalStyles from '../../contanst/globalStyle'


import { demoData } from '../db/demo'

import { firebase, firestore } from '../db/config'







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
  const [statusIs, setStatusIs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);



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
            status: subcollectionData.length > 0 ? subcollectionData[0] : null
          };
        });


        const stationsWithDetails = await Promise.all(stationListPromises);
        // const statusWithDetails = await Promise.all(statusListPromises);



        setStations(stationsWithDetails);
        // console.log('check SubClass', stationsWithDetails);
        // const allStatus = stationsWithDetails.flatMap(station => station.status);
        // setStatusIs(allStatus);

      } catch (error) {
        console.error('Error fetching stations and subcollections: ', error);
      }
    };

    fetchData();
  }, []);

 

 










  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{
        ...globalStyles.welcome_padding2
      }}>
        {/* Header (Search and filter) */}
        <View style={{ height: 80, width: '100%', flexDirection: "row", marginTop: 20, padding: 20, justifyContent: 'flex-start' }}>

          {/* SearBar */}
          <View style={{ height: 50, width: '80%', backgroundColor: colors.white, borderRadius: 20, padding: 10, flexDirection: 'row', justifyContent: 'flex-start', }}>

            <Feather
              name={"search"}
              size={22}
              color={colors.bluemeduim}
              style={{ alignSelf: 'center' }}
            />
            <TextInput style={{ flex: 1, height: 40, bottom: 4 }} />

          </View>

          <TouchableOpacity style={{ height: 50, width: 60, backgroundColor: colors.white, borderRadius: 20, marginLeft: 3, justifyContent: 'center' }}
            onPress={() => setIsFilterVisible(!isFilterVisible)}
          >

            <Feather
              name={"filter"}
              size={22}
              color={colors.bluemeduim}
              style={{ alignSelf: 'center' }}
            />
          </TouchableOpacity>

        </View>


        {/* modal filter  */}
        {isFilterVisible && (< View style={{ height: 80, width: '87%', flexDirection: "row", bottom: 5, padding: 20, right: 5, borderRadius: 20, backgroundColor: '#fff', alignSelf: 'center', justifyContent: 'flex-start', alignItems: 'center' }}>

          <TouchableOpacity style={{ height: 60, width: 60, backgroundColor: colors.bluemeduim, borderRadius: 20, justifyContent: 'center' }}

          >
            <Text style={{ color: colors.white, alignSelf: 'center' }}>station</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ height: 60, width: 60, backgroundColor: colors.bluemeduim, borderRadius: 20, left: 10, justifyContent: 'center' }}

          >
            <Text style={{ color: colors.white, alignSelf: 'center' }}>PM</Text>
          </TouchableOpacity>

        </View>
        )}

        {/* select itemlist */}
        <View style={{ padding: 10 }}>
          <ScrollView contentContainerStyle={{ alignItems: 'center', paddingVertical: 5 }}>
            {/* 
            {stationStatus.map((item, index) => (
              <TouchableOpacity key={item.id}
                style={{
                  height: 150,
                  width: '100%',
                  marginTop: 10,
                  flexDirection: 'row',
                  borderRadius: 20
                }}
                onPress={() => navigation.navigate('Details')}

              >
                <View style={{ backgroundColor: colors.blueheavy, borderTopLeftRadius: 20, borderBottomLeftRadius: 20, width: '35%', height: '100%', justifyContent: 'center', alignItems: 'center', borderRightColor: '#fff', borderRightWidth: 5, }}>
                  <Text style={{ color: colors.white, alignSelf: 'center', fontWeight: 'bold', fontSize: 20, }}>{item.station_name}</Text>
                </View>

                <View style={{ height: '100%', width: '65%', backgroundColor: colors.bluemeduim, flexDirection: 'row', justifyContent: 'space-around', borderTopRightRadius: 20, borderBottomRightRadius: 20, padding: 20 }}>

                  <View style={{ height: 70, width: 70, alignSelf: 'center', borderRightColor: '#fff', borderRightWidth: 5, }}>
                    <Feather
                      name={"calendar"}
                      size={40}
                      color={colors.white}
                      style={{ alignSelf: 'center' }}
                    />
                    <Text style={{ color: colors.white, alignSelf: 'center', marginTop: 2, fontWeight: 'bold', fontSize: 16, width: 40 }}>{item.Time}</Text>
                  </View>

                  <View style={{ height: 70, width: 70, alignSelf: 'center', left: 2, borderRightColor: '#fff', borderRightWidth: 5, }}>
                    <Feather
                      name={"clock"}
                      size={40}
                      color={colors.white}
                      style={{ alignSelf: 'center' }}
                    />
                    <Text style={{ color: colors.white, alignSelf: 'center', marginTop: 2, fontWeight: 'bold', fontSize: 16, }}>{item.time}</Text>
                  </View>

                  <View style={{ height: 70, width: 70, alignSelf: 'center', left: 4, }}>
                    <Feather
                      name={"cloud"}
                      size={40}
                      color={colors.white}
                      style={{ alignSelf: 'center' }}
                    />
                    <Text style={{ color: colors.white, alignSelf: 'center', marginTop: 2, fontWeight: 'bold', fontSize: 16 }}>{item.Pm25}</Text>

                  </View>

                </View>




              </TouchableOpacity>


            ))}   */}


            {stations.length > 0 ? (
              stations.map((item) => (
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
                    <Text style={{ color: colors.white, alignSelf: 'center', fontWeight: 'bold', fontSize: 20, }} >
                      {item.station_name || 'Unknown'}
                    </Text>
                  </View>

                  {item.status && (
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
                          {item.status.status_date || 'not found'}
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
                          {item.status.status_time || 'not found'}
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