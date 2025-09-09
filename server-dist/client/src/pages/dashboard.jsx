var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { CravingEntry } from "@/components/craving-entry";
import { BeckColumn } from "@/components/beck-column";
import { GamificationProgress } from "@/components/gamification-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuthQuery } from "@/hooks/use-auth";
import { getEmergencyExercises } from "@/lib/exercises-data";
export default function Dashboard() {
    var _this = this;
    var _a = useState(false), showCravingEntry = _a[0], setShowCravingEntry = _a[1];
    var _b = useState(false), showBeckColumn = _b[0], setShowBeckColumn = _b[1];
    var toast = useToast().toast;
    // Récupérer l'utilisateur authentifié
    var _c = useAuthQuery(), authenticatedUser = _c.data, isLoading = _c.isLoading;
    var cravingStats = useQuery({
        queryKey: ["/api/cravings/stats"],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/api/cravings/stats")];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error("Failed to fetch craving stats");
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        enabled: !!authenticatedUser,
        initialData: { average: 0, trend: 0 },
    }).data;
    var userStats = useQuery({
        queryKey: ["/api/users/stats"],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/api/users/stats")];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error("Failed to fetch user stats");
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        enabled: !!authenticatedUser,
        initialData: { exercisesCompleted: 0, totalDuration: 0, currentStreak: 0, longestStreak: 0, averageCraving: 0, id: '', userId: '', updatedAt: new Date() },
    }).data;
    // Pas besoin de requête séparée pour user, nous avons déjà authenticatedUser
    var user = authenticatedUser;
    var startEmergencyRoutine = function () {
        var emergencyExercises = getEmergencyExercises();
        if (emergencyExercises.length > 0) {
            // Navigate to the first emergency exercise
            window.location.href = "/exercise/".concat(emergencyExercises[0].id);
        }
    };
    var todayCravingLevel = (cravingStats === null || cravingStats === void 0 ? void 0 : cravingStats.average) || 0;
    var cravingTrend = (cravingStats === null || cravingStats === void 0 ? void 0 : cravingStats.trend) || 0;
    var exercisesCompleted = (userStats === null || userStats === void 0 ? void 0 : userStats.exercisesCompleted) || 0;
    var userLevel = 1; // Par défaut niveau 1, peut être étendu avec la gamification
    // Loading state
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>);
    }
    return (<>
      <Navigation />
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        
        {/* Dashboard Overview Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Today's Craving Level */}
          <Card className="shadow-material" data-testid="card-craving-level">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground">Niveau de Craving Aujourd'hui</h3>
                <span className="material-icons text-primary">trending_down</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-foreground" data-testid="text-today-craving">
                    {Math.round(todayCravingLevel)}
                  </span>
                  <span className="text-sm text-muted-foreground">/10</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full craving-slider rounded-full transition-all duration-300" style={{ width: "".concat((todayCravingLevel / 10) * 100, "%") }} data-testid="progress-craving-level"></div>
                </div>
                <p className={"text-sm font-medium ".concat(cravingTrend < 0 ? 'text-success' : 'text-warning')}>
                  {cravingTrend < 0 ? '↓' : '↑'} {Math.abs(Math.round(cravingTrend))}% depuis hier
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Progress */}
          <Card className="shadow-material" data-testid="card-weekly-progress">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground">Progrès Cette Semaine</h3>
                <span className="material-icons text-secondary">bar_chart</span>
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary" data-testid="text-exercises-completed">
                    {exercisesCompleted}
                  </div>
                  <div className="text-sm text-muted-foreground">exercices complétés</div>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="material-icons text-warning text-lg">emoji_events</span>
                  <span className="text-sm font-medium text-foreground">
                    Niveau {userLevel}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Action */}
          <Card className="bg-gradient-to-br from-destructive to-red-600 shadow-material text-destructive-foreground" data-testid="card-emergency">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Routine d'Urgence</h3>
                <span className="material-icons">emergency</span>
              </div>
              <p className="text-sm mb-4 opacity-90">Ressens-tu un craving intense maintenant?</p>
              <Button onClick={startEmergencyRoutine} className="w-full bg-white text-destructive font-medium hover:bg-gray-50" data-testid="button-emergency-routine">
                Démarrer Routine 3 min
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-material" data-testid="card-quick-craving">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="material-icons mr-2 text-primary">psychology</span>
                Enregistrement Rapide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Comment vous sentez-vous maintenant ?
              </p>
              <Button onClick={function () { return setShowCravingEntry(!showCravingEntry); }} className="w-full" data-testid="button-toggle-craving">
                {showCravingEntry ? "Masquer" : "Enregistrer un Craving"}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-material" data-testid="card-quick-beck">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="material-icons mr-2 text-secondary">psychology</span>
                Analyse Cognitive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Analysez une situation difficile
              </p>
              <Button onClick={function () { return setShowBeckColumn(!showBeckColumn); }} variant="secondary" className="w-full" data-testid="button-toggle-beck">
                {showBeckColumn ? "Masquer" : "Démarrer Analyse Beck"}
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Conditional Forms */}
        {showCravingEntry && authenticatedUser && (<section className="mb-8">
            <CravingEntry userId={authenticatedUser.id} onSuccess={function () {
                setShowCravingEntry(false);
                toast({
                    title: "Craving enregistré",
                    description: "Merci d'avoir partagé votre ressenti.",
                });
            }}/>
          </section>)}

        {showBeckColumn && authenticatedUser && (<section className="mb-8">
            <BeckColumn userId={authenticatedUser.id} onSuccess={function () {
                setShowBeckColumn(false);
                toast({
                    title: "Analyse sauvegardée",
                    description: "Votre réflexion a été enregistrée.",
                });
            }}/>
          </section>)}

        {/* Quick Access to Exercises */}
        <section className="mb-8">
          <Card className="shadow-material" data-testid="card-exercise-shortcuts">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="material-icons mr-2 text-primary">fitness_center</span>
                  Exercices Recommandés
                </div>
                <Link to="/exercises" className="text-primary hover:text-primary/80 font-medium text-sm">
                  Voir tout
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" data-testid="button-craving-exercises">
                  <span className="material-icons text-destructive">emergency</span>
                  <div className="text-center">
                    <div className="font-medium">Réduction Craving</div>
                    <div className="text-xs text-muted-foreground">Exercices ciblés</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" data-testid="button-breathing-exercises">
                  <span className="material-icons text-secondary">air</span>
                  <div className="text-center">
                    <div className="font-medium">Respiration</div>
                    <div className="text-xs text-muted-foreground">Techniques guidées</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" data-testid="button-relaxation-exercises">
                  <span className="material-icons text-primary">self_improvement</span>
                  <div className="text-center">
                    <div className="font-medium">Relaxation</div>
                    <div className="text-xs text-muted-foreground">Détente profonde</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Gamification Progress */}
        {authenticatedUser && <GamificationProgress userId={authenticatedUser.id}/>}
      </main>

      {/* Floating Emergency Button */}
      <Button onClick={startEmergencyRoutine} className="fab bg-destructive text-destructive-foreground w-14 h-14 rounded-full shadow-material-lg hover:shadow-xl transition-all" data-testid="button-fab-emergency">
        <span className="material-icons">emergency</span>
      </Button>
    </>);
}
