import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
export function GamificationProgress(_a) {
    var userId = _a.userId;
    var _b = useQuery({
        queryKey: ["/api/users", userId],
        initialData: { level: 1, points: 0, email: '', password: '', firstName: '', lastName: '', profileImageUrl: '', role: '', isActive: true, id: '', createdAt: new Date(), updatedAt: new Date() },
    }), user = _b.data, userLoading = _b.isLoading;
    var _c = useQuery({
        queryKey: ["/api/users", userId, "stats"],
        initialData: { exercisesCompleted: 0, totalDuration: 0, currentStreak: 0, longestStreak: 0, averageCraving: 0, id: '', userId: '', updatedAt: new Date() },
    }), userStats = _c.data, statsLoading = _c.isLoading;
    var _d = useQuery({
        queryKey: ["/api/users", userId, "badges"],
        initialData: [],
    }), badges = _d.data, badgesLoading = _d.isLoading;
    var isLoading = userLoading || statsLoading || badgesLoading;
    if (isLoading) {
        return (<Card className="shadow-material animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-2 bg-muted rounded"></div>
            <div className="flex space-x-2">
              <div className="w-10 h-10 bg-muted rounded-full"></div>
              <div className="w-10 h-10 bg-muted rounded-full"></div>
              <div className="w-10 h-10 bg-muted rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>);
    }
    var level = (user === null || user === void 0 ? void 0 : user.level) || 1;
    var points = (user === null || user === void 0 ? void 0 : user.points) || 0;
    var exercisesCompleted = (userStats === null || userStats === void 0 ? void 0 : userStats.exercisesCompleted) || 0;
    var currentLevelProgress = points % 100;
    var nextLevelPoints = 100 - currentLevelProgress;
    var getBadgeInfo = function (badgeType) {
        switch (badgeType) {
            case '7_days':
                return { icon: 'star', name: '7 jours', color: 'bg-warning' };
            case '50_exercises':
                return { icon: 'fitness_center', name: '50 exercices', color: 'bg-success' };
            case 'craving_reduction':
                return { icon: 'trending_down', name: 'Moins de cravings', color: 'bg-primary' };
            default:
                return { icon: 'emoji_events', name: 'Badge', color: 'bg-muted' };
        }
    };
    var weeklyChallenge = {
        description: "Complétez 5 exercices de respiration cette semaine",
        progress: Math.min(60, (exercisesCompleted * 20) % 100), // Mock progress
        current: Math.min(3, exercisesCompleted % 5),
        target: 5,
        reward: "50 pts"
    };
    return (<Card className="shadow-material" data-testid="card-gamification">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-medium">
          <span className="material-icons mr-2 text-warning">emoji_events</span>
          Progression et Récompenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Level Progress */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Niveau Actuel</span>
              <span className="text-sm text-muted-foreground" data-testid="text-current-level">
                Niveau {level}
              </span>
            </div>
            <Progress value={currentLevelProgress} className="h-3 mb-3" data-testid="progress-level"/>
            <p className="text-xs text-muted-foreground" data-testid="text-next-level">
              {nextLevelPoints} points pour le niveau {level + 1}
            </p>
          </div>

          {/* Recent Badges */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Badges Récents</h4>
            <div className="flex space-x-2">
              {badges && badges.length > 0 ? (badges.slice(0, 3).map(function (badge, index) {
            var badgeInfo = getBadgeInfo(badge.badgeType);
            return (<div key={badge.id} className="flex flex-col items-center space-y-1" data-testid={"badge-".concat(badge.badgeType)}>
                      <div className={"w-10 h-10 ".concat(badgeInfo.color, " rounded-full flex items-center justify-center")}>
                        <span className="material-icons text-white text-sm">
                          {badgeInfo.icon}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {badgeInfo.name}
                      </span>
                    </div>);
        })) : (<div className="text-sm text-muted-foreground" data-testid="text-no-badges">
                  Complétez des exercices pour gagner des badges !
                </div>)}
            </div>
          </div>
        </div>

        {/* Weekly Challenge */}
        <div className="p-4 bg-gradient-to-r from-secondary to-green-600 rounded-xl text-white" data-testid="card-weekly-challenge">
          <h4 className="font-medium mb-2">Défi de la Semaine</h4>
          <p className="text-sm mb-3 opacity-90" data-testid="text-challenge-description">
            {weeklyChallenge.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-white bg-opacity-30 rounded-full h-2">
                <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: "".concat(weeklyChallenge.progress, "%") }} data-testid="progress-challenge"></div>
              </div>
              <span className="text-sm font-medium" data-testid="text-challenge-progress">
                {weeklyChallenge.current}/{weeklyChallenge.target}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <span className="material-icons text-sm mr-1">emoji_events</span>
              <span data-testid="text-challenge-reward">{weeklyChallenge.reward}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>);
}
