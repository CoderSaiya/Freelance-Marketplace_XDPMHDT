import React from "react";

const ConversationList: React.FC = () => {
  return (
    <div className="w-1/4 h-full border-r p-4 overflow-y-auto">
      <div className="mb-4">
        <h3>Messages</h3>
      </div>
      <div className="space-y-4">
        {/* Dummy Data */}
        <div className="p-2 border rounded cursor-pointer hover:bg-gray-100">
          <p>Jenny Scott</p>
          <small>12:01pm</small>
        </div>
        <div className="p-2 border rounded cursor-pointer hover:bg-gray-100">
          <p>Jane Smith</p>
          <small>Yesterday</small>
        </div>
        <div className="p-2 border rounded cursor-pointer hover:bg-gray-100">
          <p>Johna Scott</p>
          <small>05/05/23</small>
        </div>
      </div>
    </div>
  );
};

export default ConversationList;
