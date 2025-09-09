var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
export default function Profile() {
    var _this = this;
    var _a, _b;
    var _c = useAuth(), authUser = _c.user, authLoading = _c.isLoading;
    var _d = useState({
        dailyReminder: true,
        cravingAlert: true,
        progressUpdate: false,
        weeklyReport: true
    }), notifications = _d[0], setNotifications = _d[1];
    var _e = useState(""), firstName = _e[0], setFirstName = _e[1];
    var _f = useState(""), lastName = _f[0], setLastName = _f[1];
    var _g = useState(""), email = _g[0], setEmail = _g[1];
    var _h = useState(false), isEditingEmail = _h[0], setIsEditingEmail = _h[1];
    var toast = useToast().toast;
    var queryClient = useQueryClient();
    var updateUserMutation = useMutation({
        mutationFn: function (updatedUser) {
            return fetch("/api/users/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedUser),
            }).then(function (res) {
                if (!res.ok) {
                    return res.json().then(function (err) { throw new Error(err.message || "Failed to update profile"); });
                }
                return res.json();
            });
        },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ["/api/users/profile"] });
            toast({
                title: "Profil mis à jour",
                description: "Vos informations ont été mises à jour avec succès.",
            });
        },
        onError: function (error) {
            toast({
                title: "Erreur",
                description: error.message || "Impossible de mettre à jour le profil.",
                variant: "destructive",
            });
        },
    });
    var handleUpdateProfile = function (e) {
        e.preventDefault();
        // Validation basique
        if (!firstName.trim() && !lastName.trim()) {
            toast({
                title: "Erreur",
                description: "Veuillez saisir au moins un prénom ou un nom.",
                variant: "destructive",
            });
            return;
        }
        // Validation de la longueur
        if (firstName.trim().length > 50 || lastName.trim().length > 50) {
            toast({
                title: "Erreur",
                description: "Le prénom et le nom ne peuvent pas dépasser 50 caractères.",
                variant: "destructive",
            });
            return;
        }
        var updateData = {
            firstName: firstName.trim(),
            lastName: lastName.trim()
        };
        // Inclure l'email seulement si il a été modifié
        if (isEditingEmail && email !== (user === null || user === void 0 ? void 0 : user.email)) {
            // Validation email
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.trim())) {
                toast({
                    title: "Erreur",
                    description: "Veuillez saisir une adresse email valide.",
                    variant: "destructive",
                });
                return;
            }
            updateData.email = email.trim();
        }
        updateUserMutation.mutate(updateData);
    };
    var _j = useState(""), oldPassword = _j[0], setOldPassword = _j[1];
    var _k = useState(""), newPassword = _k[0], setNewPassword = _k[1];
    var _l = useState(""), confirmPassword = _l[0], setConfirmPassword = _l[1];
    var updatePasswordMutation = useMutation({
        mutationFn: function (passwords) {
            return fetch("/api/users/password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(passwords),
            }).then(function (res) {
                if (!res.ok) {
                    return res.json().then(function (err) { throw new Error(err.message || "Failed to update password"); });
                }
                return res.json();
            });
        },
        onSuccess: function () {
            toast({
                title: "Mot de passe mis à jour",
                description: "Votre mot de passe a été changé avec succès.",
            });
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        },
        onError: function (error) {
            toast({
                title: "Erreur",
                description: error.message,
                variant: "destructive",
            });
        },
    });
    var handlePasswordChange = function (e) {
        e.preventDefault();
        // Validation des champs requis
        if (!oldPassword.trim()) {
            toast({
                title: "Erreur",
                description: "L'ancien mot de passe est requis.",
                variant: "destructive",
            });
            return;
        }
        if (!newPassword.trim()) {
            toast({
                title: "Erreur",
                description: "Le nouveau mot de passe est requis.",
                variant: "destructive",
            });
            return;
        }
        // Validation de la longueur du mot de passe
        if (newPassword.length < 6) {
            toast({
                title: "Erreur",
                description: "Le nouveau mot de passe doit contenir au moins 6 caractères.",
                variant: "destructive",
            });
            return;
        }
        // Validation de la correspondance
        if (newPassword !== confirmPassword) {
            toast({
                title: "Erreur",
                description: "Les nouveaux mots de passe ne correspondent pas.",
                variant: "destructive",
            });
            return;
        }
        // Vérifier que le nouveau mot de passe est différent de l'ancien
        if (oldPassword === newPassword) {
            toast({
                title: "Erreur",
                description: "Le nouveau mot de passe doit être différent de l'ancien.",
                variant: "destructive",
            });
            return;
        }
        updatePasswordMutation.mutate({ oldPassword: oldPassword, newPassword: newPassword });
    };
    var deleteAccountMutation = useMutation({
        mutationFn: function () {
            return fetch("/api/users/profile", {
                method: "DELETE",
            }).then(function (res) {
                if (!res.ok)
                    throw new Error("Failed to delete account");
                return res.json();
            });
        },
        onSuccess: function () {
            toast({
                title: "Compte supprimé",
                description: "Votre compte a été supprimé avec succès.",
            });
            handleLogout();
        },
        onError: function () {
            toast({
                title: "Erreur",
                description: "Impossible de supprimer le compte.",
                variant: "destructive",
            });
        },
    });
    var handleDeleteAccount = function () {
        deleteAccountMutation.mutate();
    };
    var _m = useQuery({
        queryKey: ["/api/users/profile"],
        enabled: !!authUser,
    }), user = _m.data, userLoading = _m.isLoading;
    useEffect(function () {
        if (user) {
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            setEmail(user.email || "");
        }
    }, [user]);
    var _o = useQuery({
        queryKey: ["/api/users/stats"],
        enabled: !!authUser,
    }), userStats = _o.data, statsLoading = _o.isLoading;
    var _p = useQuery({
        queryKey: ["/api/users/badges"],
        enabled: !!authUser,
    }), badges = _p.data, badgesLoading = _p.isLoading;
    var cravingStats = useQuery({
        queryKey: ["/api/cravings/stats"],
        enabled: !!authUser,
    }).data;
    var isLoading = authLoading || userLoading || statsLoading || badgesLoading;
    if (isLoading) {
        return (<>
        <Navigation />
        <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
          <div className="space-y-6">
            <div className="h-8 bg-muted rounded w-1/3 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map(function (i) { return (<Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-8 bg-muted rounded w-1/2"></div>
                  </CardContent>
                </Card>); })}
            </div>
          </div>
        </main>
      </>);
    }
    var handleNotificationChange = function (key) {
        setNotifications(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[key] = !prev[key], _a)));
        });
        toast({
            title: "Préférences mises à jour",
            description: "Vos paramètres de notification ont été sauvegardés.",
        });
    };
    var exportData = function () {
        toast({
            title: "Export en cours",
            description: "Vos données sont en cours de préparation pour le téléchargement.",
        });
    };
    var _q = useLocation(), setLocation = _q[1];
    var handleLogout = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("/api/auth/logout", { method: "POST" })];
                case 1:
                    _a.sent();
                    setLocation("/login");
                    queryClient.clear(); // Clear the cache on logout
                    return [2 /*return*/];
            }
        });
    }); };
    var getBadgeInfo = function (badgeType) {
        switch (badgeType) {
            case '7_days':
                return { icon: 'star', name: '7 jours consécutifs', description: 'Une semaine d\'exercices réguliers', color: 'bg-warning' };
            case '50_exercises':
                return { icon: 'fitness_center', name: '50 exercices', description: 'Demi-centenaire d\'exercices complétés', color: 'bg-success' };
            case 'craving_reduction':
                return { icon: 'trending_down', name: 'Réduction des cravings', description: 'Diminution significative des cravings', color: 'bg-primary' };
            default:
                return { icon: 'emoji_events', name: 'Badge', description: 'Récompense obtenue', color: 'bg-muted' };
        }
    };
    var level = (user === null || user === void 0 ? void 0 : user.level) || 1;
    var points = (user === null || user === void 0 ? void 0 : user.points) || 0;
    var currentLevelProgress = points % 100;
    var nextLevelPoints = 100 - currentLevelProgress;
    var totalExercises = (userStats === null || userStats === void 0 ? void 0 : userStats.exercisesCompleted) || 0;
    var totalDuration = (userStats === null || userStats === void 0 ? void 0 : userStats.totalDuration) || 0;
    var averageCraving = (cravingStats === null || cravingStats === void 0 ? void 0 : cravingStats.average) || 0;
    return (<>
      <Navigation />
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        
        {/* Page Header */}
        <section className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Profil</h1>
            <p className="text-muted-foreground">
              Gérez vos informations personnelles et suivez votre progression globale.
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <span className="material-icons mr-2">logout</span>
            Se déconnecter
          </Button>
        </section>

        {/* Profile Overview */}
        <section className="mb-8">
          <Card className="shadow-material" data-testid="card-profile-overview">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {((_a = user === null || user === void 0 ? void 0 : user.firstName) === null || _a === void 0 ? void 0 : _a[0]) || 'U'}{((_b = user === null || user === void 0 ? void 0 : user.lastName) === null || _b === void 0 ? void 0 : _b[0]) || 'S'}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-1" data-testid="text-user-name">
                    {(user === null || user === void 0 ? void 0 : user.firstName) || 'Utilisateur'} {(user === null || user === void 0 ? void 0 : user.lastName) || 'Demo'}
                  </h2>
                  <p className="text-muted-foreground mb-2" data-testid="text-user-email">
                    {(user === null || user === void 0 ? void 0 : user.email) || 'demo@example.com'}
                  </p>
                  <div className="flex items-center space-x-4">
                    <Badge className="bg-primary text-primary-foreground">
                      Niveau {level}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {points} points
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-1">Progression niveau {level + 1}</div>
                  <Progress value={currentLevelProgress} className="w-32 h-2"/>
                  <div className="text-xs text-muted-foreground mt-1">
                    {nextLevelPoints} points restants
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Detailed Tabs */}
        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4" data-testid="tabs-profile">
            <TabsTrigger value="stats" data-testid="tab-stats">Statistiques</TabsTrigger>
            <TabsTrigger value="badges" data-testid="tab-badges">Badges</TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">Paramètres</TabsTrigger>
            <TabsTrigger value="data" data-testid="tab-data">Données</TabsTrigger>
          </TabsList>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-material" data-testid="card-stat-exercises">
                <CardContent className="p-6 text-center">
                  <span className="material-icons text-4xl text-secondary mb-2">fitness_center</span>
                  <div className="text-2xl font-bold text-foreground">{totalExercises}</div>
                  <div className="text-sm text-muted-foreground">Exercices complétés</div>
                </CardContent>
              </Card>

              <Card className="shadow-material" data-testid="card-stat-duration">
                <CardContent className="p-6 text-center">
                  <span className="material-icons text-4xl text-primary mb-2">schedule</span>
                  <div className="text-2xl font-bold text-foreground">{Math.round(totalDuration / 60)}</div>
                  <div className="text-sm text-muted-foreground">Minutes d'exercice</div>
                </CardContent>
              </Card>

              <Card className="shadow-material" data-testid="card-stat-streak">
                <CardContent className="p-6 text-center">
                  <span className="material-icons text-4xl text-warning mb-2">local_fire_department</span>
                  <div className="text-2xl font-bold text-foreground">{(userStats === null || userStats === void 0 ? void 0 : userStats.currentStreak) || 0}</div>
                  <div className="text-sm text-muted-foreground">Jours consécutifs</div>
                </CardContent>
              </Card>

              <Card className="shadow-material" data-testid="card-stat-craving">
                <CardContent className="p-6 text-center">
                  <span className="material-icons text-4xl text-destructive mb-2">psychology</span>
                  <div className="text-2xl font-bold text-foreground">{averageCraving.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Craving moyen (/10)</div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Charts */}
            <Card className="shadow-material" data-testid="card-progress-details">
              <CardHeader>
                <CardTitle>Progression Détaillée</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Niveau actuel</span>
                    <span>Niveau {level}</span>
                  </div>
                  <Progress value={currentLevelProgress} className="h-3"/>
                  <div className="text-xs text-muted-foreground mt-1">
                    {currentLevelProgress}/100 points pour le niveau suivant
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Répartition des Exercices</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Réduction craving</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} className="h-2"/>
                      <div className="flex justify-between text-sm">
                        <span>Relaxation</span>
                        <span>30%</span>
                      </div>
                      <Progress value={30} className="h-2"/>
                      <div className="flex justify-between text-sm">
                        <span>Énergie</span>
                        <span>25%</span>
                      </div>
                      <Progress value={25} className="h-2"/>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-3">Évolution Mensuelle</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Cette semaine</span>
                        <span className="text-success">+12%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Ce mois</span>
                        <span className="text-success">+35%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Craving moyen</span>
                        <span className="text-success">-23%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-6">
            <Card className="shadow-material" data-testid="card-badges-collection">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="material-icons mr-2 text-warning">emoji_events</span>
                  Collection de Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                {badges && badges.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {badges.map(function (badge) {
                var badgeInfo = getBadgeInfo(badge.badgeType);
                return (<div key={badge.id} className="border border-border rounded-lg p-4 text-center" data-testid={"badge-card-".concat(badge.badgeType)}>
                          <div className={"w-16 h-16 ".concat(badgeInfo.color, " rounded-full flex items-center justify-center mx-auto mb-3")}>
                            <span className="material-icons text-white text-2xl">
                              {badgeInfo.icon}
                            </span>
                          </div>
                          <h4 className="font-medium text-foreground mb-1">{badgeInfo.name}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{badgeInfo.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {badge.earnedAt ? "Obtenu le ".concat(new Date(badge.earnedAt).toLocaleDateString('fr-FR')) : ''}
                          </p>
                        </div>);
            })}
                  </div>) : (<div className="text-center py-8" data-testid="empty-badges">
                    <span className="material-icons text-6xl text-muted-foreground mb-4">emoji_events</span>
                    <h3 className="text-lg font-medium text-foreground mb-2">Aucun badge obtenu</h3>
                    <p className="text-muted-foreground">Complétez des exercices pour gagner vos premiers badges !</p>
                  </div>)}
              </CardContent>
            </Card>

            {/* Badge Progress */}
            <Card className="shadow-material" data-testid="card-badge-progress">
              <CardHeader>
                <CardTitle>Badges à Débloquer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <span className="material-icons text-muted-foreground">schedule</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Marathon Débutant</h4>
                      <p className="text-sm text-muted-foreground">Complétez 100 exercices</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{totalExercises}/100</div>
                    <Progress value={(totalExercises / 100) * 100} className="w-20 h-2"/>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <span className="material-icons text-muted-foreground">psychology</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Maître du Mental</h4>
                      <p className="text-sm text-muted-foreground">Complétez 20 analyses Beck</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">0/20</div>
                    <Progress value={0} className="w-20 h-2"/>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="shadow-material" data-testid="card-notifications">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="daily-reminder" className="font-medium">Rappel quotidien</Label>
                    <p className="text-sm text-muted-foreground">Recevez un rappel pour vos exercices quotidiens</p>
                  </div>
                  <Switch id="daily-reminder" checked={notifications.dailyReminder} onCheckedChange={function () { return handleNotificationChange('dailyReminder'); }} data-testid="switch-daily-reminder"/>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="craving-alert" className="font-medium">Alertes craving</Label>
                    <p className="text-sm text-muted-foreground">Notifications d'encouragement lors de pics émotionnels</p>
                  </div>
                  <Switch id="craving-alert" checked={notifications.cravingAlert} onCheckedChange={function () { return handleNotificationChange('cravingAlert'); }} data-testid="switch-craving-alert"/>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="progress-update" className="font-medium">Mises à jour de progression</Label>
                    <p className="text-sm text-muted-foreground">Notifications sur vos accomplissements et badges</p>
                  </div>
                  <Switch id="progress-update" checked={notifications.progressUpdate} onCheckedChange={function () { return handleNotificationChange('progressUpdate'); }} data-testid="switch-progress-update"/>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-report" className="font-medium">Rapport hebdomadaire</Label>
                    <p className="text-sm text-muted-foreground">Résumé de votre semaine d'activité</p>
                  </div>
                  <Switch id="weekly-report" checked={notifications.weeklyReport} onCheckedChange={function () { return handleNotificationChange('weeklyReport'); }} data-testid="switch-weekly-report"/>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-material" data-testid="card-profile-info">
              <CardHeader>
                <CardTitle>Informations Personnelles</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input id="firstName" value={firstName} onChange={function (e) { return setFirstName(e.target.value); }} placeholder="Votre prénom" maxLength={50} data-testid="input-firstName"/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input id="lastName" value={lastName} onChange={function (e) { return setLastName(e.target.value); }} placeholder="Votre nom de famille" maxLength={50} data-testid="input-lastName"/>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email">Email</Label>
                      <Button type="button" variant="ghost" size="sm" onClick={function () { return setIsEditingEmail(!isEditingEmail); }}>
                        {isEditingEmail ? "Annuler" : "Modifier"}
                      </Button>
                    </div>
                    <Input id="email" type="email" value={isEditingEmail ? email : ((user === null || user === void 0 ? void 0 : user.email) || "")} onChange={function (e) { return setEmail(e.target.value); }} disabled={!isEditingEmail} placeholder="votre@email.com"/>
                    {isEditingEmail && (<p className="text-sm text-muted-foreground">
                        Attention : La modification de votre email peut affecter votre connexion.
                      </p>)}
                  </div>
                  <Button type="submit" disabled={updateUserMutation.isPending}>
                    {updateUserMutation.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="shadow-material" data-testid="card-change-password">
              <CardHeader>
                <CardTitle>Changer le mot de passe</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword">Ancien mot de passe</Label>
                    <Input id="oldPassword" type="password" value={oldPassword} onChange={function (e) { return setOldPassword(e.target.value); }} placeholder="Saisissez votre mot de passe actuel" required data-testid="input-old-password"/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <Input id="newPassword" type="password" value={newPassword} onChange={function (e) { return setNewPassword(e.target.value); }} placeholder="Nouveau mot de passe (min. 6 caractères)" minLength={6} required data-testid="input-new-password"/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                    <Input id="confirmPassword" type="password" value={confirmPassword} onChange={function (e) { return setConfirmPassword(e.target.value); }} placeholder="Confirmez votre nouveau mot de passe" minLength={6} required data-testid="input-confirm-password"/>
                  </div>
                  <Button type="submit" disabled={updatePasswordMutation.isPending}>
                    {updatePasswordMutation.isPending ? "Mise à jour..." : "Changer le mot de passe"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data" className="space-y-6">
            <Card className="shadow-material" data-testid="card-data-export">
              <CardHeader>
                <CardTitle>Export de Données</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Téléchargez une copie de toutes vos données personnelles stockées dans l'application.
                </p>
                <Button onClick={exportData} data-testid="button-export-data">
                  <span className="material-icons mr-2">download</span>
                  Exporter mes données
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-material" data-testid="card-data-summary">
              <CardHeader>
                <CardTitle>Résumé des Données</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Données d'activité</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Entrées de craving:</span>
                        <span className="font-medium">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sessions d'exercice:</span>
                        <span className="font-medium">{totalExercises}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Analyses cognitives:</span>
                        <span className="font-medium">3</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-3">Données de progression</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Badges obtenus:</span>
                        <span className="font-medium">{(badges === null || badges === void 0 ? void 0 : badges.length) || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Niveau actuel:</span>
                        <span className="font-medium">{level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Points totaux:</span>
                        <span className="font-medium">{points}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive shadow-material" data-testid="card-data-delete">
              <CardHeader>
                <CardTitle className="text-destructive">Zone de Danger</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Attention : cette action est irréversible et supprimera définitivement toutes vos données.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" data-testid="button-delete-account">
                      <span className="material-icons mr-2">delete_forever</span>
                      Supprimer mon compte
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Toutes vos données seront supprimées de manière permanente :
                        <ul className="mt-2 ml-4 list-disc text-sm">
                          <li>Vos informations personnelles</li>
                          <li>Vos sessions d'exercices</li>
                          <li>Vos entrées de craving</li>
                          <li>Vos analyses cognitives</li>
                          <li>Vos badges et statistiques</li>
                        </ul>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} disabled={deleteAccountMutation.isPending}>
                        {deleteAccountMutation.isPending ? "Suppression..." : "Supprimer"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>);
}
