# rn-lib

**react-native-for-testing** adalah library React Native yang menyediakan fitur autentikasi dan pengambilan informasi perangkat.

## 📦 Instalasi

Pastikan Anda sudah memiliki proyek React Native. Jika belum, buat proyek baru dengan perintah berikut:

```sh
npx react-native init MyProject
cd MyProject
```

Kemudian, install library `react-native-for-testing` dengan perintah berikut:

```sh
npm install react-native-for-testing
```

atau jika menggunakan Yarn:

```sh
yarn add react-native-for-testing
```

## 🚀 Cara Penggunaan

Import dan gunakan `MyAuthSdkWrapper` di dalam proyek Anda:

```tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, BackHandler, Modal, StyleSheet } from 'react-native';
import MyAuthSdkWrapper from 'react-native-for-testing';

const App = () => {
  const [isLocationDenied, setIsLocationDenied] = useState(false);

  useEffect(() => {
    async function fetchDeviceInfo() {
      try {
        let sdk = new MyAuthSdkWrapper("test");
        const res = await sdk.getDeviceInfo();
        console.log("Device Info:", res);
      } catch (error) {
        console.error("Failed to initialize SDK:", error.message);
        if (error.message.includes("Failed to get location")) {
          setIsLocationDenied(true);
        }
      }
    }

    fetchDeviceInfo();
  }, []);

  const closeApp = () => {
    BackHandler.exitApp();
  };

  return (
    <View style={styles.container}>
      <Modal visible={isLocationDenied} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Izin lokasi ditolak. Aplikasi akan ditutup.</Text>
            <Button title="OK" onPress={closeApp} />
          </View>
        </View>
      </Modal>
      <Text>Selamat datang di aplikasi!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' },
  modalText: { fontSize: 16, marginBottom: 20, textAlign: 'center' }
});

export default App;
```

## 📍 Izin Akses Lokasi

Library ini memerlukan akses lokasi untuk berfungsi dengan baik. Pastikan Anda telah mengatur izin di file `AndroidManifest.xml` dan `Info.plist`.

### **Android**
Tambahkan izin berikut ke dalam `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

Untuk Android 10+ (API 29+), tambahkan izin berikut:

```xml
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
```

### **iOS**
Tambahkan izin berikut di `ios/Info.plist`:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Aplikasi ini memerlukan akses lokasi untuk berfungsi dengan baik.</string>
<key>NSLocationAlwaysUsageDescription</key>
<string>Aplikasi ini membutuhkan akses lokasi bahkan saat berjalan di latar belakang.</string>
```

## 🔄 Debugging
Jika Anda mengalami masalah, pastikan:
1. Aplikasi memiliki izin lokasi yang sesuai.
2. Anda sudah mencoba di perangkat fisik, karena emulator mungkin tidak memiliki layanan lokasi.
3. Periksa console log untuk mengetahui kesalahan yang terjadi.

## 📜 Lisensi
Library ini menggunakan lisensi **MIT**.

