
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Bem-vindo ao seu Dashboard, {user?.fullName}!</h1>
      <Card>
        <CardHeader>
          <CardTitle>Suas Informações</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Perfil:</strong> {user?.role}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
