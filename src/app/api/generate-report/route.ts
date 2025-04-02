import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Define the path to the PDF file in the public directory
    const filePath = path.join(process.cwd(), 'public', 'nsw.gov.au-Changes to strata laws.pdf');
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=nsw.gov.au-Changes to strata laws.pdf',
        },
      });
    }

    // Return a 404 error if the file is not found
    return new NextResponse('PDF not found', { status: 404 });
  } catch (error) {
    console.error('Error serving PDF:', error);
    return new NextResponse('Error serving PDF', { status: 500 });
  }
}
