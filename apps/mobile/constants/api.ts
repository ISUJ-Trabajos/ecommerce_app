import Constants from 'expo-constants';

/**
 * IP local para Expo Go:
 * - Para dispositivo físico usar la IP de tu máquina (p.ej. 'http://192.168.x.x:3000')
 * - Para emulador Android usar 'http://10.0.2.2:3000'
 * - Para entorno web usar 'http://localhost:3000'
 */

const LOCAL_IP = '192.168.52.79'; // TODO: El usuario debe actualizar esto con su IP local

export const BASE_URL = __DEV__
  ? `http://${LOCAL_IP}:3000`
  : 'https://api.kumarstore.com';
