import React, { useState, useEffect } from "react";
import { HiArchiveBox } from "react-icons/hi2";

import Cookies from "js-cookie";

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userFirstName, setUserFirstName] = useState("");


  const decodeToken = async (token) => {
    try {
      const response = await fetch("http://localhost:8081/decodeToken", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      if (response.ok) {
        const decodedToken = await response.json();
        const { user_id, table_name } = decodedToken;
        
        // Log the values for verification
        console.log("User ID:", user_id);
        console.log("Table Name:", table_name);
  
        // Return user_id and table_name
        return { user_id, table_name };
      } else {
        console.error("Failed to decode token:", response.statusText);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  
    // If there's an error or response is not ok, return null or handle the error as needed
    return null;
  };

  const getFirstName = async (user_id, table_name) => {
    try {
      const response = await fetch("http://localhost:8081/getFirstName", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id, table_name }),
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Failed to fetch first name:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching first name:", error);
      return null;
    }
  };  

  useEffect(() => {
    const storedToken = Cookies.get("token");
    if (storedToken) {
      setIsLoggedIn(true);
      decodeToken(storedToken).then((data) => {
        if (data) {
          const { user_id, table_name } = data;
          console.log("User ID:", user_id);
          console.log("Table Name:", table_name);
          // Call getFirstName with user_id and table_name
          getFirstName(user_id, table_name).then((firstNameData) => {
            if (firstNameData && firstNameData.first_name) {
              setUserFirstName(firstNameData.first_name);
              console.log("updated", firstNameData.first_name);
            }
          });
        }
      });
    }
  }, []);
  

  const handleLogout = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
    setShowDropdown(false);
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const Popup = () => {
    return (
      <div className="absolute top-16 right-0 bg-white border rounded shadow-lg p-4">
        <p>No new notifications</p>
      </div>
    );
  };

  return (
    <header className="text-[#313639] body-font z-1 shadow">
      <div className="w-full flex justify-between items-center pl-5 pt-5 pb-5 pr-2">
        <div className="flex items-center">
          <a
            href="/"
            className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
          >
            <img src="/logo.svg" alt="logo" className="w-12 mx-10"></img>
            <span className="ml-3 text-xl">Baker Museum</span>
          </a>
          <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400	flex flex-wrap items-center text-base justify-center">
            <a href="/exhibits" className="mr-5 hover:text-gray-900">
              Exhibits
            </a>
            <a href="/artworks" className="mr-5 hover:text-gray-900">
              Artworks
            </a>
            <a href="/tickets" className="mr-5 hover:text-gray-900">
              Tickets
            </a>
            <a href="/giftshop" className="mr-5 hover:text-gray-900">
              Gift Shop
            </a>
            <a href="/dining" className="mr-5 hover:text-gray-900">
              Dining
            </a>
          </nav>
          <div className="relative">
          <HiArchiveBox className="text-2xl cursor-pointer" onClick={togglePopup} />
          
          {isPopupOpen && <Popup />}
        </div>
        </div>
        <div className="flex items-center">
          <button className="inline-flex justify-center items-center mr-4 bg-[#EFEDE5] border-0 py-1 px-3 focus:outline-none hover:bg-[#DCD7C5] rounded text-base">
            <a href="/cart">My Cart</a>
          </button>
          {isLoggedIn ? (
            <div className="relative inline-block text-left">
              <button
                className="inline-flex justify-center items-center mr-12 bg-[#EFEDE5] border-0 py-1 px-3 focus:outline-none hover:bg-[#DCD7C5] rounded text-base ml-auto"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {userFirstName || "More"}
                {/* Dropdown arrow icon */}
              </button>
              {showDropdown && (
                <div className="origin-top-right absolute right-0 mt-2 w-20 mr-12 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1" role="none">
                    <a
                      href="/profile"
                      className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                      role="menuitem"
                    >
                      Profile
                    </a>
                    <a
                      href="/login"
                      className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      Log Out
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <a href="/login">
              <button
                className="inline-flex justify-center items-center mr-12 bg-[#EFEDE5] border-0 py-1 px-3 focus:outline-none hover:bg-[#DCD7C5] rounded text-base ml-auto"
              >
                Log In
                {/* Login icon */}
              </button>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
