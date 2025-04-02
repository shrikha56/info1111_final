import { NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import FinancialReport from '@/app/components/FinancialReport'

export async function GET() {
  try {
    const buffer = await renderToBuffer(<FinancialReport />);
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=Annual_Financial_Report_2024.pdf',
      },
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return new NextResponse('Error generating PDF', { status: 500 })
  }
} 
