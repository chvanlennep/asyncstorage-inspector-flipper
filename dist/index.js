"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAsyncStorageInspector = void 0;
const react_native_1 = require("react-native");
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const react_native_flipper_1 = require("react-native-flipper");
let currentConnection = null;
if (__DEV__ && (!async_storage_1.default || !react_native_flipper_1.addPlugin)) {
    throw new Error("Please make sure AsyncStorage and react-native-flipper are installed before using asyncstorage-inspector-flipper");
}
const initAsyncStorageInspector = () => {
    if (!__DEV__) {
        return;
    }
    if (currentConnection === null) {
        (0, react_native_flipper_1.addPlugin)({
            getId: () => "asyncstorage-inspector-flipper",
            onConnect(connection) {
                currentConnection = connection;
                try {
                    connection.send("init", {
                        middlewareActive: true,
                    });
                    connection.receive("clearStorage", async () => {
                        try {
                            const persistedStorageKeys = await async_storage_1.default.getAllKeys();
                            await async_storage_1.default.multiRemove(persistedStorageKeys);
                            react_native_1.DevSettings.reload();
                        }
                        catch (error) {
                            console.warn(error);
                        }
                    });
                    connection.receive("contentRequest", async () => {
                        try {
                            const persistedStorageKeys = await async_storage_1.default.getAllKeys();
                            const content = await async_storage_1.default.multiGet(persistedStorageKeys);
                            connection.send("content", { content });
                        }
                        catch (error) {
                            console.warn(error);
                        }
                    });
                }
                catch (error) {
                    console.warn(error);
                }
            },
            onDisconnect() { },
            runInBackground: () => false,
        });
    }
};
exports.initAsyncStorageInspector = initAsyncStorageInspector;
