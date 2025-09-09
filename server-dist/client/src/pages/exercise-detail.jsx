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
import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getExerciseById, levels, intensities } from "@/lib/exercises-data";
var DEMO_USER_ID = "demo-user-123";
export default function ExerciseDetail() {
    var _this = this;
    var id = useParams().id;
    var _a = useState(false), isRunning = _a[0], setIsRunning = _a[1];
    var _b = useState(0), timeElapsed = _b[0], setTimeElapsed = _b[1];
    var _c = useState(0), currentStep = _c[0], setCurrentStep = _c[1];
    var _d = useState(null), cravingBefore = _d[0], setCravingBefore = _d[1];
    var _e = useState(null), cravingAfter = _e[0], setCravingAfter = _e[1];
    var _f = useState(false), showCravingAfter = _f[0], setShowCravingAfter = _f[1];
    var toast = useToast().toast;
    var queryClient = useQueryClient();
    var exercise = getExerciseById(id);
    var createSessionMutation = useMutation({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiRequest("POST", "/api/exercise-sessions", data)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ["/api/exercise-sessions", DEMO_USER_ID] });
            queryClient.invalidateQueries({ queryKey: ["/api/users", DEMO_USER_ID, "stats"] });
        },
    });
    useEffect(function () {
        var interval = null;
        if (isRunning) {
            interval = setInterval(function () {
                setTimeElapsed(function (prev) { return prev + 1; });
            }, 1000);
        }
        return function () {
            if (interval)
                clearInterval(interval);
        };
    }, [isRunning]);
    if (!exercise) {
        return (<>
        <Navigation />
        <main className="container mx-auto px-4 py-6">
          <Card className="shadow-material">
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Exercice non trouvé</h1>
              <Link to="/exercises">
                <Button>Retour aux exercices</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </>);
    }
    var startExercise = function () {
        if (cravingBefore === null) {
            toast({
                title: "Évaluation requise",
                description: "Veuillez d'abord évaluer votre niveau de craving actuel.",
                variant: "destructive",
            });
            return;
        }
        setIsRunning(true);
        setTimeElapsed(0);
        setCurrentStep(0);
    };
    var stopExercise = function () {
        setIsRunning(false);
        setShowCravingAfter(true);
        toast({
            title: "Exercice terminé",
            description: "Félicitations ! Comment vous sentez-vous maintenant ?",
        });
    };
    var completeExercise = function () {
        if (cravingAfter === null) {
            toast({
                title: "Évaluation requise",
                description: "Veuillez évaluer votre niveau de craving après l'exercice.",
                variant: "destructive",
            });
            return;
        }
        createSessionMutation.mutate({
            userId: DEMO_USER_ID,
            exerciseId: exercise.id,
            duration: timeElapsed,
            completed: true,
            cratingBefore: cravingBefore,
            cravingAfter: cravingAfter,
        });
        toast({
            title: "Session enregistrée",
            description: "Merci d'avoir complété cet exercice !",
        });
        // Navigate back to exercises
        window.location.href = "/exercises";
    };
    var nextStep = function () {
        if (currentStep < exercise.instructions.length - 1) {
            setCurrentStep(function (prev) { return prev + 1; });
        }
        else {
            stopExercise();
        }
    };
    var formatTime = function (seconds) {
        var mins = Math.floor(seconds / 60);
        var secs = seconds % 60;
        return "".concat(mins, ":").concat(secs.toString().padStart(2, '0'));
    };
    var getLevelBadgeColor = function (level) {
        switch (level) {
            case 'beginner':
                return 'bg-green-100 text-green-800';
            case 'intermediate':
                return 'bg-yellow-100 text-yellow-800';
            case 'advanced':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };
    var stepProgress = ((currentStep + 1) / exercise.instructions.length) * 100;
    var expectedDuration = exercise.duration * 60; // Convert to seconds
    return (<>
      <Navigation />
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        
        {/* Exercise Header */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link to="/exercises" className="flex items-center text-primary hover:text-primary/80">
              <span className="material-icons mr-1">arrow_back</span>
              Retour aux exercices
            </Link>
            <Badge className={getLevelBadgeColor(exercise.level)}>
              {levels[exercise.level]}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-foreground mb-4" data-testid="title-exercise">
                {exercise.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6" data-testid="description-exercise">
                {exercise.description}
              </p>
              
              {/* Exercise Info */}
              <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center">
                  <span className="material-icons text-base mr-1">schedule</span>
                  <span>{exercise.duration} minutes</span>
                </div>
                <div className="flex items-center">
                  <span className="material-icons text-base mr-1">fitness_center</span>
                  <span>Intensité {intensities[exercise.intensity].toLowerCase()}</span>
                </div>
                <div className="flex items-center">
                  <span className="material-icons text-base mr-1">category</span>
                  <span>{exercise.type}</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <img src={exercise.imageUrl} alt={exercise.title} className="w-full h-64 object-cover rounded-xl shadow-material" data-testid="img-exercise"/>
            </div>
          </div>
        </section>

        {/* Pre-Exercise Evaluation */}
        {!isRunning && !showCravingAfter && (<section className="mb-8">
            <Card className="shadow-material" data-testid="card-pre-evaluation">
              <CardHeader>
                <CardTitle>Évaluation Pré-Exercice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Sur une échelle de 0 à 10, quel est votre niveau de craving actuel ?
                  </label>
                  <input type="range" min="0" max="10" value={cravingBefore || 5} onChange={function (e) { return setCravingBefore(Number(e.target.value)); }} className="w-full h-2 craving-slider rounded-lg cursor-pointer" data-testid="slider-craving-before"/>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0 - Aucun</span>
                    <span className="font-bold text-primary">{cravingBefore || 5}</span>
                    <span>10 - Très intense</span>
                  </div>
                </div>
                <Button onClick={startExercise} className="w-full" disabled={cravingBefore === null} data-testid="button-start-exercise">
                  Démarrer l'Exercice
                </Button>
              </CardContent>
            </Card>
          </section>)}

        {/* Exercise Progress */}
        {isRunning && (<section className="mb-8">
            <Card className="shadow-material" data-testid="card-exercise-progress">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Exercice en cours</span>
                  <span className="text-2xl font-bold text-primary" data-testid="text-timer">
                    {formatTime(timeElapsed)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Étape {currentStep + 1} sur {exercise.instructions.length}</span>
                    <span>{Math.round(stepProgress)}%</span>
                  </div>
                  <Progress value={stepProgress} className="h-2" data-testid="progress-steps"/>
                </div>

                {/* Current Instruction */}
                <Card className="bg-accent/50">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-foreground mb-2">
                      Étape {currentStep + 1}
                    </h3>
                    <p className="text-foreground" data-testid="text-current-instruction">
                      {exercise.instructions[currentStep]}
                    </p>
                  </CardContent>
                </Card>

                {/* Controls */}
                <div className="flex justify-between">
                  <Button variant="outline" onClick={stopExercise} data-testid="button-stop-exercise">
                    Arrêter
                  </Button>
                  <Button onClick={nextStep} data-testid="button-next-step">
                    {currentStep === exercise.instructions.length - 1 ? "Terminer" : "Suivant"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>)}

        {/* Post-Exercise Evaluation */}
        {showCravingAfter && (<section className="mb-8">
            <Card className="shadow-material" data-testid="card-post-evaluation">
              <CardHeader>
                <CardTitle>Évaluation Post-Exercice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-xl font-bold text-foreground">Félicitations !</h3>
                  <p className="text-muted-foreground">
                    Vous avez terminé l'exercice en {formatTime(timeElapsed)}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Quel est maintenant votre niveau de craving ?
                  </label>
                  <input type="range" min="0" max="10" value={cravingAfter || 5} onChange={function (e) { return setCravingAfter(Number(e.target.value)); }} className="w-full h-2 craving-slider rounded-lg cursor-pointer" data-testid="slider-craving-after"/>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0 - Aucun</span>
                    <span className="font-bold text-secondary">{cravingAfter || 5}</span>
                    <span>10 - Très intense</span>
                  </div>
                </div>

                {cravingBefore !== null && cravingAfter !== null && (<div className="bg-accent/30 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">Votre amélioration</h4>
                    <div className="flex items-center justify-between">
                      <span>Avant: {cravingBefore}/10</span>
                      <span className="material-icons text-primary">arrow_forward</span>
                      <span>Après: {cravingAfter}/10</span>
                    </div>
                    {cravingBefore > cravingAfter && (<p className="text-success text-sm mt-2 font-medium">
                        ✓ Réduction de {cravingBefore - cravingAfter} points !
                      </p>)}
                  </div>)}

                <Button onClick={completeExercise} className="w-full" disabled={cravingAfter === null || createSessionMutation.isPending} data-testid="button-complete-exercise">
                  {createSessionMutation.isPending ? "Enregistrement..." : "Terminer la Session"}
                </Button>
              </CardContent>
            </Card>
          </section>)}

        {/* Exercise Information */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Instructions */}
          <Card className="shadow-material" data-testid="card-instructions">
            <CardHeader>
              <CardTitle>Instructions Détaillées</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {exercise.instructions.map(function (instruction, index) { return (<li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      {index + 1}
                    </span>
                    <span className="text-foreground">{instruction}</span>
                  </li>); })}
              </ol>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="shadow-material" data-testid="card-benefits">
            <CardHeader>
              <CardTitle>Bénéfices de cet Exercice</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {exercise.benefits.map(function (benefit, index) { return (<li key={index} className="flex items-start">
                    <span className="material-icons text-success mr-3 mt-0.5">check_circle</span>
                    <span className="text-foreground">{benefit}</span>
                  </li>); })}
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>
    </>);
}
