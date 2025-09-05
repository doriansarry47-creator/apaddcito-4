import React from 'react';
import { useUser, useLogout } from '../hooks/useUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user } = useUser();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Bienvenue, {user?.firstName || user?.email}
              </h1>
              <p className="text-gray-600 mt-1">
                Tableau de bord - Apaddicto
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              Se déconnecter
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Exercices</CardTitle>
              <CardDescription>
                Découvrez nos exercices de thérapie sportive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Voir les exercices
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contenu Psychoéducatif</CardTitle>
              <CardDescription>
                Articles et ressources pour votre bien-être
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Découvrir le contenu
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mes Progrès</CardTitle>
              <CardDescription>
                Suivez votre évolution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Niveau:</span>
                  <span className="font-semibold">{user?.level || 1}</span>
                </div>
                <div className="flex justify-between">
                  <span>Points:</span>
                  <span className="font-semibold">{user?.points || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Informations du compte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Rôle</label>
                  <p className="text-gray-900 capitalize">{user?.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Membre depuis</label>
                  <p className="text-gray-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Statut</label>
                  <p className="text-gray-900">
                    {user?.isActive ? 'Actif' : 'Inactif'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}