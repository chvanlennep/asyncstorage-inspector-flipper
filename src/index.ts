import { DevSettings } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addPlugin } from "react-native-flipper";

let currentConnection: any = null;

if (__DEV__ && (!AsyncStorage || !addPlugin)) {
  throw new Error(
    "Please make sure AsyncStorage and react-native-flipper are installed before using asyncstorage-inspector-flipper",
  );
}

export const initAsyncStorageInspector = () => {
  if (!__DEV__) {
    return;
  }
  if (currentConnection === null) {
    addPlugin({
      getId: () => "asyncstorage-inspector-flipper",
      onConnect(connection: any) {
        currentConnection = connection;
        try {
          connection.send("init", {
            middlewareActive: true,
          });
          connection.receive("clearStorage", async () => {
            try {
              const persistedStorageKeys: string[] = await AsyncStorage.getAllKeys();
              await AsyncStorage.multiRemove(persistedStorageKeys);
              DevSettings.reload();
            } catch (error) {
              console.warn(error);
            }
          });
          connection.receive("contentRequest", async () => {
            try {
              const persistedStorageKeys: string[] = await AsyncStorage.getAllKeys();
              const content = await AsyncStorage.multiGet(persistedStorageKeys);
              connection.send("content", { content });
            } catch (error) {
              console.warn(error);
            }
          });
        } catch (error) {
          console.warn(error);
        }
      },
      onDisconnect() {},
      runInBackground: () => false,
    });
  }
};
