import React from "react";
import { Card, Container, Text } from "@radix-ui/themes";
import Charts from "../../Charts.jsx";

const WelcomeComponent = () => {
  return (
    <Container>
      <Card>
        <Text color="grass">As a manager,you have the liberty to:</Text>
        <li className="text-green-700 mt-3">Manage Admins</li>
        <li className="text-green-700">
          Manage Sales and expenses for Sludge and other raws.
        </li>
      </Card>
      {/* <Charts /> */}
    </Container>
  );
};

export default WelcomeComponent;
