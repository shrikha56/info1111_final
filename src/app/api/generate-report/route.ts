import { NextResponse } from 'next/server'
import { renderToStream } from '@react-pdf/renderer'
import FinancialReport from '@/app/components/FinancialReport'

export async function GET() {
  try {
    const stream = await renderToStream(FinancialReport())
    const chunks: Uint8Array[] = []
    
    for await (const chunk of stream) {
      if (Buffer.isBuffer(chunk)) {
        chunks.push(chunk)
      }
    }
    
    const buffer = Buffer.concat(chunks)
    
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