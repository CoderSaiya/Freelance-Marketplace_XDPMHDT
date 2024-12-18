import * as signalR from "@microsoft/signalr";

const BASE_URL = import.meta.env.VITE_BASE_URL;

let connection: signalR.HubConnection | null = null;

export const createHubConnection = (
    hubName: string,
    handleChat: (notification: any) => void
) => {
    connection = new signalR.HubConnectionBuilder()
        .withUrl(`${BASE_URL}/${hubName}`, {
            accessTokenFactory: () => localStorage.getItem("access_token") || "",
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

    // Nhận message từ server
    connection.on("ReceiveMessage", handleChat);

    connection
        .start()
        .then(() => console.log("Connected to SignalR"))
        .catch((err) => console.error("SignalR Connection Error:", err));
};

export const stopHubConnection = () => {
    connection?.stop().then(() => console.log("Disconnected from SignalR"));
};
