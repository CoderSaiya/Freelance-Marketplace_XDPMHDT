import React from "react";
import Gradient from "./Gradient";
import { useGetCategoryQuery } from "../../apis/graphqlApi";

const Banner: React.FC = () => {
  const { data } = useGetCategoryQuery();
  const categories = data?.data.categories; 
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Animated Background */}
      <Gradient />

      {/* Diagonal Overlay */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 85%)",
        }}
      />

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-center">
          {/* Left Side Content */}
          <div className="space-y-6 max-w-xl pt-20 md:pt-0">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-white/10 text-white text-sm backdrop-blur-sm">
                Sessions 2025 • Early-bird registration now open
              </span>
            </div>

            <h1 className="text-5xl font-bold text-white leading-tight">
              Find Top Freelance Talent for Every Project
            </h1>

            <p className="text-lg text-white/80">
              Collaborate with skilled freelancers to bring your ideas to life.
              From design and development to writing and marketing, our platform
              connects you with the right experts to get your project done
              quickly and efficiently. Start your search today and unlock
              endless possibilities!
            </p>

            <div className="flex gap-4 max-w-md">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-4 py-3 rounded-md bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm border border-white/20"
              />
              <button className="px-6 py-3 bg-white text-black rounded-md hover:bg-white/90 transition-colors font-medium">
                Start now →
              </button>
            </div>
          </div>

          {/* Right Side - Job Form */}
          <div className="relative mt-10 md:mt-0">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto">
              <h1 className="font-semibold mb-10 text-2xl">Search for job</h1>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name Project"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <div className="grid grid-cols-2 gap-4">
                  <select
                    className="col-span-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Category
                    </option>
                    {categories?.map((category) => (
                      <option
                        key={category.categoryId}
                        value={category.categoryId}
                      >
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Budget"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="date"
                    placeholder=""
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
