export const stationDemo =[
    {
        "date": "23/7/2024",
        "time": "21:00:28",
        "PM2.5": [1,2,3],
        "PM1": 3,
        "PM10": 1
    },
    {
        "date": "23/7/2024",
        "time": "21:00:44",
        "PM2.5": 3,
        "PM1": 3,
        "PM10": 1
    },
    {
        "date": "23/7/2024",
        "time": "21:00:44",
        "PM2.5": 3,
        "PM1": 3,
        "PM10": 1
    },
  
 ]

//  <ScrollView contentContainerStyle={{ alignItems: 'center', paddingVertical: 5 }}>


//  {stations.length > 0 ? (
//    stations.map((item) => (
//      <TouchableOpacity key={item.id}
//        style={{
//          height: 150,
//          width: '100%',
//          marginTop: 10,
//          flexDirection: 'row',
//          borderRadius: 20
//        }}
//        onPress={() => navigation.navigate('Details', { stations: item })}


//      >

//        {/* NameSpace */}
//        <View style={{ backgroundColor: colors.blueheavy, borderTopLeftRadius: 20, borderBottomLeftRadius: 20, width: '35%', height: '100%', justifyContent: 'center', alignItems: 'center', borderRightColor: '#fff', borderRightWidth: 5, }}>
//          <Text style={{ color: colors.white, alignSelf: 'center', fontWeight: 'bold', fontSize: 20, }} >
//            {item.station_name || 'Unknown'}
//          </Text>
//        </View>

//        {item.status && (
//          <View style={{ height: '100%', width: '65%', backgroundColor: colors.bluemeduim, flexDirection: 'row', justifyContent: 'space-around', borderTopRightRadius: 20, borderBottomRightRadius: 20, padding: 5 }}>
//            {/* Date */}
//            <View style={{ height: 70, width: 70, alignSelf: 'center', borderRightColor: '#fff', borderRightWidth: 5 }}>
//              <Feather
//                name={"calendar"}
//                size={40}
//                color={colors.white}
//                style={{ alignSelf: 'center', right: 5 }}
//              />
//              <Text style={{ color: colors.white, alignSelf: 'center', marginTop: 2, fontWeight: 'bold', fontSize: 16, width: 70, right: 3 }}>
//                {item.status.status_datestamp || 'not found'}
//              </Text>
//            </View>

//            {/* Time */}
//            <View style={{ height: 70, width: 70, alignSelf: 'center', left: 2, borderRightColor: '#fff', borderRightWidth: 5 }}>
//              <Feather
//                name={"clock"}
//                size={40}
//                color={colors.white}
//                style={{ alignSelf: 'center', right: 5 }}
//              />
//              <Text style={{ color: colors.white, alignSelf: 'center', marginTop: 2, fontWeight: 'bold', fontSize: 16, width: 70, right: 3 }}>
//                {item.status.status_time || 'not found'}
//              </Text>
//            </View>

//            {/* PM2.5 */}
//            <View style={{ height: 70, width: 40, alignSelf: 'center', left: 4 }}>
//              <Feather
//                name={"cloud"}
//                size={40}
//                color={colors.white}
//                style={{ alignSelf: 'center' }}
//              />
//              <Text style={{ color: colors.white, alignSelf: 'center', marginTop: 2, fontWeight: 'bold', fontSize: 16, width: 20 }}>
//                {item.status.status_pm || 'not found'}
//              </Text>
//            </View>
//          </View>
//        )}

//      </TouchableOpacity>
//    ))
//  ) : (
//    <Text>No station status available</Text>
//  )}
// </ScrollView>