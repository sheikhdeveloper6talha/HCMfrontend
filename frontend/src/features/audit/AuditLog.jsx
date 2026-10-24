import { useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import Card from "../../components/Card/Card";
import Table from "../../components/Table/Table";
import Select from "../../components/Select/Select";
import Modal from "../../components/Modal/Modal";
import Button from "../../components/Button/Button";
import Pagination from "../../components/Pagination/Pagination";
import useFetch from "../../hooks/useFetch";
import { getAuditLogs } from "../../services/miscService";
import { formatDateTime } from "../../utils/formatDate";
import styles from "./AuditLog.module.css";

const ENTITIES = ["User", "User(HR)", "Employee", "Company", "Department", "Designation", "LeaveType", "Holiday", "LeaveRequest", "Attendance", "AttendanceCorrection", "SalaryStructure", "PayrollRun", "Announcement"];

// Read-only: audit entries cannot be edited or deleted from the UI or API
const AuditLog = () => {
  const [entity, setEntity] = useState("");
  const [page, setPage] = useState(1);
  const { data, loading, error } = useFetch(() => getAuditLogs({ entity, page, limit: 15 }), [entity, page]);
  const [detail, setDetail] = useState(null);

  const columns = [
    { key: "when", header: "When", render: (a) => formatDateTime(a.createdAt) },
    { key: "actor", header: "Actor", render: (a) => a.actorName || "System" },
    { key: "action", header: "Action", render: (a) => a.action.replace(/_/g, " ") },
    { key: "entity", header: "Entity" },
    { key: "detail", header: "", render: (a) => (a.before || a.after) && <Button small variant="ghost" onClick={() => setDetail(a)}>Changes</Button> },
  ];

  return (
    <>
      <PageHeader title="Audit log" subtitle="Append-only record of important actions" />
      <div className={styles.filter}>
        <Select label="Entity" name="aentity" placeholder="All entities" value={entity} onChange={(e) => { setEntity(e.target.value); setPage(1); }} options={ENTITIES.map((e) => ({ value: e, label: e }))} />
      </div>
      <Card flush>
        <Table columns={columns} rows={data?.data} loading={loading} error={error} emptyText="No audit entries" />
        <Pagination meta={data?.meta} onPage={setPage} />
      </Card>
      <Modal wide open={Boolean(detail)} title="Recorded values" onClose={() => setDetail(null)} footer={<Button onClick={() => setDetail(null)}>Close</Button>}>
        <div className={styles.diff}>
          <div><h3>Before</h3><pre>{JSON.stringify(detail?.before ?? null, null, 2)}</pre></div>
          <div><h3>After</h3><pre>{JSON.stringify(detail?.after ?? null, null, 2)}</pre></div>
        </div>
      </Modal>
    </>
  );
};
export default AuditLog;
