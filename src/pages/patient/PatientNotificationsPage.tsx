import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { mockNotifications } from '../../data/mockData';
import { Bell, CheckCheck, Clock, ShieldAlert } from 'lucide-react';

export const PatientNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Patient Notifications</h1>
          <p className="text-xs text-slate-500">Live queue alerts, appointment reminders, and hospital announcements</p>
        </div>

        <Button size="sm" variant="outline" icon={<CheckCheck className="w-4 h-4" />} onClick={markAllRead}>
          Mark All Read
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <Card key={notif.id} className={`p-4 space-y-2 transition-all ${!notif.read ? 'border-l-4 border-l-emerald-500 bg-emerald-50/30' : ''}`}>
            <div className="flex items-center justify-between">
              <Badge variant={notif.type === 'queue' ? 'called' : 'info'}>{notif.type.toUpperCase()}</Badge>
              <span className="text-[10px] text-slate-400 font-mono">
                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{notif.title}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{notif.message}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
