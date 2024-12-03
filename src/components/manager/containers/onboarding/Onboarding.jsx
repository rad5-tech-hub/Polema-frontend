import React from "react";
import { Card, Heading, Text } from "@radix-ui/themes";

const Onboarding = () => {
  return (
    <Card className="p-6 shadow-lg border rounded-md bg-white">
      <Heading size="3" className="mb-4 text-center">
        Polema Dashboard
      </Heading>
      <Text size="2" className="text-gray-600 text-center">
        Manage your tasks seamlessly and stay organized. Use the navigation menu
        to explore action tabs tailored to your role and responsibilities. Each
        action tab is designed to streamline your workflow and enhance
        productivity.
      </Text>
    </Card>
  );
};

export default Onboarding;