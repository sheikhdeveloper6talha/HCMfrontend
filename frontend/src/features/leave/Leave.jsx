import useAuth from "../../hooks/useAuth";
import LeaveList from "./LeaveList/LeaveList";
import LeaveApprovals from "./LeaveApprovals/LeaveApprovals";

const Leave = () => (useAuth().isEmployee ? <LeaveList /> : <LeaveApprovals />);
export default Leave;
