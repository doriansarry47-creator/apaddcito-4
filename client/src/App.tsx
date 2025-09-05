import { Router, Route, Switch } from 'wouter';
import { ThemeProvider } from 'next-themes';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ExercisesPage from './pages/ExercisesPage';
import PsychoEducationPage from './pages/PsychoEducationPage';
import { useUser } from './hooks/useUser';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Router>
        <div className="min-h-screen bg-background">
          {!user ? (
            <LoginPage />
          ) : (
            <Switch>
              <Route path="/" component={DashboardPage} />
              <Route path="/dashboard" component={DashboardPage} />
              <Route path="/exercises" component={ExercisesPage} />
              <Route path="/psycho-education" component={PsychoEducationPage} />
              <Route>
                <DashboardPage />
              </Route>
            </Switch>
          )}
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;