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
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLoginMutation, useRegisterMutation, useAuthQuery } from "@/hooks/use-auth";
import { Instagram } from "lucide-react";
export default function Login() {
    var _this = this;
    var _a = useLocation(), setLocation = _a[1];
    var toast = useToast().toast;
    var _b = useAuthQuery(), user = _b.data, isLoading = _b.isLoading;
    var _c = useState({
        email: "",
        password: "",
    }), loginForm = _c[0], setLoginForm = _c[1];
    var _d = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "patient",
    }), registerForm = _d[0], setRegisterForm = _d[1];
    var loginMutation = useLoginMutation();
    var registerMutation = useRegisterMutation();
    // ✅ Redirection uniquement si l'utilisateur est connecté
    useEffect(function () {
        if (user && !isLoading) {
            // Redirection vers la page d'accueil (Dashboard) après un court délai pour s'assurer du rendu
            var timer_1 = setTimeout(function () {
                setLocation("/");
            }, 100); // Délai de 100ms
            return function () { return clearTimeout(timer_1); };
        }
    }, [user, isLoading, setLocation]);
    var handleLogin = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, loginMutation.mutateAsync(loginForm)];
                case 2:
                    _a.sent();
                    toast({
                        title: "Connexion réussie",
                        description: "Bienvenue dans votre espace thérapeutique",
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    toast({
                        title: "Erreur de connexion",
                        description: error_1 instanceof Error ? error_1.message : "Vérifiez vos identifiants",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleRegister = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, registerMutation.mutateAsync(registerForm)];
                case 2:
                    _a.sent();
                    toast({
                        title: "Inscription réussie",
                        description: "Votre compte a été créé avec succès",
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    toast({
                        title: "Erreur d'inscription",
                        description: error_2 instanceof Error ? error_2.message : "Vérifiez vos informations",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Apaddicto</h1>
          <p className="text-gray-600">Votre parcours de bien-être commence ici</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Accès à votre espace</CardTitle>
            <CardDescription>
              Connectez-vous ou créez votre compte pour accéder à vos exercices et contenus personnalisés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="register">Inscription</TabsTrigger>
              </TabsList>

              {/* ✅ FORMULAIRE DE CONNEXION */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" type="email" placeholder="votre@email.com" value={loginForm.email} onChange={function (e) {
            return setLoginForm(__assign(__assign({}, loginForm), { email: e.target.value }));
        }} required/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <Input id="login-password" type="password" value={loginForm.password} onChange={function (e) {
            return setLoginForm(__assign(__assign({}, loginForm), { password: e.target.value }));
        }} required/>
                  </div>
                  <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                    {loginMutation.isPending ? "Connexion..." : "Se connecter"}
                  </Button>
                </form>
              </TabsContent>

              {/* ✅ FORMULAIRE D'INSCRIPTION */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-firstName">Prénom</Label>
                      <Input id="register-firstName" type="text" value={registerForm.firstName} onChange={function (e) {
            return setRegisterForm(__assign(__assign({}, registerForm), { firstName: e.target.value }));
        }}/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-lastName">Nom</Label>
                      <Input id="register-lastName" type="text" value={registerForm.lastName} onChange={function (e) {
            return setRegisterForm(__assign(__assign({}, registerForm), { lastName: e.target.value }));
        }}/>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input id="register-email" type="email" placeholder="votre@email.com" value={registerForm.email} onChange={function (e) {
            return setRegisterForm(__assign(__assign({}, registerForm), { email: e.target.value }));
        }} required/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Mot de passe</Label>
                    <Input id="register-password" type="password" value={registerForm.password} onChange={function (e) {
            return setRegisterForm(__assign(__assign({}, registerForm), { password: e.target.value }));
        }} required/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-role">Rôle (patient ou admin)</Label>
                    <Input id="register-role" type="text" value={registerForm.role} onChange={function (e) {
            return setRegisterForm(__assign(__assign({}, registerForm), { role: e.target.value }));
        }}/>
                  </div>
                  <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                    {registerMutation.isPending ? "Création..." : "Créer mon compte"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* ✅ LIEN INSTAGRAM */}
        <div className="mt-6 text-center">
          <a href="https://instagram.com/apaperigueux" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
            <Instagram size={20}/>
            <span>Suivez-nous sur Instagram @apaperigueux</span>
          </a>
        </div>
      </div>
    </div>);
}
