import { NextRequest, NextResponse } from 'next/server';

interface Payment {
  id: string;
  userId: string;
  amount: number;
  type: 'strata' | 'maintenance' | 'special_levy';
  status: 'pending' | 'completed' | 'failed';
  dueDate?: string;
  paidAt?: string;
}

// In-memory store (replace with database in production)
let payments: Payment[] = [
  {
    id: 'pay-001',
    userId: 'user-001',
    amount: 500,
    type: 'strata',
    status: 'completed',
    dueDate: '2025-04-15T00:00:00Z',
    paidAt: '2025-04-01T10:30:00Z'
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');
  
  let filteredPayments = [...payments];
  
  if (userId) {
    filteredPayments = filteredPayments.filter(p => p.userId === userId);
  }
  
  if (status) {
    filteredPayments = filteredPayments.filter(p => p.status === status);
  }

  return NextResponse.json(filteredPayments);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const newPayment: Payment = {
      id: `pay-${String(payments.length + 1).padStart(3, '0')}`,
      userId: data.userId,
      amount: data.amount,
      type: data.type,
      status: 'pending',
      dueDate: data.dueDate
    };

    payments.push(newPayment);
    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const payment = payments.find(p => p.id === data.id);
    
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    if (data.status === 'completed' && payment.status === 'pending') {
      payment.paidAt = new Date().toISOString();
    }

    Object.assign(payment, data);
    return NextResponse.json(payment);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update payment' },
      { status: 400 }
    );
  }
}
