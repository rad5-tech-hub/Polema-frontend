import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PersonIcon } from "@radix-ui/react-icons";
import { Card } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { Dropdown, Menu, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Logout from "../Logout";

const Profile = () => {
  const [popupOpen, setPopupOpen] = React.useState(false);
  const navigate = useNavigate()
  const menuItems = [
    {
      key: "change-password",
      label: "Change Password",
      onClick: () => {
        navigate("/admin/change-password")
      },
    },
    {
      key: "logout",
      label: "Logout",
      onClick: () => {
        setPopupOpen(true);
      },
    },
  ];

  return (
    <>
      <Card className="cursor-pointer relative border-[1px] z-[999] border-[#000]/60 rounded-lg p-3">
        <Dropdown menu={{ items: menuItems }} trigger={["hover"]}>
          <a onClick={(e) => e.preventDefault()}>
            <PersonIcon />
          </a>
        </Dropdown>
      </Card>

      {popupOpen && <Logout />}
    </>
  );
};

export default Profile;
