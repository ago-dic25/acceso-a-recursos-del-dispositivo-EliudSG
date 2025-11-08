import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef(null); // Referencia para controlar la cámara

  useEffect(() => {
    (async () => {
      // 1. Solicita el permiso de la cámara al iniciar
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Función para tomar la foto
  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri); // Guarda la URI de la foto
    }
  };

  // --- Lógica de Renderizado de la Interfaz ---

  // Muestra un mensaje si los permisos aún están cargando
  if (hasPermission === null) {
    return <View style={styles.container}><Text>Cargando permisos...</Text></View>;
  }
  
  // Muestra un mensaje si los permisos fueron denegados
  if (hasPermission === false) {
    return <View style={styles.container}><Text>Acceso a la cámara denegado.</Text></View>;
  }

  // Si ya se tomó una foto, la mostramos
  if (capturedImage) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: capturedImage }} style={styles.previewImage} />
        <TouchableOpacity 
          style={styles.retakeButton} 
          onPress={() => setCapturedImage(null)} // Reinicia para tomar otra foto
        >
          <Text style={styles.text}>Tomar otra foto</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Si tenemos permisos y no hay foto capturada, mostramos la cámara
  return (
    <View style={styles.container}>
      {/* El componente Camera debe tener 'ref' para poder usar takePictureAsync */}
      <Camera 
        style={styles.camera} 
        type={type} 
        ref={cameraRef} 
        // Deshabilita el autoenfoque en web, si da problemas (solo si es necesario)
        // isWeb={Platform.OS === 'web' ? true : false} 
      >
        <View style={styles.buttonContainer}>
          
          {/* BOTÓN 1: Voltear la Cámara */}
          <TouchableOpacity
            style={styles.flipButton}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={styles.text}> Voltear </Text>
          </TouchableOpacity>

          {/* BOTÓN 2: Tomar Foto (EL QUE BUSCAS) */}
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}>
            <View style={styles.captureCircle} />
          </TouchableOpacity>

        </View>
      </Camera>
    </View>
  );
}

// --- Estilos para la Visibilidad y Posición del Botón ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'space-between', // Distribuye los botones
    alignItems: 'flex-end', // Mueve los botones a la parte inferior
  },
  flipButton: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  captureButton: {
    flex: 0.3,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  captureCircle: {
    // Estilo que simula el botón redondo de captura
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: 'gray',
  },
  text: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  // Estilos para la vista previa de la imagen
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  previewImage: {
    width: '100%',
    height: '85%',
    resizeMode: 'contain',
  },
  retakeButton: {
    padding: 15,
    backgroundColor: 'red',
    borderRadius: 8,
    marginTop: 20,
  }
});