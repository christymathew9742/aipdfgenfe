import { io } from 'socket.io-client';
import { baseURL } from './url';

const socket = io(`${baseURL}`); 

export default socket;
