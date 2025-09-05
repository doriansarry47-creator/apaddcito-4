import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ExercisesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Exercices</h1>
          <p className="text-gray-600 mt-1">
            Découvrez nos exercices de thérapie sportive personnalisés
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Exercice de respiration</CardTitle>
              <CardDescription>Débutant • 5 minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Un exercice simple de respiration pour gérer le stress et l'anxiété.
              </p>
              <div className="text-xs text-gray-500">
                Catégorie: Relaxation
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Marche méditative</CardTitle>
              <CardDescription>Débutant • 10 minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Combinez activité physique douce et pleine conscience.
              </p>
              <div className="text-xs text-gray-500">
                Catégorie: Activité physique
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Étirements matinaux</CardTitle>
              <CardDescription>Débutant • 15 minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Commencez votre journée en douceur avec ces étirements simples.
              </p>
              <div className="text-xs text-gray-500">
                Catégorie: Mobilité
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}