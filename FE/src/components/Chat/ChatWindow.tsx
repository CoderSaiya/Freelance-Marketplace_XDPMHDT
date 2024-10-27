import React from "react";

const ChatWindow: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full relative">
      {/* Container for messages with its own scroll */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 items-end max-h-[70%]">
        <div className="self-start bg-gray-200 p-2 rounded-lg max-w-xs">
          <p>Gorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
        <div className="self-end bg-blue-500 text-white p-2 rounded-lg max-w-xs">
          <p>Worem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
        <div className="self-start bg-gray-200 p-2 rounded-lg max-w-xs">
          <p>Borem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>

      {/* Chat input at the bottom, floating above other content */}
      <div className="absolute bottom-0 left-0 right-0 px-4 bg-white border-t border-gray-300 mb-40">
        <input
          type="text"
          placeholder="Type a message"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
    </div>
  );
};

export default ChatWindow;
