import CrudPage from "../CrudPage/CrudPage";
import { formatDate } from "../../../utils/formatDate";

const Holidays = () => (
  <CrudPage title="Public holidays" subtitle="Holidays are skipped in attendance, leave and payroll" path="holidays" singular="Holiday"
    fields={[
      { name: "name", label: "Holiday name", rules: { required: "Name is required" } },
      { name: "date", label: "Date", type: "date", rules: { required: "Date is required" } },
    ]}
    columns={[{ key: "name", header: "Name" }, { key: "date", header: "Date", render: (r) => formatDate(r.date) }]} />
);
export default Holidays;
