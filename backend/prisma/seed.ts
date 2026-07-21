import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient, Role, ProjectType, ProjectStatus, NewsStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (process.env.DATABASE_URL) {
  let dbUrl = process.env.DATABASE_URL.trim();
  if (dbUrl.startsWith('DATABASE_URL=')) {
    dbUrl = dbUrl.replace(/^DATABASE_URL=/, '').trim();
  }
  if ((dbUrl.startsWith('"') && dbUrl.endsWith('"')) || (dbUrl.startsWith("'") && dbUrl.endsWith("'"))) {
    dbUrl = dbUrl.slice(1, -1).trim();
  }
  process.env.DATABASE_URL = dbUrl;
}

const prisma = new PrismaClient();


async function main() {
  console.log('🌱 iniciando seed de base de datos ARIONS...');

  // 1. Password Hash
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('Admin2026!', salt);
  const editorPassword = await bcrypt.hash('Editor2026!', salt);
  const supervisorPassword = await bcrypt.hash('Supervisor2026!', salt);

  // 2. Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@arions.tech' },
    update: { name: 'Alejandro Vargas Pérez', avatarUrl: '/alejandro-vargas.jpeg' },
    create: {
      email: 'admin@arions.tech',
      name: 'Alejandro Vargas Pérez',
      password: adminPassword,
      role: Role.ADMIN,
      avatarUrl: '/alejandro-vargas.jpeg'
    }
  });

  const editor = await prisma.user.upsert({
    where: { email: 'editor@arions.tech' },
    update: {},
    create: {
      email: 'editor@arions.tech',
      name: 'Elena Morales',
      password: editorPassword,
      role: Role.EDITOR,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    }
  });

  await prisma.user.upsert({
    where: { email: 'supervisor@arions.tech' },
    update: { name: 'Yordan Medina' },
    create: {
      email: 'supervisor@arions.tech',
      name: 'Yordan Medina',
      password: supervisorPassword,
      role: Role.SUPERVISOR,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
    }
  });

  // 3. News Categories
  const catSoftware = await prisma.newsCategory.upsert({
    where: { slug: 'desarrollo-software' },
    update: {},
    create: { name: 'Desarrollo de Software', slug: 'desarrollo-software', description: 'Innovación en ingeniería de software' }
  });

  const catAI = await prisma.newsCategory.upsert({
    where: { slug: 'inteligencia-artificial' },
    update: {},
    create: { name: 'Inteligencia Artificial', slug: 'inteligencia-artificial', description: 'Soluciones con modelos de IA' }
  });

  const catConstruccion = await prisma.newsCategory.upsert({
    where: { slug: 'obras-y-construccion' },
    update: {},
    create: { name: 'Obras & Construcción', slug: 'obras-y-construccion', description: 'Avances en infraestructura y remodelaciones' }
  });

  // 4. News
  await prisma.news.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'ARIONS implementa arquitectura de Microservicios con Inteligencia Artificial para el sector industrial',
        slug: 'arions-implementa-microservicios-ia-industrial',
        summary: 'Despliegue exitoso de una plataforma de análisis predictivo basado en modelos de IA generativa para optimizar procesos.',
        content: '<p>Nuestra división de <strong>Innovación Tecnológica</strong> ha culminado con éxito el despliegue de una arquitectura de nube híbrida basada en IA. Esta solución permite a nuestros clientes reducir tiempos de parada operativa en un 38%.</p>',
        imageWebp: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        categoryId: catAI.id,
        authorId: admin.id,
        status: NewsStatus.PUBLISHED,
        publishedAt: new Date(),
        tags: ['Inteligencia Artificial', 'IoT', 'Transformación Digital']
      },
      {
        title: 'Finalización de la modernización estructural y bioclimática para centro corporativo',
        slug: 'finalizacion-modernizacion-estructural-bioclimatica',
        summary: 'Ejecución de obra menor y revestimiento metálico termoacústico con certificación de sostenibilidad WCAG y eficiencia energética.',
        content: '<p>Nuestra división de <strong>Construcción y Obras Menores</strong> entregó con éxito la remoción y remodelación de 1.500 m² de fachada corporativa con materiales sustentables.</p>',
        imageWebp: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80',
        categoryId: catConstruccion.id,
        authorId: editor.id,
        status: NewsStatus.PUBLISHED,
        publishedAt: new Date(),
        tags: ['Construcción Metálica', 'Remodelaciones', 'Sostenibilidad']
      }
    ]
  });

  // 5. Projects (Innovation & Construction)
  await prisma.project.createMany({
    skipDuplicates: true,
    data: [
      // Innovation Projects
      {
        title: 'Plataforma IoT de Monitoreo Energético y Sensores Inteligentes',
        slug: 'plataforma-iot-monitoreo-energetico',
        type: ProjectType.INNOVATION,
        category: 'IoT & Edge Computing',
        description: 'Ecosistema de lectura de sensores en tiempo real con alertas tempranas para plantas de manufactura.',
        imageWebp: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80'
        ],
        status: ProjectStatus.COMPLETED,
        technologies: ['React 19', 'Node.js', 'PostgreSQL', 'MQTT', 'Python', 'Websockets'],
        clientName: 'Global Tech Industries',
        location: 'Santiago, Chile',
        budget: 45000,
        progressPercentage: 100,
        isFeatured: true
      },
      {
        title: 'Sistema ERP Nube con Algoritmos de Machine Learning',
        slug: 'sistema-erp-nube-machine-learning',
        type: ProjectType.INNOVATION,
        category: 'Desarrollo de Software',
        description: 'Sistema empresarial integral para gestión de proyectos, cotizaciones y flujos de trabajo.',
        imageWebp: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
        ],
        status: ProjectStatus.IN_PROGRESS,
        technologies: ['TypeScript', 'Express', 'Prisma', 'React 19', 'TailwindCSS'],
        clientName: 'Inversiones Nova',
        location: 'Valparaíso, Chile',
        budget: 68000,
        progressPercentage: 75,
        isFeatured: true
      },
      // Construction Projects
      {
        title: 'Habilitación de Oficinas Corporativas y Pavimentos Técnicos',
        slug: 'habilitacion-oficinas-corporativas-pavimentos',
        type: ProjectType.CONSTRUCTION,
        category: 'Obras Menores & Remodelaciones',
        description: 'Renovación de espacios interiores, pintura industrial, instalaciones eléctricas de alta precisión y red de datos.',
        imageWebp: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
        ],
        status: ProjectStatus.COMPLETED,
        technologies: ['Construcción Metálica', 'Electricidad Industrial', 'Gasfitería', 'Pavimentos'],
        clientName: 'Corporación Andes',
        location: 'Las Condes, Santiago',
        budget: 32000,
        progressPercentage: 100,
        isFeatured: true
      },
      {
        title: 'Instalación de Estructura Metálica y Mantención Preventiva',
        slug: 'instalacion-estructura-metalica-mantencion',
        type: ProjectType.CONSTRUCTION,
        category: 'Construcción Metálica',
        description: 'Diseño, montaje y certificación estructural para centro logístico de distribución.',
        imageWebp: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80'
        ],
        status: ProjectStatus.IN_PROGRESS,
        technologies: ['Soldadura AWS', 'Estructuras Metálicas', 'Pintura Epóxica'],
        clientName: 'Logística Bicentenario',
        location: 'Pudahuel, Santiago',
        budget: 55000,
        progressPercentage: 60,
        isFeatured: true
      }
    ]
  });

  // 6. Clients
  await prisma.client.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Tesla Energy Division', logoWebp: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png', order: 1 },
      { name: 'SpaceX Infrastructure', logoWebp: 'https://upload.wikimedia.org/wikipedia/commons/d/de/SpaceX-Logo.svg', order: 2 },
      { name: 'Autodesk Cloud', logoWebp: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Autodesk_logo.svg', order: 3 },
      { name: 'Microsoft Enterprise', logoWebp: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg', order: 4 },
      { name: 'IBM Quantum', logoWebp: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg', order: 5 }
    ]
  });

  // 7. Testimonials
  await prisma.testimonial.createMany({
    skipDuplicates: true,
    data: [
      {
        authorName: 'Ing. Mateo Silva',
        authorRole: 'Director de Tecnología',
        company: 'Global Industrial Tech',
        avatarWebp: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        quote: 'ARIONS transformó completamente nuestra infraestructura digital. Su equipo combinó rigor técnico y agilidad para entregar soluciones de IA sin contratiempos.',
        rating: 5
      },
      {
        authorName: 'Arq. Sofía Valenzuela',
        authorRole: 'Gerente de Operaciones',
        company: 'Andes Retail Group',
        avatarWebp: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
        quote: 'La ejecución de obras menores y remodelaciones de ARIONS superó nuestras expectativas en tiempos y estándares de calidad.',
        rating: 5
      }
    ]
  });

  // 8. Site Settings
  const existingSetting = await prisma.siteSetting.findFirst();
  if (!existingSetting) {
    await prisma.siteSetting.create({
      data: {
        companyName: 'Arions Builds AI SpA',
        slogan: 'Innovación Tecnológica, Inteligencia Artificial & Construcción',
        logoWebp: '/logo.png',
        contactEmail: 'contacto@arions.tech',
        contactPhone: '+56 9 1234 5678',
        address: 'Av. Providencia 1234, Oficina 501, Santiago, Chile',
        primaryColor: '#0f172a',
        secondaryColor: '#3b82f6',
        socialLinks: {
          linkedin: 'https://linkedin.com/company/arions',
          github: 'https://github.com/arions-tech',
          twitter: 'https://twitter.com/arions_tech',
          instagram: 'https://instagram.com/arions_corp'
        }
      }
    });
  }

  console.log('✅ Seed finalizado exitosamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
