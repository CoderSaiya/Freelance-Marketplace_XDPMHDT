import * as signalR from '@microsoft/signalr';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const connection = new signalR.HubConnectionBuilder()
  .withUrl(`${BASE_URL}/chatHub`, {
    accessTokenFactory: async () => {
      return localStorage.getItem('access_token') || '';
    }
  })
  .configureLogging(signalR.LogLevel.Information)
  .build();

export const startSignalRConnection = async (onReceiveMessage: (user: string, message: string) => void) => {
  connection.on('ReceiveMessage', onReceiveMessage);

  try {
    await connection.start();
    console.log('SignalR connected');
  } catch (err) {
    console.error('SignalR connection failed: ', err);
  }
};

export const sendSignalRMessage = (user: string, message: string) => {
  connection.invoke('SendMessage', user, message).catch((err) => console.error(err.toString()));
};

export const onReceiveMessage = (callback: (message: string) => void) => {
  connection.on('ReceiveMessage', callback);
};
