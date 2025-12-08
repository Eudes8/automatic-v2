import { NextResponse } from 'next/server'

export async function GET() {
  const projects = [
    {
      id: 'PROJ-001',
      name: 'Application E-commerce Mobile',
      description: "Développement d'une application mobile native pour la vente en ligne",
      status: 'development',
      progress: 65,
      startDate: '2024-01-15',
      endDate: '2024-04-15',
      budget: 25000,
      spent: 16250,
      team: [
        { id: '1', name: 'Marie Dubois', role: 'Développeur Senior', avatar: 'MD', status: 'online' },
        { id: '2', name: 'Thomas Martin', role: 'UX Designer', avatar: 'TM', status: 'busy' },
        { id: '3', name: 'Sophie Bernard', role: 'Développeur', avatar: 'SB', status: 'online' }
      ],
      milestones: [
        { id: '1', title: 'Design UX/UI', description: 'Maquettes et prototype', status: 'completed', dueDate: '2024-02-01', completedDate: '2024-01-28' },
        { id: '2', title: 'Développement Backend', description: 'API et base de données', status: 'completed', dueDate: '2024-02-15', completedDate: '2024-02-12' },
        { id: '3', title: 'Développement Frontend', description: 'Applications iOS et Android', status: 'in_progress', dueDate: '2024-03-15' },
        { id: '4', title: 'Tests et Recette', description: 'QA et tests utilisateurs', status: 'pending', dueDate: '2024-04-01' }
      ],
      lastUpdate: '2024-03-10T14:30:00Z'
    }
  ]

  return NextResponse.json(projects)
}
