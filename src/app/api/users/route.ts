import { NextRequest, NextResponse } from 'next/server';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'resident' | 'manager';
  unit?: string;
}

// In-memory store (replace with database in production)
let users: User[] = [
  {
    id: 'user-001',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'resident',
    unit: '101'
  },
  {
    id: 'user-002',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');
  
  if (role) {
    return NextResponse.json(users.filter(user => user.role === role));
  }
  
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const newUser: User = {
      id: `user-${String(users.length + 1).padStart(3, '0')}`,
      name: data.name,
      email: data.email,
      role: data.role,
      unit: data.unit
    };

    users.push(newUser);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const user = users.find(u => u.id === data.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    Object.assign(user, data);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 400 }
    );
  }
}
