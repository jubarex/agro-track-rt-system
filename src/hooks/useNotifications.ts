
import { useState, useEffect } from 'react';
import { MOCK_PROPERTIES, Notification } from '@/types';
import { differenceInDays, parseISO, format, isFuture, startOfToday } from 'date-fns';

const generateNotifications = (): Notification[] => {
  const today = startOfToday();
  const notifications: Notification[] = [];

  MOCK_PROPERTIES.forEach(property => {
    property.applications.forEach(app => {
      const appDate = parseISO(app.date);
      
      if (isFuture(appDate) || differenceInDays(appDate, today) === 0) {
        const daysUntil = differenceInDays(appDate, today);

        if (daysUntil <= 7) { // Alertas para a próxima semana
          let message = '';
          if (daysUntil === 0) {
            message = `Aplicação de ${app.product} na ${property.name} agendada para hoje.`;
          } else if (daysUntil === 1) {
            message = `Aplicação de ${app.product} na ${property.name} agendada para amanhã.`;
          } else {
            message = `Aplicação de ${app.product} na ${property.name} em ${daysUntil} dias (${format(appDate, 'dd/MM/yyyy')}).`;
          }
          
          notifications.push({
            id: `notif-${app.id}`,
            message,
            date: app.date,
            read: false,
            link: `/dashboard/propriedades`, // Link para a página de propriedades
          });
        }
      }
    });
  });

  return notifications.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const generated = generateNotifications();
    setNotifications(generated);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, unreadCount, markAsRead, markAllAsRead };
};
