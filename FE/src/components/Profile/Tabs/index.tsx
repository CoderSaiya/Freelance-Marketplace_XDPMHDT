import { TabsProps } from "../../../types";

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-start items-center border-b border-gray-300 mb-6 pb-2">
      <button
        className={`mr-6 transition-colors duration-200 ${
          activeTab === "Timeline"
            ? "text-blue-500 border-b-2 border-blue-500"
            : "text-gray-600"
        }`}
        onClick={() => setActiveTab("Timeline")}
      >
        Timeline
      </button>
      <button
        className={`mr-6 transition-colors duration-200 ${
          activeTab === "About"
            ? "text-blue-500 border-b-2 border-blue-500"
            : "text-gray-600"
        }`}
        onClick={() => setActiveTab("About")}
      >
        About
      </button>
      <button
        className={`transition-colors duration-200 ${
          activeTab === "Projects"
            ? "text-blue-500 border-b-2 border-blue-500"
            : "text-gray-600"
        }`}
        onClick={() => setActiveTab("Projects")}
      >
        Projects
      </button>
    </div>
  );
};

export default Tabs;
