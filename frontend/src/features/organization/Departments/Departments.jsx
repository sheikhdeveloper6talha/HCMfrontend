import CrudPage from "../CrudPage/CrudPage";

const Departments = () => (
  <CrudPage title="Departments" subtitle="Teams that employees belong to" path="departments" singular="Department"
    fields={[{ name: "name", label: "Department name", rules: { required: "Name is required" } }]}
    columns={[{ key: "name", header: "Name" }]} />
);
export default Departments;
