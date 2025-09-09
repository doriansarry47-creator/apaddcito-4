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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
var triggers = [
    "Stress", "Ennui", "Solitude", "Conflit", "Fatigue", "Frustration", "Pression sociale", "Nostalgie"
];
var emotions = [
    "Anxiété", "Tristesse", "Colère", "Frustration", "Honte", "Culpabilité", "Vide", "Irritabilité"
];
export function CravingEntry(_a) {
    var _this = this;
    var userId = _a.userId, onSuccess = _a.onSuccess;
    var _b = useState(5), intensity = _b[0], setIntensity = _b[1];
    var _c = useState([]), selectedTriggers = _c[0], setSelectedTriggers = _c[1];
    var _d = useState([]), selectedEmotions = _d[0], setSelectedEmotions = _d[1];
    var _e = useState(""), notes = _e[0], setNotes = _e[1];
    var toast = useToast().toast;
    var queryClient = useQueryClient();
    var createCravingMutation = useMutation({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiRequest("POST", "/api/cravings", data)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        onSuccess: function () {
            toast({
                title: "Craving enregistré",
                description: "Votre craving a été enregistré avec succès.",
            });
            queryClient.invalidateQueries({ queryKey: ["/api/cravings", userId] });
            queryClient.invalidateQueries({ queryKey: ["/api/cravings", userId, "stats"] });
            // Reset form
            setIntensity(5);
            setSelectedTriggers([]);
            setSelectedEmotions([]);
            setNotes("");
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
        },
        onError: function (error) {
            toast({
                title: "Erreur",
                description: "Impossible d'enregistrer le craving. Veuillez réessayer.",
                variant: "destructive",
            });
            console.error("Error creating craving entry:", error);
        },
    });
    var toggleTrigger = function (trigger) {
        setSelectedTriggers(function (prev) {
            return prev.includes(trigger)
                ? prev.filter(function (t) { return t !== trigger; })
                : __spreadArray(__spreadArray([], prev, true), [trigger], false);
        });
    };
    var toggleEmotion = function (emotion) {
        setSelectedEmotions(function (prev) {
            return prev.includes(emotion)
                ? prev.filter(function (e) { return e !== emotion; })
                : __spreadArray(__spreadArray([], prev, true), [emotion], false);
        });
    };
    var handleSubmit = function () {
        createCravingMutation.mutate({
            userId: userId,
            intensity: intensity,
            triggers: selectedTriggers,
            emotions: selectedEmotions,
            notes: notes.trim() || null,
        });
    };
    var getSliderColor = function (value) {
        if (value <= 3)
            return "bg-success";
        if (value <= 6)
            return "bg-warning";
        return "bg-destructive";
    };
    return (<Card className="shadow-material" data-testid="card-craving-entry">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-medium">
          <span className="material-icons mr-2 text-primary">psychology</span>
          Enregistrer un Craving
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Intensity Slider */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Intensité du craving: <span className="font-bold text-primary" data-testid="text-intensity">{intensity}</span>/10
          </label>
          <div className="relative">
            <input type="range" min="0" max="10" value={intensity} onChange={function (e) { return setIntensity(Number(e.target.value)); }} className="w-full h-2 craving-slider rounded-lg cursor-pointer" data-testid="slider-intensity"/>
          </div>
        </div>

        {/* Triggers */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Déclencheurs identifiés</label>
          <div className="flex flex-wrap gap-2">
            {triggers.map(function (trigger) { return (<Button key={trigger} variant={selectedTriggers.includes(trigger) ? "default" : "outline"} size="sm" onClick={function () { return toggleTrigger(trigger); }} className="text-xs" data-testid={"button-trigger-".concat(trigger.toLowerCase())}>
                {trigger}
              </Button>); })}
          </div>
        </div>

        {/* Emotions */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Émotions ressenties</label>
          <div className="flex flex-wrap gap-2">
            {emotions.map(function (emotion) { return (<Button key={emotion} variant={selectedEmotions.includes(emotion) ? "secondary" : "outline"} size="sm" onClick={function () { return toggleEmotion(emotion); }} className="text-xs" data-testid={"button-emotion-".concat(emotion.toLowerCase())}>
                {emotion}
              </Button>); })}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Notes (optionnel)</label>
          <textarea value={notes} onChange={function (e) { return setNotes(e.target.value); }} className="w-full p-3 border border-input rounded-lg resize-none h-20 text-sm bg-background" placeholder="Ajoutez des détails sur votre ressenti ou la situation..." data-testid="textarea-notes"/>
        </div>

        <Button onClick={handleSubmit} disabled={createCravingMutation.isPending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-save-craving">
          {createCravingMutation.isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </CardContent>
    </Card>);
}
