import React from "react";
import { Button, Select, Text } from "@radix-ui/themes";

const FilterModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[101] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
        <h2 className="text-lg font-semibold mb-4">Filter Orders</h2>

        <form action="">
          <div className="w-full">
            <Text>Filter By Customer</Text>
            <Select.Root>
              <Select.Trigger className="w-full" />
              <Select.Content>
                <Select.Item>Item One</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        </form>
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} variant="soft">
            Cancel
          </Button>
          <Button onClick={onClose} variant="solid">
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
