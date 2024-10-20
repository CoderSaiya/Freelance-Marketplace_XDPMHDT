import { SearchOutlined } from "@ant-design/icons";

const Banner = () => {
  return (
    <div className="h-screen flex items-center justify-center z-50">
      {/* Wrapper with rounded corners */}
      <div className="relative w-full h-full overflow-hidden shadow-lg">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('img/banner.png')" }}
        ></div>

        {/* Content with dark background */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
          {/* Search bar */}
          <div className="bg-white bg-opacity-20 p-4 rounded-full shadow-lg flex items-center gap-4 w-3/4 max-w-6xl">
            <input
              type="text"
              placeholder="Name Project"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
            />
            <input
              type="date"
              placeholder="Check in"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
            />
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Category
              </option>
              <option value="1">1 Category</option>
              <option value="2">2 Category</option>
              <option value="3">3 Category</option>
              <option value="4">4 Category</option>
              <option value="5">5 Category</option>
              <option value="6">6 Category</option>
              <option value="7">7 Category</option>
              <option value="8">8 Category</option>
              <option value="9">9 Category</option>
              <option value="10">10 Category</option>
            </select>

            <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center">
              <SearchOutlined />
            </button>
          </div>

          {/* Text and Button */}
          <div className="text-center mt-12">
            <h1 className="text-white text-4xl font-bold">
              Are you looking for a job?
            </h1>
            <button className="mt-4 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200">
              Find
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
