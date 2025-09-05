import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PsychoEducationPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contenu Psychoéducatif</h1>
          <p className="text-gray-600 mt-1">
            Articles et ressources pour accompagner votre processus de rétablissement
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Comprendre l'addiction</CardTitle>
              <CardDescription>Article informatif</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Une introduction aux mécanismes de l'addiction et aux processus de guérison.
              </p>
              <div className="text-xs text-gray-500">
                Catégorie: Éducation
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Techniques de gestion du stress</CardTitle>
              <CardDescription>Guide pratique</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Apprenez des techniques éprouvées pour gérer le stress au quotidien.
              </p>
              <div className="text-xs text-gray-500">
                Catégorie: Bien-être
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>L'importance de l'activité physique</CardTitle>
              <CardDescription>Article scientifique</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Découvrez les bienfaits de l'exercice dans le processus de rétablissement.
              </p>
              <div className="text-xs text-gray-500">
                Catégorie: Sport thérapie
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Construire un réseau de soutien</CardTitle>
              <CardDescription>Conseils pratiques</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Comment identifier et cultiver des relations positives pour votre rétablissement.
              </p>
              <div className="text-xs text-gray-500">
                Catégorie: Social
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}