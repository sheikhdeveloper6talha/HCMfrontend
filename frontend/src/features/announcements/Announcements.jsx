import { useState } from "react";
import { useForm } from "react-hook-form";
import PageHeader from "../../components/PageHeader/PageHeader";
import Card from "../../components/Card/Card";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Alert from "../../components/Alert/Alert";
import Loader from "../../components/Loader/Loader";
import { ConfirmModal } from "../../components/Modal/Modal";
import useFetch from "../../hooks/useFetch";
import useAuth from "../../hooks/useAuth";
import { getAnnouncements, postAnnouncement, deleteAnnouncement } from "../../services/miscService";
import { formatDateTime } from "../../utils/formatDate";
import { errorMessage, required } from "../../utils/validation";
import styles from "./Announcements.module.css";

const Announcements = () => {
  const { isEmployee } = useAuth();
  const { data, loading, error, reload } = useFetch(getAnnouncements);
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [removing, setRemoving] = useState(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onPost = async (v) => {
    setFeedback({ type: "", text: "" });
    try { await postAnnouncement(v); reset(); setFeedback({ type: "success", text: "Announcement posted" }); reload(); }
    catch (e) { setFeedback({ type: "error", text: errorMessage(e) }); }
  };
  const onDelete = async () => {
    try { await deleteAnnouncement(removing._id); reload(); } catch (e) { setFeedback({ type: "error", text: errorMessage(e) }); }
    setRemoving(null);
  };

  return (
    <>
      <PageHeader title="Announcements" subtitle="Company news and notices" />
      <Alert type={feedback.type || "info"} onClose={() => setFeedback({ type: "", text: "" })}>{feedback.text}</Alert>
      {!isEmployee && (
        <Card title="Post an announcement">
          <form className="stack" onSubmit={handleSubmit(onPost)} noValidate>
            <Input label="Title" error={errors.title?.message} {...register("title", required("Title"))} />
            <Input label="Message" multiline rows={4} error={errors.message?.message} {...register("message", required("Message"))} />
            <div><Button type="submit" loading={isSubmitting}>Post</Button></div>
          </form>
        </Card>
      )}
      {loading && <Loader />}
      <Alert type="error">{error}</Alert>
      {data?.length === 0 && <p className="muted">No announcements yet.</p>}
      <div className="stack">
        {(data || []).map((a) => (
          <Card key={a._id}>
            <div className={styles.item}>
              <div>
                <h2>{a.title}</h2>
                <p className={styles.msg}>{a.message}</p>
                <small className="muted">{a.postedBy?.name || "Admin"} - {formatDateTime(a.createdAt)}</small>
              </div>
              {!isEmployee && <Button small variant="danger" onClick={() => setRemoving(a)}>Delete</Button>}
            </div>
          </Card>
        ))}
      </div>
      <ConfirmModal open={Boolean(removing)} title="Delete announcement" message={`Delete "${removing?.title}"?`} confirmLabel="Delete" onConfirm={onDelete} onClose={() => setRemoving(null)} />
    </>
  );
};
export default Announcements;
