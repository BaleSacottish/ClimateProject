/**
 * @format
 */

import {AppRegistry} from 'react-native';

import Navigation from './src/screens/navigation';

import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

const App = () => {
    return(
        <Navigation/>
    )
}