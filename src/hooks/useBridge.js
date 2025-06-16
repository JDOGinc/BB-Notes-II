import { useEffect, useRef } from 'react';

export function useBridge() {
  const listeners = useRef({});

  // Recibir mensajes desde la app
  useEffect(() => {
    const handler = (event) => {
      let data = event.data;

      try {

        if (typeof data === 'string') {
          data = JSON.parse(data);
        }

        const { type, payload } = data;
        if (type && listeners.current[type]) {
          listeners.current[type].forEach((cb) => cb(payload));
        }
      } catch (e) {
        console.warn('Mensaje inválido recibido:', e);
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Enviar mensaje a la app
  const sendMessage = (data) => {
    if (window.ReactNativeWebView?.postMessage) {
      window.ReactNativeWebView.postMessage(JSON.stringify(data));
    } else {
      console.warn('No se encontró ReactNativeWebView');
    }
  };

  // Suscribirse a un tipo específico de mensaje
  const onMessage = (type, callback) => {
    if (!listeners.current[type]) {
      listeners.current[type] = [];
    }
    listeners.current[type].push(callback);
  };

  return { sendMessage, onMessage };
}
