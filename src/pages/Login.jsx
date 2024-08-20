import React, { useState } from "react";

import {
  Text,
  Flex,
  Heading,
  Card,
  TextField,
  Select,
  Container,
  Button,
} from "@radix-ui/themes";
import {
  LockClosedIcon,
  PersonIcon,
  EnvelopeClosedIcon,
} from "@radix-ui/react-icons";

const Login = () => {
  const [value, setValue] = useState("admin");

  // Updated data to match possible select options
  const data = {
    admin: { label: "Admin", icon: <PersonIcon /> },
    role: { label: "Role", icon: <PersonIcon /> },
    user: { label: "User", icon: <PersonIcon /> },
    manager: { label: "Manager", icon: <PersonIcon /> },
  };

  const handleLoginForm = (e) => {
    e.preventDefault();
    console.log(e);
  };

  const handleValueChange = (value) => {
    setValue(value);
  };
  return (
    <>
      <div className="h-screen grid place-content-center">
        <div className="xs:w-[100%] sm:w-[450px]">
          <Card className=" p-4 ">
            <form action="" onSubmit={handleLoginForm}>
              <div style={{ textAlign: "center" }}>
                <Heading mb="6">USER LOGIN</Heading>
              </div>
              <TextField.Root
                placeholder="Enter Email"
                className="mt-4"
                size={"3"}
              >
                <TextField.Slot>
                  <EnvelopeClosedIcon height="16" width="16" />
                </TextField.Slot>
              </TextField.Root>
              {/* {------------------------} */}
              <Flex
                direction="column"
                // maxWidth="160px"
                mt="4"
                style={{ width: "100%" }}
              >
                <Select.Root
                  value={value}
                  onValueChange={handleValueChange}
                  size={"3"}
                >
                  <Select.Trigger>
                    <Flex as="span" align="center" gap="2">
                      {data[value].icon}
                      {data[value].label}
                    </Flex>
                  </Select.Trigger>
                  <Select.Content position="popper">
                    <Select.Item value="admin">Admin</Select.Item>
                    <Select.Item value="user">User</Select.Item>
                    <Select.Item value="manager">Manager</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>

              {/* {-------------} */}

              <TextField.Root
                placeholder="Password"
                className="mt-4"
                size={"3"}
              >
                <TextField.Slot>
                  <LockClosedIcon height="16" width="16" />
                </TextField.Slot>
              </TextField.Root>

              <p className="text-right mt-2 text-[.7rem] cursor-pointer underline">
                Forgot Password?
              </p>
              {/* ------------------- */}
              <Button type="submit" className="w-[100%] mt-4">
                Submit
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Login;
