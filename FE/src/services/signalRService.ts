import * as signalR from '@microsoft/signalr';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const connections: Record<string, signalR.HubConnection> = {};

export const createHubConnection = (hubName: string, onReceiveMessage: (event: string, ...args: any[]) => void) => {
  if (connections[hubName]) {
    console.warn(`Hub connection for ${hubName} already exists.`);
    return;
  }

  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${BASE_URL}/${hubName}`, {
      accessTokenFactory: async () => localStorage.getItem('access_token') || '',
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

  // Add event listener for receiving messages
  connection.on('ReceiveMessage', (...args) => onReceiveMessage('ReceiveMessage', ...args));

  connection.start()
    .then(() => console.log(`${hubName} Hub connected`))
    .catch((error) => console.error(`Failed to connect to ${hubName} Hub:`, error));

  // Store connection in the map
  connections[hubName] = connection;
};

// Function to send a message through a specific hub
export const sendHubMessage = (hubName: string, methodName: string, ...args: any[]) => {
  const connection = connections[hubName];
  if (!connection) {
    console.error(`No connection found for ${hubName} hub`);
    return;
  }

  connection.invoke(methodName, ...args).catch((err) => console.error(err.toString()));
};

// Function to stop and remove a specific hub connection
export const stopHubConnection = (hubName: string) => {
  const connection = connections[hubName];
  if (connection) {
    connection.stop()
      .then(() => {
        console.log(`${hubName} Hub disconnected`);
        delete connections[hubName];
      })
      .catch((error) => console.error(`Failed to stop ${hubName} Hub connection:`, error));
  }
};