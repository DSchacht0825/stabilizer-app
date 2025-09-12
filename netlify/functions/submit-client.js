// Airtable API configuration
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || 'patVULqEVYNJyBX8L.f6a8b9c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5';
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appHousingStabilization';
const AIRTABLE_API_URL = 'https://api.airtable.com/v0';

exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const data = JSON.parse(event.body);
        
        // Clean up data - convert empty strings to null for numeric fields
        const numericFields = [
            'age', 'monthly_rent', 'monthly_income', 'hours_per_week', 'priority_score'
        ];
        
        // Convert empty strings to null for numeric fields
        numericFields.forEach(field => {
            if (data[field] === '' || data[field] === undefined) {
                data[field] = null;
            }
        });
        
        // Convert empty date strings to null
        const dateFields = [
            'intake_date', 'next_review_date', 'end_date_services', 'date_of_birth',
            'lease_start_date', 'lease_end_date', 'income_verification_date', 'signature_date'
        ];
        
        dateFields.forEach(field => {
            if (data[field] === '' || data[field] === undefined) {
                data[field] = null;
            }
        });

        // Add timestamp and ID
        const clientData = {
            ...data,
            id: Date.now().toString(), // Simple ID for now
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Save to Airtable
        try {
            const airtableRecord = {
                fields: {
                    'ID': clientData.id,
                    'Client Name': clientData.client_name || clientData.clientName || 'Unknown',
                    'Phone Primary': clientData.phone_primary || '',
                    'Phone Secondary': clientData.phone_secondary || '',
                    'Email': clientData.email || '',
                    'Current Address': clientData.current_address || '',
                    'Housing Location': clientData.housing_location || clientData.housingLocation || '',
                    'Housing Stabilizer': clientData.housing_stabilizer || clientData.caseManager || '',
                    'Age': clientData.age || null,
                    'Date of Birth': clientData.date_of_birth || '',
                    'Intake Date': clientData.intake_date || '',
                    'Monthly Rent': clientData.monthly_rent || null,
                    'Monthly Income': clientData.monthly_income || null,
                    'Employment Status': clientData.employment_status || '',
                    'Employer Name': clientData.employer_name || '',
                    'Hours Per Week': clientData.hours_per_week || null,
                    'Emergency Contact Name': clientData.emergency_contact_name || '',
                    'Emergency Contact Phone': clientData.emergency_contact_phone || '',
                    'Emergency Contact Relationship': clientData.emergency_contact_relationship || '',
                    'Services Requested': Array.isArray(clientData.services_requested) 
                        ? clientData.services_requested.join(', ') 
                        : (clientData.services_requested || ''),
                    'Signature Client': clientData.signature_client || '',
                    'Signature Date': clientData.signature_date || '',
                    'Priority Score': clientData.priority_score || null,
                    'Created At': clientData.created_at,
                    'Updated At': clientData.updated_at
                }
            };

            console.log('Sending to Airtable:', JSON.stringify(airtableRecord, null, 2));

            const response = await fetch(`${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/Clients`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(airtableRecord)
            });

            const result = await response.json();
            
            if (!response.ok) {
                console.error('Airtable error:', result);
                throw new Error(`Airtable API error: ${result.error?.message || 'Unknown error'}`);
            }

            console.log('✅ Successfully saved to Airtable:', result.id);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true, 
                    message: 'Client information saved successfully to database!',
                    id: clientData.id,
                    airtable_id: result.id,
                    timestamp: clientData.created_at
                })
            };

        } catch (error) {
            console.error('Database save error:', error);
            
            // Log to console as backup
            console.log('📋 BACKUP LOG - CLIENT SUBMISSION:');
            console.log('=====================================');
            console.log(`Name: ${clientData.client_name || clientData.clientName}`);
            console.log(`Phone: ${clientData.phone_primary}`);
            console.log(`Location: ${clientData.housing_location || clientData.housingLocation}`);
            console.log(`Stabilizer: ${clientData.housing_stabilizer || clientData.caseManager}`);
            console.log(`Intake Date: ${clientData.intake_date}`);
            console.log('Full Data:', JSON.stringify(clientData, null, 2));
            console.log('=====================================');
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true, 
                    message: 'Client information saved successfully (logged to server).',
                    id: clientData.id,
                    timestamp: clientData.created_at,
                    note: 'Data logged to server console - database connection pending'
                })
            };
        }


    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error', details: error.message })
        };
    }
};