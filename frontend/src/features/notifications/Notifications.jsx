import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader/PageHeader";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";
import { fetchNotifications, readAll } from "./notificationsSlice";
import { markNotificationRead } from "../../services/miscService";
import { formatDateTime } from "../../utils/formatDate";
import styles from "./Notifications.module.css";

const Notifications = () => {
  const dispatch = useDispatch();
  const { items, unread, loading } = useSelector((s) => s.notifications);
  useEffect(() => { dispatch(fetchNotifications()); }, [dispatch]);

  const open = async (n) => { if (!n.read) { await markNotificationRead(n._id); dispatch(fetchNotifications()); } };

  return (
    <>
      <PageHeader title="Notifications" subtitle={`${unread} unread`}>
        <Button variant="secondary" disabled={!unread} onClick={() => dispatch(readAll())}>Mark all as read</Button>
      </PageHeader>
      {loading && !items.length && <Loader />}
      {!loading && items.length === 0 && <p className="muted">You are all caught up.</p>}
      <Card flush>
        <ul className={styles.list}>
          {items.map((n) => (
            <li key={n._id} className={n.read ? "" : styles.unread}>
              <div>
                <strong>{n.title}</strong>
                <p>{n.message}</p>
                <small className="muted">{formatDateTime(n.createdAt)}</small>
              </div>
              <div className="row">
                {n.link && <Link to={n.link} onClick={() => open(n)}>Open</Link>}
                {!n.read && <Button small variant="ghost" onClick={() => open(n)}>Mark read</Button>}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
};
export default Notifications;
