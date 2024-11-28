import React from "react";
import { Heading, Box, Button } from "@radix-ui/themes";

const NotificationDetails = ({ notification, closeDetails }) => {
  return (
    <div
      className="absolute top-0 right-0 w-[25rem] h-full bg-white shadow-lg p-4 transition-transform duration-300"
      style={{
        transform: notification ? "translateX(0)" : "translateX(100%)",
      }}
    >
      <Heading size="lg" mb="4">
        Notification Details
      </Heading>
      <Box mb="4">
        <p>
          <strong>Message:</strong> {notification.message}
        </p>
        <p>
          <strong>Created At:</strong> {notification.createdAt}
        </p>
      </Box>
      <Button variant="outline" onClick={closeDetails}>
        Close
      </Button>
    </div>
  );
};

export default NotificationDetails;
