// Script to insert properties using the insert-property API
// Use import for node-fetch v3+
import fetch from 'node-fetch';


async function insertProperties() {
  try {
    console.log('Inserting properties into Supabase...');
    
    // Properties to insert
    const properties = [
      {
        unit_number: '101',
        address: '123 Sunset Blvd, Sydney, Unit 101'
      },
      {
        unit_number: '102',
        address: '45 Harbour St, Sydney, Unit 102'
      },
      {
        unit_number: '103',
        address: '78 Park Lane, Sydney, Unit 103'
      }
    ];
    
    // Insert each property using the insert-property API
    for (const property of properties) {
      const response = await fetch('http://localhost:3000/api/insert-property', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(property)
      });
      
      const result = await response.json();
      console.log(`Inserted property ${property.unit_number}:`, result);
    }
    
    console.log('Successfully inserted all properties!');
  } catch (error) {
    console.error('Error inserting properties:', error);
  }
}

// Run the function
insertProperties();
