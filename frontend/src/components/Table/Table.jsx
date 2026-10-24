import styles from "./Table.module.css";
import Loader from "../Loader/Loader";
import Alert from "../Alert/Alert";

// columns: [{ key, header, render?(row) }]. On phones each row becomes a labelled card.
const Table = ({ columns, rows, loading, error, emptyText = "No records found", rowKey = "_id" }) => {
  if (loading) return <Loader />;
  if (error) return <div className={styles.pad}><Alert type="error">{error}</Alert></div>;
  if (!rows?.length) return <p className={styles.empty}>{emptyText}</p>;
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>{columns.map((c) => <th key={c.key} scope="col">{c.header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row[rowKey] || i}>
              {columns.map((c) => (
                <td key={c.key} data-label={c.header}>{c.render ? c.render(row) : row[c.key] ?? "-"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Table;
