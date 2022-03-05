//@ts-ignore
import {DevSettings} from 'react-native';
import {addPlugin} from 'react-native-flipper';

let currentConnection: any = null;

//@ts-ignore
if (__DEV__ && !addPlugin) {
  throw new Error(
    'Please make sure react-native-flipper is installed before using asyncstorage-inspector-flipper',
  );
}

export const initAsyncStorageInspector = (AsyncStorage: any) => {
  //@ts-ignore
  if (!__DEV__ || currentConnection) {
    return;
  }
  if (!AsyncStorage?.getAllKeys) {
    throw new Error('No instance on AsyncStorage found');
  }

  addPlugin({
    getId() {
      return 'asyncstorage-inspector-flipper';
    },
    onConnect(connection) {
      currentConnection = connection;
      try {
        AsyncStorage.getAllKeys()
          .then((persistedStorageKeys: string[]) => {
            AsyncStorage.multiGet(persistedStorageKeys)
              .then((content: [string, string | null][]) => {
                connection.send('content', {content});
              })
              .catch(console.warn);
          })
          .catch(console.warn);
        connection.receive('contentRequest', async () => {
          try {
            const persistedStorageKeys: string[] = await AsyncStorage.getAllKeys();
            const content = await AsyncStorage.multiGet(persistedStorageKeys);
            connection.send('content', {content});
          } catch (error) {
            console.warn(error);
          }
        });
        connection.receive('clearStorage', async () => {
          try {
            const persistedStorageKeys: string[] = await AsyncStorage.getAllKeys();
            await AsyncStorage.multiRemove(persistedStorageKeys);
            DevSettings.reload();
          } catch (error) {
            console.warn(error);
          }
        });
      } catch (error) {
        console.warn(error);
      }
    },
    onDisconnect() {},
    runInBackground() {
      return true;
    },
  });
};
