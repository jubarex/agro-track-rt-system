
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, Check } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Notifications = () => {
    const { user } = useAuth();
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

    if (user?.role?.toLowerCase() !== 'rt') {
        return null; // Só mostra para RT
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-red-100">
                            {unreadCount}
                        </span>
                    )}
                    <span className="sr-only">Ver notificações</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 md:w-96">
                <div className="p-2 flex justify-between items-center">
                    <DropdownMenuLabel className="p-0">Notificações</DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={(e) => { e.preventDefault(); markAllAsRead(); }}>
                            Marcar todas como lidas
                        </Button>
                    )}
                </div>
                <DropdownMenuSeparator />
                 <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map(notification => (
                            <DropdownMenuItem key={notification.id} asChild className="p-0" onSelect={(e) => { e.preventDefault(); markAsRead(notification.id)}}>
                                <Link
                                    to={notification.link || "#"}
                                    className={cn(
                                        "block p-2 rounded-md transition-colors m-1",
                                        !notification.read ? "bg-secondary" : "bg-transparent"
                                    )}
                                >
                                    <p className="text-sm font-medium whitespace-normal">{notification.message}</p>
                                    <p className="text-xs text-muted-foreground capitalize">
                                      {format(new Date(notification.date), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                                    </p>
                                </Link>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            <Bell className="mx-auto h-6 w-6 mb-2" />
                            Nenhuma notificação por aqui.
                        </div>
                    )}
                </div>
                {notifications.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled className="p-2 text-center text-xs text-muted-foreground">
                            Alertas para os próximos 7 dias.
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Notifications;
