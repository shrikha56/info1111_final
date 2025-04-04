import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('📄 PDF Download Request received');
  try {
    // Define the path to the PDF file in the public directory
    const filePath = path.join(process.cwd(), 'public', 'nsw.gov.au-Changes to strata laws.pdf');
    console.log(`🔍 Looking for PDF at path: ${filePath}`);
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
      console.log('✅ PDF file found, reading contents...');
      const fileBuffer = fs.readFileSync(filePath);
      console.log(`📦 PDF file loaded successfully (${fileBuffer.length} bytes)`);

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=nsw.gov.au-Changes to strata laws.pdf',
        },
      });
    }

    console.log('❌ PDF file not found');
    return new NextResponse('PDF not found', { status: 404 });
  } catch (error) {
    console.error('❌ Error serving PDF:', error);
    return new NextResponse('Error serving PDF', { status: 500 });
  }
}
