import React from "react";

import useAuthSession from "../../hooks/useAuthSession.js";

const UserWelcome = () => {
  const session = useAuthSession();
  const firstName = session?.user?.name?.split(" ")[0] || "Sarah";

  return (
    <>
      {/* Welcome Banner */}
     <div className="mb-2">
        <h3 className="hidden lg:block text-[#2c4a7d] font-inter text-2xl">My Dashboard</h3>
         <div className="mb-6 mt-2 flex gap-2 flex-wrap items-center">
        <h1 className="text-[#2c4a7d] text-lg sm:text-sm md:text-xs lg:text-base font-inter font-semibold ">
          Welcome back, {firstName}!
        </h1>
        <p className="text-gray-500 font-roboto text-sm sm:text-sm mt-1">
          Here's what's happening with your laundry.
        </p>
      </div>
     </div>
    </>
  );
};

export default UserWelcome;
