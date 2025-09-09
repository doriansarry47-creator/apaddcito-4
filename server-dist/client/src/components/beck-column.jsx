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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
export function BeckColumn(_a) {
    var _this = this;
    var userId = _a.userId, onSuccess = _a.onSuccess;
    var _b = useState(""), situation = _b[0], setSituation = _b[1];
    var _c = useState(""), automaticThoughts = _c[0], setAutomaticThoughts = _c[1];
    var _d = useState(""), emotions = _d[0], setEmotions = _d[1];
    var _e = useState(5), emotionIntensity = _e[0], setEmotionIntensity = _e[1];
    var _f = useState(""), rationalResponse = _f[0], setRationalResponse = _f[1];
    var _g = useState(""), newFeeling = _g[0], setNewFeeling = _g[1];
    var _h = useState(5), newIntensity = _h[0], setNewIntensity = _h[1];
    var toast = useToast().toast;
    var queryClient = useQueryClient();
    var createBeckAnalysisMutation = useMutation({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiRequest("POST", "/api/beck-analyses", data)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        onSuccess: function () {
            toast({
                title: "Analyse sauvegardée",
                description: "Votre analyse cognitive a été sauvegardée avec succès.",
            });
            queryClient.invalidateQueries({ queryKey: ["/api/beck-analyses", userId] });
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
        },
        onError: function (error) {
            toast({
                title: "Erreur",
                description: "Impossible de sauvegarder l'analyse. Veuillez réessayer.",
                variant: "destructive",
            });
            console.error("Error creating Beck analysis:", error);
        },
    });
    var handleSubmit = function () {
        if (!situation.trim() || !automaticThoughts.trim() || !emotions.trim()) {
            toast({
                title: "Champs manquants",
                description: "Veuillez remplir au moins les 3 premières colonnes.",
                variant: "destructive",
            });
            return;
        }
        createBeckAnalysisMutation.mutate({
            userId: userId,
            situation: situation.trim(),
            automaticThoughts: automaticThoughts.trim(),
            emotions: emotions.trim(),
            emotionIntensity: emotionIntensity,
            rationalResponse: rationalResponse.trim() || null,
            newFeeling: newFeeling.trim() || null,
            newIntensity: newFeeling.trim() ? newIntensity : null,
        });
    };
    var clearForm = function () {
        setSituation("");
        setAutomaticThoughts("");
        setEmotions("");
        setEmotionIntensity(5);
        setRationalResponse("");
        setNewFeeling("");
        setNewIntensity(5);
    };
    return (<Card className="shadow-material" data-testid="card-beck-column">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-medium">
          <span className="material-icons mr-2 text-primary">psychology</span>
          Colonne de Beck - Analyse Cognitive
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Analysez vos pensées et émotions pour mieux comprendre vos réactions.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
          {/* Column 1: Situation */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">1. Situation</label>
            <textarea value={situation} onChange={function (e) { return setSituation(e.target.value); }} className="w-full p-3 border border-input rounded-lg resize-none h-24 text-sm bg-background" placeholder="Décrivez la situation déclenchante..." data-testid="textarea-situation"/>
          </div>

          {/* Column 2: Automatic Thoughts */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">2. Pensées Automatiques</label>
            <textarea value={automaticThoughts} onChange={function (e) { return setAutomaticThoughts(e.target.value); }} className="w-full p-3 border border-input rounded-lg resize-none h-24 text-sm bg-background" placeholder="Quelles pensées vous sont venues spontanément?" data-testid="textarea-thoughts"/>
          </div>

          {/* Column 3: Emotions */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">3. Émotions</label>
            <textarea value={emotions} onChange={function (e) { return setEmotions(e.target.value); }} className="w-full p-3 border border-input rounded-lg resize-none h-20 text-sm bg-background" placeholder="Quelles émotions avez-vous ressenties?" data-testid="textarea-emotions"/>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">Intensité:</span>
              <input type="range" min="1" max="10" value={emotionIntensity} onChange={function (e) { return setEmotionIntensity(Number(e.target.value)); }} className="flex-1 h-1" data-testid="slider-emotion-intensity"/>
              <span className="text-xs font-medium text-primary" data-testid="text-emotion-intensity">
                {emotionIntensity}
              </span>
            </div>
          </div>

          {/* Column 4: Rational Responses */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">4. Réponses Rationnelles</label>
            <textarea value={rationalResponse} onChange={function (e) { return setRationalResponse(e.target.value); }} className="w-full p-3 border border-input rounded-lg resize-none h-24 text-sm bg-background" placeholder="Quelle serait une pensée plus équilibrée?" data-testid="textarea-rational-response"/>
          </div>

          {/* Column 5: Result */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">5. Nouveau Ressenti</label>
            <textarea value={newFeeling} onChange={function (e) { return setNewFeeling(e.target.value); }} className="w-full p-3 border border-input rounded-lg resize-none h-20 text-sm bg-background" placeholder="Comment vous sentez-vous maintenant?" data-testid="textarea-new-feeling"/>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">Nouvelle intensité:</span>
              <input type="range" min="1" max="10" value={newIntensity} onChange={function (e) { return setNewIntensity(Number(e.target.value)); }} className="flex-1 h-1" data-testid="slider-new-intensity"/>
              <span className="text-xs font-medium text-secondary" data-testid="text-new-intensity">
                {newIntensity}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={clearForm} data-testid="button-clear-beck">
            Effacer
          </Button>
          <Button onClick={handleSubmit} disabled={createBeckAnalysisMutation.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-save-beck">
            {createBeckAnalysisMutation.isPending ? "Sauvegarde..." : "Sauvegarder l'Analyse"}
          </Button>
        </div>
      </CardContent>
    </Card>);
}
