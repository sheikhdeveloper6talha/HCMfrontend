import CrudPage from "../CrudPage/CrudPage";

const Designations = () => (
  <CrudPage title="Designations" subtitle="Job titles" path="designations" singular="Designation"
    fields={[{ name: "name", label: "Designation name", rules: { required: "Name is required" } }]}
    columns={[{ key: "name", header: "Name" }]} />
);
export default Designations;
