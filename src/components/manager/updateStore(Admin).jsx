import { adminState } from "../store/adminSlice/adminSlice";
import { useDispatch } from "react-redux";

const dispatch = useDispatch();
const updateStore = (value) => {
  dispatch(adminState(value));
};

export { updateStore };
