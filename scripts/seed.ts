import "dotenv/config";
import { storage } from '../server/storage.js';
import { AuthService } from '../server/auth.js';
import type { InsertExercise, InsertPsychoEducationContent, InsertUser } from '../shared/schema.js';

export async function seedData() {
  console.log('🌱 Starting seed process...');
  
  // Create admin user if it doesn't exist
  console.log('👤 Checking for admin user...');
  try {
    const existingAdmin = await storage.getUserByEmail('admin@example.com');
    if (!existingAdmin) {
      const hashedPassword = await AuthService.hashPassword('Admin123!');
      const adminUser: InsertUser = {
        email: 'admin@example.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
      };
      await storage.createUser(adminUser);
      console.log('✅ Admin user created: admin@example.com / Admin123!');
    } else {
      console.log('ℹ️  Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }

  // Create demo user if it doesn't exist
  console.log('👤 Checking for demo user...');
  try {
    const existingDemo = await storage.getUserByEmail('demo@example.com');
    if (!existingDemo) {
      const hashedPassword = await AuthService.hashPassword('Demo123!');
      const demoUser: InsertUser = {
        email: 'demo@example.com',
        password: hashedPassword,
        firstName: 'Utilisateur',
        lastName: 'Demo',
        role: 'patient',
      };
      const createdDemo = await storage.createUser(demoUser);
      console.log(`✅ Demo user created: demo@example.com / Demo123! (ID: ${createdDemo.id})`);
      
      // Note: The demo user ID will be auto-generated. If you need a specific ID,
      // you would need to update the user record after creation or modify the schema.
    } else {
      console.log('ℹ️  Demo user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating demo user:', error);
  }

  // Check if exercises table is empty and seed if needed
  console.log('🏃 Checking exercises...');
  try {
    const existingExercises = await storage.getAllExercises();
    if (existingExercises.length === 0) {
      console.log('📝 Seeding base exercises...');
      await seedExercises();
    } else {
      console.log(`ℹ️  Exercises already exist (${existingExercises.length} found)`);
    }
  } catch (error) {
    console.error('❌ Error checking/seeding exercises:', error);
  }

  // Check if psychoeducation content table is empty and seed if needed
  console.log('📚 Checking psychoeducation content...');
  try {
    const existingContent = await storage.getAllPsychoEducationContent();
    if (existingContent.length === 0) {
      console.log('📝 Seeding psychoeducation content...');
      await seedPsychoEducationContent();
    } else {
      console.log(`ℹ️  Psychoeducation content already exists (${existingContent.length} found)`);
    }
  } catch (error) {
    console.error('❌ Error checking/seeding psychoeducation content:', error);
  }

  console.log('🎉 Seed process completed!');
}

async function seedExercises() {
  // Base exercises for therapy
  const exercises: InsertExercise[] = [
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
      title: "Scan corporel",
      description: "Exercice de pleine conscience pour reconnecter avec son corps",
      category: "mindfulness",
      difficulty: "beginner",
      duration: 15,
      instructions: "Allongez-vous confortablement. Portez votre attention sur chaque partie de votre corps, des orteils jusqu'au sommet de la tête. Observez les sensations sans les juger.",
      benefits: "Développe la conscience corporelle, réduit les tensions, favorise la relaxation",
      imageUrl: "/images/body-scan.jpg",
    },
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
      title: "Étirements matinaux",
      description: "Séquence d'étirements doux pour commencer la journée",
      category: "flexibility",
      difficulty: "beginner",
      duration: 15,
      instructions: "Effectuez chaque étirement lentement et maintenez la position pendant 30 secondes. Incluez les bras, le cou, le dos, les jambes. Respirez profondément pendant chaque étirement.",
      benefits: "Améliore la flexibilité, réduit les tensions musculaires, augmente la circulation sanguine, prépare le corps pour la journée",
      imageUrl: "/images/stretching.jpg",
    }
  ];

  // Insert exercises
  for (const exercise of exercises) {
    try {
      await storage.createExercise(exercise);
      console.log(`✅ Exercice créé: ${exercise.title}`);
    } catch (error) {
      console.error(`❌ Erreur lors de la création de l'exercice ${exercise.title}:`, error);
    }
  }
}

async function seedPsychoEducationContent() {
  // Base psychoeducation content
  const psychoEducationContent: InsertPsychoEducationContent[] = [
    {
      title: "Comprendre l'addiction",
      content: `L'addiction est une maladie chronique du cerveau qui affecte les circuits de récompense, de motivation et de mémoire. Elle se caractérise par l'incapacité de s'abstenir de manière constante d'un comportement ou d'une substance, malgré les conséquences négatives.

## Les mécanismes de l'addiction

L'addiction modifie la chimie du cerveau, particulièrement dans les zones responsables de :
- La prise de décision
- Le contrôle des impulsions
- La gestion du stress
- La régulation émotionnelle

## Facteurs de risque

Plusieurs facteurs peuvent contribuer au développement d'une addiction :
- Prédisposition génétique
- Traumatismes passés
- Stress chronique
- Environnement social
- Troubles mentaux concomitants

## L'importance de la compréhension

Comprendre que l'addiction est une maladie et non un manque de volonté est crucial pour :
- Réduire la culpabilité et la honte
- Développer de la compassion envers soi-même
- Accepter l'aide professionnelle
- Maintenir la motivation pour le rétablissement`,
      category: "addiction",
      type: "article",
      difficulty: "beginner",
      estimatedReadTime: 8,
      imageUrl: "/images/brain-addiction.jpg",
    },
    {
      title: "Techniques de gestion du stress",
      content: `Le stress est souvent un déclencheur majeur dans les processus addictifs. Apprendre à gérer le stress de manière saine est essentiel pour maintenir la sobriété.

## Techniques de relaxation immédiate

### Respiration 4-7-8
1. Inspirez par le nez pendant 4 secondes
2. Retenez votre souffle pendant 7 secondes
3. Expirez par la bouche pendant 8 secondes
4. Répétez 4 fois

### Relaxation musculaire progressive
- Contractez puis relâchez chaque groupe musculaire
- Commencez par les orteils, remontez jusqu'à la tête
- Maintenez la contraction 5 secondes, puis relâchez

## Stratégies à long terme

### Exercice physique régulier
- Libère des endorphines naturelles
- Améliore l'humeur et l'estime de soi
- Réduit les hormones de stress

### Méditation et pleine conscience
- Développe la conscience de soi
- Améliore la régulation émotionnelle
- Réduit l'anxiété et la dépression`,
      category: "coping",
      type: "article",
      difficulty: "beginner",
      estimatedReadTime: 10,
      imageUrl: "/images/stress-management.jpg",
    }
  ];

  // Insert psychoeducation content
  for (const content of psychoEducationContent) {
    try {
      await storage.createPsychoEducationContent(content);
      console.log(`✅ Contenu psychoéducatif créé: ${content.title}`);
    } catch (error) {
      console.error(`❌ Erreur lors de la création du contenu ${content.title}:`, error);
    }
  }
}

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedData()
    .then(() => {
      console.log('✅ Seed completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed failed:', error);
      process.exit(1);
    });
}