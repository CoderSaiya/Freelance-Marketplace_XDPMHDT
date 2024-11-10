import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BellOutlined } from "@ant-design/icons";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import AddFundsModal from "./AddFundsModal";
import { useGetWalletQuery } from "../../apis/graphqlApi";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const stripePromise = loadStripe(
  "pk_test_51PtpAPGH56JC4HtH4uJvwovRnTiKX8M3vFocyHUrIeQ2bSVyRUVvo60vwJs7852MEvvLhsurDHdmOeMWxbmhtdUi00kZhuJ5GN"
);

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const isLogin = localStorage.getItem("access_token") === "";
  const navigate = useNavigate();

  const userId = useSelector((state: RootState) => state.auth.userId);
  const username = useSelector((state: RootState) => state.auth.username);
  const { data, refetch } = useGetWalletQuery(Number(userId));

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    const newTimeoutId = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
    setTimeoutId(newTimeoutId);
  };

  const handleLogout = () => {
    localStorage.setItem("access_token", "");
    localStorage.setItem("refresh", "");

    navigate("/login");
  };

  const openAddFundsModal = () => {
    setIsAddFundsModalOpen(true);
  };

  const closeAddFundsModal = () => {
    setIsAddFundsModalOpen(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <nav className="bg-white shadow-md p-4 flex items-center justify-between">
      {/* Logo */}
      <Link to={"/"}>
        <div className="flex items-center gap-2">
          <img src="/img/logo.png" alt="Logo" className="w-12 h-12" />
          <span className="text-xl font-bold text-gray-900">
            Freelance Marketplace
          </span>
        </div>
      </Link>

      {/* Navigation */}
      <div className="flex items-center" style={{ gap: "1.5rem" }}>
        {isLogin ? (
          <>
            <Link to={"/login"}>
              <button className="text-gray-600 hover:text-gray-900 font-medium">
                Log in
              </button>
            </Link>

            <Link to={"/login?isRegister=true"}>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
                Sign up
              </button>
            </Link>
          </>
        ) : (
          <>
            <BellOutlined style={{ fontSize: 25 }} />
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* User Avatar */}
              <button className="flex items-center mr-4">
                <img
                  src="/img/logo.png"
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full"
                />

                <div className="flex flex-col items-start">
                  <h2 className="text-base">Username</h2>
                  <span className="text-sm">
                    ${data?.data.getWallet.balance} USD
                  </span>
                </div>
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 transform transition-all duration-300 ${
                  isDropdownOpen
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <Link
                  to={`/profile?username=${username}`}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={openAddFundsModal}
                >
                  Add Funds
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Funds Modal */}
      {isAddFundsModalOpen && (
        <Elements stripe={stripePromise}>
          <AddFundsModal onClose={closeAddFundsModal} refetch={refetch} />
        </Elements>
      )}
    </nav>
  );
};

export default Navbar;
