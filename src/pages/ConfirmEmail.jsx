import { Theme } from "@radix-ui/themes";
import ThemeSwitcher from "../components/ThemeSwitcher";
import ConfirmEmailContent from "./ConfirmEmailContent";

const ConfirmEmail = () => {
  return (
    <>
      <Theme accentColor="blue" appearance={""} panelBackground="translucent">
        <ConfirmEmailContent />
      </Theme>
    </>
  );
};

export default ConfirmEmail;
