import React from "react";
import logoapp from "../../assets/mainlogo.png";

const Header = () => {
  return (
    <header className="App-header h-52 border-[1px] border-gray-200 text-center flex flex-col justify-center items-center text-3xl m-auto font-bold bg-gradient-to-r from-blue-700 to-blue-400 rounded-[12px] mb-5">
      <div className="flex mb-3">
        <img src={logoapp} alt="" className="w-44 h-32" />
      </div>

      <p className="text-lg mt-2 font-medium">
        Discover, Analyze, and Understand App Reviews from the Google Play Store
      </p>
    </header>
  );
};

export default Header;
