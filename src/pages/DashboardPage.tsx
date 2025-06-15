
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardPage = () => {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Bem-vindo ao seu Dashboard, {user?.name}!</h1>
      <Card>
        <CardHeader>
          <CardTitle>Suas Informações</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Perfil:</strong> {user?.role}</p>
          {role === 'rt' && user?.creaNumber && (
            <p>
              <strong>CREA:</strong> {user.creaNumber}{' '}
              <span className={user.creaValidated ? "text-green-600" : "text-orange-500"}>
                {user.creaValidated ? '(Validado)' : '(Pendente)'}
              </span>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
