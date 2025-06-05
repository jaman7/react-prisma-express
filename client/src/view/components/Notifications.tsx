import { useEffect, useState } from 'react';
import { useSocket } from '@/core/auth/SocketProvider';

export interface INotification {
  id?: string;
  type?: string;
  message?: string;
  createdAt?: string;
  taskId?: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handler = (data: INotification) => {
      setNotifications((prev) => [data, ...prev.slice(0, 4)]); // maksymalnie 5 ostatnich
    };

    socket.on('notification', handler);
    return () => {
      socket.off('notification', handler);
    };
  }, [socket]);

  if (notifications.length === 0) return null;

  return (
    <div className="notifications text-xs text-white bg-blue-600 px-2 py-1 rounded-md me-3">
      <ul>
        {notifications.map((note, idx) => (
          <li key={idx}>
            <strong>{note.type}:</strong> {note.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
