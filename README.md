# BB Notes II

Este proyecto es un editor de texto web hecho con React, Vite y Draft.js. Permite edición enriquecida (negrita, itálica, subrayado, títulos, subtítulos y párrafos) y está pensado para usarse tanto en web como en WebView para React Native.

## Instalación

```sh
npm install
npm run dev
```

## Características

- Editor de texto de pantalla completa
- Toolbar superior con estilos: Negrita, Itálica, Subrayado
- Cambia entre Título, Subtítulo y Párrafo
- Listo para usarse en WebView de React Native

## Estructura principal

- `src/App.jsx`: Componente principal del editor

## Licencia

MIT

## Uso en WebView de React Native

Puedes integrar este editor en una app React Native usando el componente `WebView` de la librería `react-native-webview`.

### 1. Instala la dependencia en tu proyecto React Native

```sh
npm install react-native-webview
```

### 2. Sirve tu editor en la red local

Ejecuta el editor en modo desarrollo o producción y asegúrate de que tu dispositivo móvil pueda acceder a la IP de tu computadora:

```sh
npm run dev
# o para producción
npm run build && npm run preview
```

### 3. Obtén la IP local de tu computadora

Por ejemplo: `http://192.168.1.100:5173`

### 4. Usa WebView en tu app React Native

```jsx
import React from 'react';
import { WebView } from 'react-native-webview';

export default function EditorScreen() {
  return (
    <WebView
      source={{ uri: 'http://192.168.1.100:5173' }}
      style={{ flex: 1 }}
      originWhitelist={["*"]}
      javaScriptEnabled={true}
      domStorageEnabled={true}
    />
  );
}
```

### 5. Comunicación entre WebView y React Native (opcional)

Para enviar datos entre el editor y tu app, puedes usar `window.ReactNativeWebView.postMessage` en el editor y `onMessage` en el WebView:

**En el editor (web):**

```js
window.ReactNativeWebView && window.ReactNativeWebView.postMessage('mensaje desde el editor')
```

**En React Native:**

```jsx
<WebView
  ...
  onMessage={event => {
    const data = event.nativeEvent.data;
    // Maneja el mensaje recibido
  }}
/>
```

> Asegúrate de que ambos dispositivos estén en la misma red WiFi para desarrollo.
