import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation  from 'react-native-geolocation-service';
import { GeolocationResponse } from 'react-native-geolocation-service';


// Interface untuk data device
interface DeviceInfo {
    appId: string;
    platform: string;
    osVersion: string | number;
    deviceName: string;
    location?: any;
}

// Interface untuk lokasi
interface Location {
    latitude: number;
    longitude: number;
}

class MyAuthSdkWrapper {
    private validAppId: string = "test";
    private appId: string;

    constructor(appId: string) {
        if (this.validAppId !== appId) {
            throw new Error('App ID is required or not valid');
        }
        this.appId = appId;
    }

    async getDeviceInfo(): Promise<DeviceInfo> {
        try {
            // Ambil semua informasi device dalam satu proses
            const [deviceName, location] = await Promise.all([
                this.getDeviceName(),
                this.getLocation()
            ]);

            const deviceInfo: DeviceInfo = {
                appId: this.appId,
                platform: Platform.OS,
                osVersion: Platform.Version,
                deviceName,
                location
            };

            if(!location?.latitude || !location?.longitude){
                throw new Error('Failed to get location')
            }

            return deviceInfo;
        } catch (error: any) {
            throw new Error('Failed to get device info: ' + error.message);
        }
    }

    private async getDeviceName(): Promise<string> {
        try {
            const { getModel } = await import('react-native-device-info');
            return getModel();
        } catch {
            return 'Unknown Device';
        }
    }

    private async getLocation(): Promise<Location | undefined> {
        const hasPermission = await this.requestLocationPermission();
        if (!hasPermission) return;

        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                (position: GeolocationResponse) => {
                    const { latitude, longitude } = position.coords;
                    resolve({ latitude, longitude });
                },
                (error: { message: string }) => {
                    reject(new Error('Failed to get location: ' + error.message));
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
            );
        });
    }
    
    private async requestLocationPermission() {
        if (Platform.OS === "android") {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: "Location Permission",
                message: "This app needs access to your location.",
                buttonPositive: "OK",
              }
            );
      
            return granted === PermissionsAndroid.RESULTS.GRANTED;
          } catch (err) {
            console.warn("Error requesting location permission:", err);
            return false;
          }
        }
        return true;
      }

    async saveToLocalStorage(data: DeviceInfo): Promise<void> {
        try {
            await AsyncStorage.setItem('deviceInfo', JSON.stringify(data));
        } catch (error: any) {
            throw new Error('Failed to save to storage: ' + error.message);
        }
    }

    async getStoredDeviceInfo(): Promise<DeviceInfo | null> {
        try {
            const data = await AsyncStorage.getItem('deviceInfo');
            return data ? JSON.parse(data) as DeviceInfo : null;
        } catch (error: any) {
            throw new Error('Failed to retrieve data: ' + error.message);
        }
    }
}

export default MyAuthSdkWrapper;
