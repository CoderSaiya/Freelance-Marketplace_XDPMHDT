import * as signalR from '@microsoft/signalr';

const BASE_URL = import.meta.env.BASE_URL;

const connection = new signalR.HubConnectionBuilder()
  .withUrl(`${BASE_URL}/chatHub`)
  .configureLogging(signalR.LogLevel.Information)
  .build();

export const startConnection = async () => {
  try {
    await connection.start();
    console.log('Connected to SignalR!');
  } catch (error) {
    console.error('Connection failed: ', error);
    setTimeout(startConnection, 5000);
  }
};

export const sendMessage = async (message: string) => {
  await connection.invoke('SendMessage', message);
};

export const onReceiveMessage = (callback: (message: string) => void) => {
  connection.on('ReceiveMessage', callback);
};
