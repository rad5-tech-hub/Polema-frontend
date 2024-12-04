import { Theme } from "@radix-ui/themes";
import ThemeSwitcher from "../components/ThemeSwitcher";
import NewPasswordContent from "./NewPasswordContent";

const NewPassword = () => {
  return (
    <>
      <Theme accentColor="blue" appearance={""} panelBackground="translucent">
        <NewPasswordContent />
      </Theme>
    </>
  );
};

export default NewPassword;
