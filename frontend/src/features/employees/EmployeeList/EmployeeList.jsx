import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Card from "../../../components/Card/Card";
import Table from "../../../components/Table/Table";
import Button from "../../../components/Button/Button";
import Badge from "../../../components/Badge/Badge";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import Pagination from "../../../components/Pagination/Pagination";
import Alert from "../../../components/Alert/Alert";
import useFetch from "../../../hooks/useFetch";
import useAuth from "../../../hooks/useAuth";
import { getEmployees, listOrg, exportEmployees } from "../../../services/employeeService";
import { formatDate } from "../../../utils/formatDate";
import { errorMessage, saveBlob } from "../../../utils/validation";
import styles from "./EmployeeList.module.css";

const EmployeeList = () => {
  const { isHR } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ search: "", department: "", designation: "", status: "", page: 1 });
  const [exportError, setExportError] = useState("");
  const { data, loading, error } = useFetch(() => getEmployees({ ...filters, limit: 10 }), [JSON.stringify(filters)]);
  const { data: depts } = useFetch(() => listOrg("departments"));
  const { data: desigs } = useFetch(() => listOrg("designations"));
  const set = (k) => (e) => setFilters((f) => ({ ...f, [k]: e.target.value, page: 1 }));
  const opts = (list) => (list || []).map((x) => ({ value: x._id, label: x.name }));

  const onExport = async () => {
    setExportError("");
    try { saveBlob(await exportEmployees(filters), "employees.csv"); } catch (e) { setExportError(errorMessage(e)); }
  };

  const columns = [
    { key: "code", header: "Code" },
    { key: "name", header: "Name", render: (e) => <Link to={`/employees/${e._id}`}>{e.name}</Link> },
    { key: "department", header: "Department", render: (e) => e.department?.name },
    { key: "designation", header: "Designation", render: (e) => e.designation?.name },
    { key: "joiningDate", header: "Joined", render: (e) => formatDate(e.joiningDate) },
    { key: "status", header: "Status", render: (e) => <Badge status={e.status} /> },
  ];

  return (
    <>
      <PageHeader title="Employees" subtitle="Search, filter and manage your people">
        <Button variant="secondary" onClick={onExport}>Export CSV</Button>
        {isHR && <Button onClick={() => navigate("/employees/new")}>Add employee</Button>}
      </PageHeader>
      <Alert type="error">{exportError}</Alert>
      <Card>
        <div className={styles.filters}>
          <Input label="Search" name="search" placeholder="Name, email or code" value={filters.search} onChange={set("search")} />
          <Select label="Department" name="fdept" placeholder="All" value={filters.department} onChange={set("department")} options={opts(depts)} />
          <Select label="Designation" name="fdesig" placeholder="All" value={filters.designation} onChange={set("designation")} options={opts(desigs)} />
          <Select label="Status" name="fstatus" placeholder="All" value={filters.status} onChange={set("status")} options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]} />
        </div>
      </Card>
      <Card flush>
        <Table columns={columns} rows={data?.data} loading={loading} error={error} emptyText="No employees match your filters" />
        <Pagination meta={data?.meta} onPage={(page) => setFilters((f) => ({ ...f, page }))} />
      </Card>
    </>
  );
};
export default EmployeeList;
