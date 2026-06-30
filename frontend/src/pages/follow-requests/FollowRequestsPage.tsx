import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as frApi from "../../api/followRequests";
import type {
  IFollowRequestIncoming,
  IFollowRequestOutgoing,
} from "../../types/follow";
import { profilePath } from "../../router";
import { toastError } from "../../lib/toast";
import styles from "./FollowRequestsPage.module.scss";

export const FollowRequestsPage = () => {
  const [incoming, setIncoming] = useState<IFollowRequestIncoming[]>([]);
  const [outgoing, setOutgoing] = useState<IFollowRequestOutgoing[]>([]);

  const loadAll = async () => {
    try {
      const [inc, out] = await Promise.all([
        frApi.getIncoming(0, 20),
        frApi.getOutgoing(0, 20),
      ]);
      setIncoming(inc.incomingRequests);
      setOutgoing(out.outgoingRequests);
    } catch (err) {
      toastError(err, "Не удалось загрузить заявки");
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleAccept = async (req: IFollowRequestIncoming) => {
    try {
      await frApi.acceptRequest(req._id);
      await loadAll();
    } catch (err) {
      toastError(err, "Не удалось принять заявку");
    }
  };

  const handleReject = async (req: IFollowRequestIncoming) => {
    try {
      await frApi.rejectRequest(req.requesterId._id);
      await loadAll();
    } catch (err) {
      toastError(err, "Не удалось отклонить заявку");
    }
  };

  const handleCancel = async (req: IFollowRequestOutgoing) => {
    try {
      await frApi.cancelRequest(req.targetId._id);
      await loadAll();
    } catch (err) {
      toastError(err, "Не удалось отменить заявку");
    }
  };

  return (
    <main className={styles.main}>
      <h2>Входящие заявки</h2>
      {incoming.length > 0 && (
        <ul>
          {incoming.map((req) => (
            <li key={req._id}>
              <Link to={profilePath(req.requesterId._id)}>
                {req.requesterId.nickname}
              </Link>
              <button onClick={() => handleAccept(req)}>Принять</button>
              <button onClick={() => handleReject(req)}>Отклонить</button>
            </li>
          ))}
        </ul>
      )}
      {incoming.length === 0 && <div>Входящих заявок нет</div>}

      <h2>Исходящие заявки</h2>
      {outgoing.length > 0 && (
        <ul>
          {outgoing.map((req) => (
            <li key={req._id}>
              <Link to={profilePath(req.targetId._id)}>
                {req.targetId.nickname}
              </Link>

              <button onClick={() => handleCancel(req)}>Отменить</button>
            </li>
          ))}
        </ul>
      )}
      {outgoing.length === 0 && <div>Исходящих заявок нет</div>}
    </main>
  );
};

export default FollowRequestsPage;
