import { View, SafeAreaView, StyleSheet, Text, TouchableOpacity, Animated, Easing, Dimensions, ScrollView } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'

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


/**
 * @param {object} props
 * @param {IPage1} props.value
 * @param {(value: string) => void} props.onChanged
 */



const Details = ({ }) => {

  const [pinmark, setPinmark] = useState(demoData)

  const detailsData = demoData[0]

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


 




  const Modalpopup = ({ navigation, navigate, props }) => {
    return (
      <View style={{ padding: 5, flex: 1 }}>
        <View style={{ width: '100%', height: 80, flexDirection: 'row', }}>

          {/*Text Station */}
          <View style={{ width: '35%', height: '100%', alignItems: 'center' }}>
            <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold', color: colors.white,width:110 }}>{detailsData.station}</Text>
          </View>

          <View style={{ width: '60%', height: '100%', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>

            <View style={{ height: 70, width: 70, alignSelf: 'center', borderRightColor: '#fff', borderRightWidth: 5, }}>
              <Feather
                name={"calendar"}
                size={40}
                color={colors.white}
                style={{ alignSelf: 'center' }}
              />
              <Text style={{ color: colors.white, alignSelf: 'center', marginTop: 2, fontWeight: 'bold', fontSize: 16, width: 40 }}>{detailsData.date}</Text>
            </View>

            <View style={{ height: 70, width: 70, alignSelf: 'center', left: 2, borderRightColor: '#fff', borderRightWidth: 5, }}>
              <Feather
                name={"clock"}
                size={40}
                color={colors.white}
                style={{ alignSelf: 'center' }}
              />
              <Text style={{ color: colors.white, alignSelf: 'center', marginTop: 2, fontWeight: 'bold', fontSize: 16, }}>{detailsData.time}</Text>
            </View>

            <View style={{ height: 70, width: 70, alignSelf: 'center', left: 4, }}>
              <Feather
                name={"cloud"}
                size={40}
                color={colors.white}
                style={{ alignSelf: 'center' }}
              />
              <Text style={{ color: colors.white, alignSelf: 'center', marginTop: 2, fontWeight: 'bold', fontSize: 16 }}>{detailsData.Pm25}</Text>

            </View>

          </View>



        </View>
      </View>


    );
  }

  const ModalpopupData = ({ navigation, navigate, props }) => {
    return (

      <View style={{ width: '100%', height: 80, top: 100 }}>
        {/* <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
          
            <Feather
              name={"circle"}
              size={30}
              color={colors.white}
              style={{ alignSelf:'center',backgroundColor:colors.green_volumn,borderRadius:35,width:30,height:30 }}
            />
            <Text style={{ color: colors.white, alignSelf: 'center', marginTop: 2, fontWeight: 'bold', fontSize: 16, width: 40,left:10 }}>Good</Text>
          

        </View> */}
        <LineChart
          style={{ alignSelf: 'center',borderRadius:20 }}
          data={datelineSerive}
          width={width * 90 / 100}
          height={180}
          borderRadius={20}
          chartConfig={chartConfig}
          
        />

        <LineChart
          style={{ alignSelf: 'center',borderRadius:20 ,marginTop:10}}
          data={monthlineSerive}
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