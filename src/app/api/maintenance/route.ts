import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Priority, RequestStatus } from '@prisma/client';

export async function GET() {
  try {
    const maintenanceRequests = await prisma.maintenanceRequest.findMany({
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        property: {
          select: {
            id: true,
            unitNumber: true,
            address: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(maintenanceRequests);
  } catch (error) {
    console.error('Failed to fetch maintenance requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch maintenance requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Convert priority string to enum value
    const priorityValue = data.priority.toUpperCase() as Priority;
    
    const newRequest = await prisma.maintenanceRequest.create({
      data: {
        title: data.title,
        description: data.description,
        priority: priorityValue,
        status: RequestStatus.PENDING,
        requester: {
          connect: { id: data.requesterId }
        },
        property: {
          connect: { id: data.propertyId }
        },
        images: data.images || []
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        property: true
      }
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error('Failed to create maintenance request:', error);
    return NextResponse.json(
      { error: 'Failed to create maintenance request' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Check if request exists
    const existingRequest = await prisma.maintenanceRequest.findUnique({
      where: { id: data.id }
    });
    
    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Maintenance request not found' },
        { status: 404 }
      );
    }

    // Convert status and priority strings to enum values if provided
    let updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.description) updateData.description = data.description;
    if (data.status) updateData.status = data.status.toUpperCase();
    if (data.priority) updateData.priority = data.priority.toUpperCase();
    if (data.assigneeId) updateData.assignee = { connect: { id: data.assigneeId } };
    if (data.completedAt) updateData.completedAt = new Date(data.completedAt);
    
    const updatedRequest = await prisma.maintenanceRequest.update({
      where: { id: data.id },
      data: updateData,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        property: true
      }
    });
    
    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('Failed to update maintenance request:', error);
    return NextResponse.json(
      { error: 'Failed to update maintenance request' },
      { status: 400 }
    );
  }
}

// Add a DELETE function to delete maintenance requests
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Maintenance request ID is required' },
        { status: 400 }
      );
    }
    
    // Check if request exists
    const existingRequest = await prisma.maintenanceRequest.findUnique({
      where: { id }
    });
    
    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Maintenance request not found' },
        { status: 404 }
      );
    }
    
    // Delete the request
    await prisma.maintenanceRequest.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete maintenance request:', error);
    return NextResponse.json(
      { error: 'Failed to delete maintenance request' },
      { status: 500 }
    );
  }
}
