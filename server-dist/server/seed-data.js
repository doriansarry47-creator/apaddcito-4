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
import { storage } from './storage';
export function seedData() {
    return __awaiter(this, void 0, void 0, function () {
        var exercises, psychoEducationContent, _i, exercises_1, exercise, error_1, _a, psychoEducationContent_1, content, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    exercises = [
                        {
                            title: "Marche rapide",
                            description: "Une marche énergique pour améliorer l'humeur et réduire le stress",
                            category: "cardio",
                            difficulty: "beginner",
                            duration: 20,
                            instructions: "Marchez d'un pas soutenu pendant 20 minutes. Concentrez-vous sur votre respiration et l'environnement qui vous entoure. Maintenez un rythme qui vous permet de parler mais qui vous fait légèrement transpirer.",
                            benefits: "Améliore l'humeur, réduit l'anxiété, augmente l'énergie, favorise la production d'endorphines naturelles",
                            imageUrl: "/images/walking.jpg",
                        },
                        {
                            title: "Exercices de respiration profonde",
                            description: "Techniques de respiration pour calmer l'esprit et réduire l'anxiété",
                            category: "mindfulness",
                            difficulty: "beginner",
                            duration: 10,
                            instructions: "Asseyez-vous confortablement. Inspirez lentement par le nez pendant 4 secondes, retenez votre souffle pendant 4 secondes, puis expirez par la bouche pendant 6 secondes. Répétez 10 fois.",
                            benefits: "Réduit le stress, calme le système nerveux, améliore la concentration, aide à gérer les émotions",
                            imageUrl: "/images/breathing.jpg",
                        },
                        {
                            title: "Étirements matinaux",
                            description: "Séquence d'étirements doux pour commencer la journée",
                            category: "flexibility",
                            difficulty: "beginner",
                            duration: 15,
                            instructions: "Effectuez chaque étirement lentement et maintenez la position pendant 30 secondes. Incluez les bras, le cou, le dos, les jambes. Respirez profondément pendant chaque étirement.",
                            benefits: "Améliore la flexibilité, réduit les tensions musculaires, augmente la circulation sanguine, prépare le corps pour la journée",
                            imageUrl: "/images/stretching.jpg",
                        },
                        {
                            title: "Course légère",
                            description: "Jogging à rythme modéré pour libérer les endorphines",
                            category: "cardio",
                            difficulty: "intermediate",
                            duration: 30,
                            instructions: "Commencez par un échauffement de 5 minutes de marche. Courez à un rythme confortable pendant 20 minutes, puis terminez par 5 minutes de marche de récupération.",
                            benefits: "Libère des endorphines, améliore l'humeur, renforce le système cardiovasculaire, aide à gérer le stress",
                            imageUrl: "/images/jogging.jpg",
                        },
                        {
                            title: "Méditation guidée",
                            description: "Séance de méditation pour la paix intérieure",
                            category: "mindfulness",
                            difficulty: "beginner",
                            duration: 15,
                            instructions: "Asseyez-vous dans un endroit calme. Fermez les yeux et concentrez-vous sur votre respiration. Quand votre esprit divague, ramenez doucement votre attention sur votre souffle.",
                            benefits: "Réduit l'anxiété, améliore la concentration, favorise la relaxation, développe la conscience de soi",
                            imageUrl: "/images/meditation.jpg",
                        },
                        {
                            title: "Pompes modifiées",
                            description: "Exercice de renforcement adapté à tous les niveaux",
                            category: "strength",
                            difficulty: "beginner",
                            duration: 10,
                            instructions: "Commencez par des pompes contre un mur ou sur les genoux. Effectuez 3 séries de 8-12 répétitions avec 1 minute de repos entre les séries.",
                            benefits: "Renforce le haut du corps, améliore la confiance en soi, augmente la force fonctionnelle",
                            imageUrl: "/images/pushups.jpg",
                        },
                        {
                            title: "Yoga doux",
                            description: "Séquence de yoga relaxante pour corps et esprit",
                            category: "flexibility",
                            difficulty: "beginner",
                            duration: 25,
                            instructions: "Enchaînez des postures simples comme la posture de l'enfant, le chat-vache, et la torsion assise. Maintenez chaque posture 30-60 secondes en respirant profondément.",
                            benefits: "Améliore la flexibilité, réduit le stress, favorise la relaxation, renforce la connexion corps-esprit",
                            imageUrl: "/images/yoga.jpg",
                        },
                        {
                            title: "Squats au poids du corps",
                            description: "Exercice de renforcement des jambes et fessiers",
                            category: "strength",
                            difficulty: "intermediate",
                            duration: 12,
                            instructions: "Effectuez 3 séries de 10-15 squats. Descendez comme si vous vous asseyiez sur une chaise, gardez le dos droit et les genoux alignés avec les orteils.",
                            benefits: "Renforce les jambes et fessiers, améliore l'équilibre, augmente la densité osseuse",
                            imageUrl: "/images/squats.jpg",
                        }
                    ];
                    psychoEducationContent = [
                        {
                            title: "Comprendre l'addiction",
                            content: "L'addiction est une maladie chronique du cerveau qui affecte les circuits de r\u00E9compense, de motivation et de m\u00E9moire. Elle se caract\u00E9rise par l'incapacit\u00E9 de s'abstenir de mani\u00E8re constante d'un comportement ou d'une substance, malgr\u00E9 les cons\u00E9quences n\u00E9gatives.\n\n## Les m\u00E9canismes de l'addiction\n\nL'addiction modifie la chimie du cerveau, particuli\u00E8rement dans les zones responsables de :\n- La prise de d\u00E9cision\n- Le contr\u00F4le des impulsions\n- La gestion du stress\n- La r\u00E9gulation \u00E9motionnelle\n\n## Facteurs de risque\n\nPlusieurs facteurs peuvent contribuer au d\u00E9veloppement d'une addiction :\n- Pr\u00E9disposition g\u00E9n\u00E9tique\n- Traumatismes pass\u00E9s\n- Stress chronique\n- Environnement social\n- Troubles mentaux concomitants\n\n## L'importance de la compr\u00E9hension\n\nComprendre que l'addiction est une maladie et non un manque de volont\u00E9 est crucial pour :\n- R\u00E9duire la culpabilit\u00E9 et la honte\n- D\u00E9velopper de la compassion envers soi-m\u00EAme\n- Accepter l'aide professionnelle\n- Maintenir la motivation pour le r\u00E9tablissement",
                            category: "addiction",
                            type: "article",
                            difficulty: "beginner",
                            estimatedReadTime: 8,
                            imageUrl: "/images/brain-addiction.jpg",
                        },
                        {
                            title: "Techniques de gestion du stress",
                            content: "Le stress est souvent un d\u00E9clencheur majeur dans les processus addictifs. Apprendre \u00E0 g\u00E9rer le stress de mani\u00E8re saine est essentiel pour maintenir la sobri\u00E9t\u00E9.\n\n## Techniques de relaxation imm\u00E9diate\n\n### Respiration 4-7-8\n1. Inspirez par le nez pendant 4 secondes\n2. Retenez votre souffle pendant 7 secondes\n3. Expirez par la bouche pendant 8 secondes\n4. R\u00E9p\u00E9tez 4 fois\n\n### Relaxation musculaire progressive\n- Contractez puis rel\u00E2chez chaque groupe musculaire\n- Commencez par les orteils, remontez jusqu'\u00E0 la t\u00EAte\n- Maintenez la contraction 5 secondes, puis rel\u00E2chez\n\n## Strat\u00E9gies \u00E0 long terme\n\n### Exercice physique r\u00E9gulier\n- Lib\u00E8re des endorphines naturelles\n- Am\u00E9liore l'humeur et l'estime de soi\n- R\u00E9duit les hormones de stress\n\n### M\u00E9ditation et pleine conscience\n- D\u00E9veloppe la conscience de soi\n- Am\u00E9liore la r\u00E9gulation \u00E9motionnelle\n- R\u00E9duit l'anxi\u00E9t\u00E9 et la d\u00E9pression\n\n### Sommeil de qualit\u00E9\n- 7-9 heures par nuit\n- Routine de coucher r\u00E9guli\u00E8re\n- Environnement propice au repos",
                            category: "coping",
                            type: "article",
                            difficulty: "beginner",
                            estimatedReadTime: 10,
                            imageUrl: "/images/stress-management.jpg",
                        },
                        {
                            title: "Maintenir la motivation",
                            content: "La motivation fluctue naturellement au cours du processus de r\u00E9tablissement. Voici des strat\u00E9gies pour maintenir votre engagement envers vos objectifs.\n\n## D\u00E9finir des objectifs SMART\n\n### Sp\u00E9cifiques\n- D\u00E9finissez clairement ce que vous voulez accomplir\n- \u00C9vitez les objectifs vagues\n\n### Mesurables\n- \u00C9tablissez des crit\u00E8res pour mesurer vos progr\u00E8s\n- Utilisez des chiffres quand c'est possible\n\n### Atteignables\n- Fixez des objectifs r\u00E9alistes\n- Commencez petit et progressez graduellement\n\n### Pertinents\n- Assurez-vous que vos objectifs correspondent \u00E0 vos valeurs\n- Connectez-les \u00E0 votre vision \u00E0 long terme\n\n### Temporels\n- Fixez des \u00E9ch\u00E9ances claires\n- Divisez les grands objectifs en \u00E9tapes plus petites\n\n## Techniques de motivation\n\n### Visualisation positive\n- Imaginez-vous atteignant vos objectifs\n- Ressentez les \u00E9motions positives associ\u00E9es\n- Pratiquez r\u00E9guli\u00E8rement cette visualisation\n\n### Journal de gratitude\n- Notez 3 choses pour lesquelles vous \u00EAtes reconnaissant chaque jour\n- Concentrez-vous sur les progr\u00E8s, m\u00EAme petits\n- C\u00E9l\u00E9brez vos victoires\n\n### Syst\u00E8me de r\u00E9compenses\n- \u00C9tablissez des r\u00E9compenses saines pour vos accomplissements\n- Variez les types de r\u00E9compenses\n- Assurez-vous qu'elles soutiennent vos objectifs",
                            category: "motivation",
                            type: "article",
                            difficulty: "intermediate",
                            estimatedReadTime: 12,
                            imageUrl: "/images/motivation.jpg",
                        },
                        {
                            title: "Prévention de la rechute",
                            content: "La rechute fait souvent partie du processus de r\u00E9tablissement. Comprendre les signaux d'alarme et avoir un plan peut vous aider \u00E0 maintenir vos progr\u00E8s.\n\n## Signaux d'alarme pr\u00E9coces\n\n### \u00C9motionnels\n- Irritabilit\u00E9 accrue\n- Sentiment d'isolement\n- Anxi\u00E9t\u00E9 ou d\u00E9pression\n- Perte d'int\u00E9r\u00EAt pour les activit\u00E9s\n\n### Comportementaux\n- N\u00E9gligence de l'hygi\u00E8ne personnelle\n- \u00C9vitement des responsabilit\u00E9s\n- Isolement social\n- Arr\u00EAt des activit\u00E9s de r\u00E9tablissement\n\n### Cognitifs\n- Pens\u00E9es obsessionnelles\n- Rationalisation des comportements \u00E0 risque\n- Minimisation des cons\u00E9quences\n- Pens\u00E9e \"tout ou rien\"\n\n## Plan de pr\u00E9vention de la rechute\n\n### Identification des d\u00E9clencheurs\n- Situations \u00E0 haut risque\n- \u00C9motions difficiles\n- Personnes ou lieux probl\u00E9matiques\n- \u00C9tats physiques (fatigue, faim)\n\n### Strat\u00E9gies d'adaptation\n- Techniques de relaxation\n- Exercice physique\n- Contact avec le r\u00E9seau de soutien\n- Activit\u00E9s alternatives saines\n\n### Plan d'urgence\n- Liste de contacts d'urgence\n- Strat\u00E9gies de distraction imm\u00E9diate\n- Lieux s\u00FBrs o\u00F9 se rendre\n- Rappels de vos motivations\n\n## Apr\u00E8s une rechute\n\nSi une rechute survient :\n- Ne vous jugez pas s\u00E9v\u00E8rement\n- Analysez ce qui s'est pass\u00E9\n- Ajustez votre plan de pr\u00E9vention\n- Reprenez vos strat\u00E9gies de r\u00E9tablissement rapidement",
                            category: "relapse_prevention",
                            type: "article",
                            difficulty: "advanced",
                            estimatedReadTime: 15,
                            imageUrl: "/images/relapse-prevention.jpg",
                        }
                    ];
                    _i = 0, exercises_1 = exercises;
                    _b.label = 1;
                case 1:
                    if (!(_i < exercises_1.length)) return [3 /*break*/, 6];
                    exercise = exercises_1[_i];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, storage.createExercise(exercise)];
                case 3:
                    _b.sent();
                    console.log("Exercice cr\u00E9\u00E9: ".concat(exercise.title));
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    console.error("Erreur lors de la cr\u00E9ation de l'exercice ".concat(exercise.title, ":"), error_1);
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    _a = 0, psychoEducationContent_1 = psychoEducationContent;
                    _b.label = 7;
                case 7:
                    if (!(_a < psychoEducationContent_1.length)) return [3 /*break*/, 12];
                    content = psychoEducationContent_1[_a];
                    _b.label = 8;
                case 8:
                    _b.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, storage.createPsychoEducationContent(content)];
                case 9:
                    _b.sent();
                    console.log("Contenu psycho\u00E9ducatif cr\u00E9\u00E9: ".concat(content.title));
                    return [3 /*break*/, 11];
                case 10:
                    error_2 = _b.sent();
                    console.error("Erreur lors de la cr\u00E9ation du contenu ".concat(content.title, ":"), error_2);
                    return [3 /*break*/, 11];
                case 11:
                    _a++;
                    return [3 /*break*/, 7];
                case 12:
                    console.log('Données d\'exemple créées avec succès!');
                    return [2 /*return*/];
            }
        });
    });
}
