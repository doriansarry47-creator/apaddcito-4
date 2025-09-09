import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { ExerciseCard } from "@/components/exercise-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { exercises, categories, levels } from "@/lib/exercises-data";
import { useToast } from "@/hooks/use-toast";
export default function Exercises() {
    var _a = useState('craving_reduction'), selectedCategory = _a[0], setSelectedCategory = _a[1];
    var _b = useState('all'), selectedLevel = _b[0], setSelectedLevel = _b[1];
    var toast = useToast().toast;
    var filteredExercises = exercises.filter(function (exercise) {
        var categoryMatch = exercise.category === selectedCategory;
        var levelMatch = selectedLevel === 'all' || exercise.level === selectedLevel;
        return categoryMatch && levelMatch;
    });
    var handleStartExercise = function (exercise) {
        toast({
            title: "Exercice démarré",
            description: "Vous avez commenc\u00E9 \"".concat(exercise.title, "\". Bonne s\u00E9ance !"),
        });
        // Here you would typically navigate to the exercise detail page or start a timer
        window.location.href = "/exercise/".concat(exercise.id);
    };
    return (<>
      <Navigation />
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        
        {/* Page Header */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Bibliothèque d'Exercices</h1>
          <p className="text-muted-foreground">
            Choisissez parmi nos exercices adaptés à votre niveau et vos besoins du moment.
          </p>
        </section>

        {/* Filters */}
        <section className="mb-8">
          <Card className="shadow-material" data-testid="card-filters">
            <CardHeader>
              <CardTitle className="text-lg">Filtres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Catégorie</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(categories).map(function (_a) {
            var key = _a[0], label = _a[1];
            return (<Button key={key} variant={selectedCategory === key ? "default" : "outline"} size="sm" onClick={function () { return setSelectedCategory(key); }} data-testid={"button-category-".concat(key)}>
                      {label}
                    </Button>);
        })}
                </div>
              </div>

              {/* Level Filter */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Niveau</h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant={selectedLevel === 'all' ? "default" : "outline"} size="sm" onClick={function () { return setSelectedLevel('all'); }} data-testid="button-level-all">
                    Tous niveaux
                  </Button>
                  {Object.entries(levels).map(function (_a) {
            var key = _a[0], label = _a[1];
            return (<Button key={key} variant={selectedLevel === key ? "default" : "outline"} size="sm" onClick={function () { return setSelectedLevel(key); }} data-testid={"button-level-".concat(key)}>
                      {label}
                    </Button>);
        })}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Results Summary */}
        <section className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium text-foreground">
              {categories[selectedCategory]}
              {selectedLevel !== 'all' && " - ".concat(levels[selectedLevel])}
            </h2>
            <span className="text-sm text-muted-foreground" data-testid="text-results-count">
              {filteredExercises.length} exercice{filteredExercises.length !== 1 ? 's' : ''}
            </span>
          </div>
        </section>

        {/* Exercise Grid */}
        <section>
          {filteredExercises.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-exercises">
              {filteredExercises.map(function (exercise) { return (<ExerciseCard key={exercise.id} exercise={exercise} onStart={function () { return handleStartExercise(exercise); }}/>); })}
            </div>) : (<Card className="shadow-material" data-testid="card-no-results">
              <CardContent className="p-8 text-center">
                <span className="material-icons text-6xl text-muted-foreground mb-4">search_off</span>
                <h3 className="text-xl font-medium text-foreground mb-2">Aucun exercice trouvé</h3>
                <p className="text-muted-foreground mb-4">
                  Essayez de modifier vos filtres pour voir plus d'exercices.
                </p>
                <Button onClick={function () {
                setSelectedCategory('craving_reduction');
                setSelectedLevel('all');
            }} data-testid="button-reset-filters">
                  Réinitialiser les filtres
                </Button>
              </CardContent>
            </Card>)}
        </section>

        {/* Emergency Access */}
        <section className="mt-12">
          <Card className="bg-gradient-to-r from-destructive to-red-600 shadow-material text-destructive-foreground" data-testid="card-emergency-section">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-medium mb-2 flex items-center">
                    <span className="material-icons mr-2">emergency</span>
                    Besoin d'aide immédiate ?
                  </h3>
                  <p className="opacity-90">
                    Accédez rapidement à nos routines d'urgence de 3 minutes pour gérer un craving intense.
                  </p>
                </div>
                <Button onClick={function () {
            var emergencyExercise = exercises.find(function (ex) { return ex.type === 'emergency'; });
            if (emergencyExercise) {
                handleStartExercise(emergencyExercise);
            }
        }} className="bg-white text-destructive hover:bg-gray-50 ml-4" data-testid="button-emergency-access">
                  Routine d'Urgence
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </>);
}
