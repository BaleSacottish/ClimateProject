import { View, SafeAreaView,  StyleSheet,Text } from 'react-native'
import React, { useState, useEffect,useRef } from 'react'

import MapView, { PROVIDER_GOOGLE, Marker, Heatmap, } from 'react-native-maps';

import globalStyles from '../../contanst/globalStyle'
import colors from '../../contanst/colors'

const Mapiso = () => {

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
              title={marker.title}
              description={marker.description}

            />
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