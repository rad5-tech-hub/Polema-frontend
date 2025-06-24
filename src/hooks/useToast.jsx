import {
  faCheckCircle,
    faTimesCircle,
  faClose,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast from "react-hot-toast";

const useToast = () => {
  const showToast = ({ message, type = "success", duration = 4000,position="top-right" }) => {
    const icons = {
      success: (
        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
      ),
      error: (
        <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 mr-2" />
      ),
      loading: (
        <FontAwesomeIcon
          icon={faSpinner}
          className="text-blue-500 mr-2 animate-spin"
        />
      ),
    };

    const styles = {
      success: "bg-green-100 border-l-4 border-green-500 text-green-700",
      error: "bg-red-100 border-l-4 border-red-500 text-red-700",
      loading: "bg-blue-100 border-l-4 border-blue-500 text-blue-700",
    };

    toast(
      (t) => (
        <div className={`flex items-center p-4 rounded-lg ${styles[type]}`}>
          {icons[type]}
          <span
            className="flex-1"
            dangerouslySetInnerHTML={{ __html: message }}
          />
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-4 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            <FontAwesomeIcon icon={faClose} className="-700" />
          </button>
        </div>
      ),
      {
        duration,
        position:position,
        style: {
          background: "transparent",
          boxShadow: "none",
          padding: 0,
        },
      }
    );
  };

  return showToast;
};

export default useToast;
