import { NextRequest, NextResponse } from 'next/server';

// Type for maintenance request
interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  unit: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  category: string;
  date: string;
}

// In-memory store (replace with database in production)
let maintenanceRequests: MaintenanceRequest[] = [];

export async function GET() {
  return NextResponse.json(maintenanceRequests);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const newRequest: MaintenanceRequest = {
      id: `MR-${String(maintenanceRequests.length + 1).padStart(3, '0')}`,
      title: data.title,
      description: data.description,
      unit: data.unit,
      status: 'pending',
      priority: data.priority,
      category: data.category,
      date: new Date().toISOString().split('T')[0]
    };

    maintenanceRequests.unshift(newRequest);
    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create maintenance request' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const index = maintenanceRequests.findIndex(req => req.id === data.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Maintenance request not found' },
        { status: 404 }
      );
    }

    maintenanceRequests[index] = { ...maintenanceRequests[index], ...data };
    return NextResponse.json(maintenanceRequests[index]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update maintenance request' },
      { status: 400 }
    );
  }
}
