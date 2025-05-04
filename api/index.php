<?php

// Set headers to prevent caching
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// Set content type
header('Content-Type: text/html; charset=utf-8');

// Sample strata management data
$properties = [
    [
        'id' => 'prop-001',
        'name' => 'Sunset Heights',
        'address' => '123 Sunset Blvd, Sydney, NSW 2000',
        'units' => 24,
        'maintenance_requests' => 3,
        'last_inspection' => '2025-04-15'
    ],
    [
        'id' => 'prop-002',
        'name' => 'Harbour View Apartments',
        'address' => '45 Harbour St, Sydney, NSW 2000',
        'units' => 36,
        'maintenance_requests' => 5,
        'last_inspection' => '2025-04-22'
    ],
    [
        'id' => 'prop-003',
        'name' => 'Parkside Residences',
        'address' => '78 Park Lane, Sydney, NSW 2010',
        'units' => 18,
        'maintenance_requests' => 1,
        'last_inspection' => '2025-04-28'
    ]
];

// Get property details by ID (simulating an API endpoint)
function get_property_details($property_id) {
    global $properties;
    
    foreach ($properties as $property) {
        if ($property['id'] === $property_id) {
            return $property;
        }
    }
    
    return null;
}

// Handle API-like requests
$property_id = isset($_GET['property_id']) ? $_GET['property_id'] : null;
$property_details = null;

if ($property_id) {
    $property_details = get_property_details($property_id);
}

// Sample PHP page
echo '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Strata Management Portal</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        .container {
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        h1, h2, h3 {
            color: #7f1d1d;  /* Burgundy color to match your site theme */
        }
        .info-box {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        tr:hover {
            background-color: #f5f5f5;
        }
        .button {
            display: inline-block;
            background-color: #7f1d1d;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            font-size: 14px;
        }
        .button:hover {
            background-color: #5e1515;
        }
        .property-card {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Strata Management Portal</h1>
        <p>PHP-based strata management interface running on Vercel</p>
        <div class="mt-4">
            <a href="/" class="button">Return to Main Dashboard</a>
        </div>
        
        <div class="info-box">
            <h2>Properties Overview</h2>';

if ($property_details) {
    // Display single property details
    echo '
            <div class="property-card">
                <h3>' . htmlspecialchars($property_details['name']) . '</h3>
                <p><strong>Address:</strong> ' . htmlspecialchars($property_details['address']) . '</p>
                <p><strong>Units:</strong> ' . htmlspecialchars($property_details['units']) . '</p>
                <p><strong>Pending Maintenance Requests:</strong> ' . htmlspecialchars($property_details['maintenance_requests']) . '</p>
                <p><strong>Last Inspection:</strong> ' . htmlspecialchars($property_details['last_inspection']) . '</p>
                <a href="?" class="button">Back to All Properties</a>
            </div>';
} else {
    // Display all properties
    echo '
            <table>
                <thead>
                    <tr>
                        <th>Property Name</th>
                        <th>Address</th>
                        <th>Units</th>
                        <th>Maintenance</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>';
    
    foreach ($properties as $property) {
        echo '
                    <tr>
                        <td>' . htmlspecialchars($property['name']) . '</td>
                        <td>' . htmlspecialchars($property['address']) . '</td>
                        <td>' . htmlspecialchars($property['units']) . '</td>
                        <td>' . htmlspecialchars($property['maintenance_requests']) . ' requests</td>
                        <td><a href="?property_id=' . htmlspecialchars($property['id']) . '" class="button">View Details</a></td>
                    </tr>';
    }
    
    echo '
                </tbody>
            </table>';
}

echo '
        </div>
        
        <div class="info-box">
            <h2>System Information</h2>
            <p><strong>PHP Version:</strong> ' . phpversion() . '</p>
            <p><strong>Server Time:</strong> ' . date('Y-m-d H:i:s') . '</p>
            <p><strong>Server Software:</strong> ' . $_SERVER['SERVER_SOFTWARE'] . '</p>
        </div>
    </div>
</body>
</html>';
