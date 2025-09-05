import { getDb } from './db.js';
import { exercises, psychoEducationContent, users } from '@shared/schema.js';
import { AuthService } from './auth.js';

export async function seedDatabase() {
  const db = getDb();
  
  console.log('🌱 Seeding database...');

  try {
    // Create default admin user if doesn't exist
    const existingAdmin = await AuthService.getUserByEmail('admin@apaddicto.com');
    if (!existingAdmin) {
      await AuthService.createUser({
        email: 'admin@apaddicto.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'Apaddicto',
        role: 'admin'
      });
      console.log('✅ Admin user created');
    }

    // Seed exercises
    const existingExercises = await db.select().from(exercises).limit(1);
    if (existingExercises.length === 0) {
      await db.insert(exercises).values([
        {
          title: 'Exercice de respiration profonde',
          description: 'Technique de respiration pour réduire le stress et l\'anxiété',
          category: 'relaxation',
          difficulty: 'débutant',
          duration: 5,
          instructions: 'Asseyez-vous confortablement. Inspirez lentement par le nez pendant 4 secondes, retenez votre souffle pendant 4 secondes, puis expirez par la bouche pendant 6 secondes. Répétez 10 fois.',
          benefits: 'Réduit le stress, améliore la concentration, calme le système nerveux'
        },
        {
          title: 'Marche méditative',
          description: 'Combinez activité physique douce et pleine conscience',
          category: 'activité physique',
          difficulty: 'débutant',
          duration: 15,
          instructions: 'Marchez lentement et délibérément. Concentrez-vous sur chaque pas, la sensation de vos pieds touchant le sol. Observez votre environnement sans jugement.',
          benefits: 'Améliore l\'humeur, réduit les ruminations, augmente la pleine conscience'
        },
        {
          title: 'Étirements matinaux',
          description: 'Routine d\'étirements pour commencer la journée',
          category: 'mobilité',
          difficulty: 'débutant',
          duration: 10,
          instructions: 'Étirez doucement votre cou, vos épaules, votre dos et vos jambes. Maintenez chaque étirement pendant 15-30 secondes.',
          benefits: 'Améliore la flexibilité, réduit la tension musculaire, augmente l\'énergie'
        },
        {
          title: 'Relaxation musculaire progressive',
          description: 'Technique de relaxation pour relâcher les tensions',
          category: 'relaxation',
          difficulty: 'intermédiaire',
          duration: 20,
          instructions: 'Allongez-vous confortablement. Contractez puis relâchez chaque groupe musculaire, en commençant par les pieds et remontant vers la tête.',
          benefits: 'Réduit la tension physique, améliore le sommeil, diminue l\'anxiété'
        }
      ]);
      console.log('✅ Exercises seeded');
    }

    // Seed psycho-education content
    const existingContent = await db.select().from(psychoEducationContent).limit(1);
    if (existingContent.length === 0) {
      await db.insert(psychoEducationContent).values([
        {
          title: 'Comprendre l\'addiction',
          content: 'L\'addiction est une maladie chronique qui affecte les circuits de récompense, de motivation et de mémoire du cerveau. Elle se caractérise par l\'incapacité de s\'abstenir de façon constante, l\'altération du contrôle comportemental, la recherche compulsive et l\'usage continu malgré les conséquences néfastes.',
          category: 'éducation'
        },
        {
          title: 'Les bienfaits de l\'activité physique',
          content: 'L\'exercice physique régulier stimule la production d\'endorphines, améliore l\'humeur et réduit le stress. Il aide également à restructurer le cerveau, en renforçant les circuits de récompense naturels et en réduisant les envies compulsives.',
          category: 'sport thérapie'
        },
        {
          title: 'Techniques de gestion du stress',
          content: 'La gestion du stress est cruciale dans le processus de rétablissement. Les techniques incluent la respiration profonde, la méditation, l\'activité physique, et la restructuration cognitive. Ces méthodes aident à développer des mécanismes d\'adaptation sains.',
          category: 'bien-être'
        },
        {
          title: 'Construire un réseau de soutien',
          content: 'Un réseau de soutien solide est essentiel pour le rétablissement. Il peut inclure la famille, les amis, les professionnels de la santé, et les groupes de soutien. Ces relations offrent encouragement, responsabilisation et compréhension.',
          category: 'social'
        }
      ]);
      console.log('✅ Psycho-education content seeded');
    }

    console.log('🌱 Database seeding completed successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}