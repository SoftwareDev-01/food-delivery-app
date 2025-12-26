import React from "react";
import { useSelector } from "react-redux";
import UserDashboard from "../components/UserDashboard";
import OwnerDashboard from "../components/OwnerDashboard";
import DeliveryBoy from "../components/DeliveryBoy";
import Footer from "../components/Footer";

const roleComponentMap = {
  user: UserDashboard,
  owner: OwnerDashboard,
  deliveryBoy: DeliveryBoy,
};

function Home() {
  const { userData } = useSelector((state) => state.user);
  const RoleComponent = roleComponentMap[userData?.role];

  return (
    <div className="w-[100vw] min-h-[100vh] pt-[100px] flex flex-col items-center bg-[#fff9f6]">
      {RoleComponent ? <RoleComponent /> : null}
      <Footer />
    </div>
  );
}

export default Home;
