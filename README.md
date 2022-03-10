# AsyncStorage Inspector Middleware for Flipper

Middleware for inspecting contents of React Native AsyncStorage in Flipper

## Installation

```bash
yarn add asyncstorage-inspector-flipper react-native-flipper
# for iOS
cd ios && pod install
```

## Configuration:

```javascript
import {initAsyncStorageInspector} from 'asyncstorage-inspector-flipper';

// Call function only once, eg in App.tsx
initAsyncStorageInspector();
```

## Desktop plugin:

Install [flipper-plugin-asyncstorage-inspector](https://github.com/chvanlennep/flipper-plugin-asyncstorage-inspector) in your Flipper desktop client:

```
Manage Plugins > Install Plugins > search "asyncstorage-inspector" > Install
```

4. Restart flipper with your React Native App running and you should be able to see the plugin as 'AsyncStorage Inspector'.

**Note: The plugin does not display live values from AsyncStorage. Press the 'Sync' button in Flipper to see the latest values.**
