import useAuth from "../../hooks/useAuth";
import AttendanceCalendar from "./AttendanceCalendar/AttendanceCalendar";
import AttendanceBoard from "./AttendanceBoard/AttendanceBoard";

// Employees see their own calendar; Admin/HR see the daily board
const Attendance = () => (useAuth().isEmployee ? <AttendanceCalendar /> : <AttendanceBoard />);
export default Attendance;
