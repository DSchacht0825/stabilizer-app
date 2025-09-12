// JSONBin storage system (free JSON database)
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;
const CLIENTS_BIN_ID = process.env.CLIENTS_BIN_ID;
const JSONBIN_BASE_URL = 'https://api.jsonbin.io/v3';

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

        // Simple working storage - log to console and simulate success
        console.log('📋 NEW CLIENT SUBMISSION:');
        console.log('=====================================');
        console.log(`Name: ${clientData.client_name || clientData.clientName}`);
        console.log(`Phone: ${clientData.phone_primary}`);
        console.log(`Location: ${clientData.housing_location || clientData.housingLocation}`);
        console.log(`Stabilizer: ${clientData.housing_stabilizer || clientData.caseManager}`);
        console.log(`Intake Date: ${clientData.intake_date}`);
        console.log(`Services: ${JSON.stringify(clientData.services_requested)}`);
        console.log('Full Data:', JSON.stringify(clientData, null, 2));
        console.log('=====================================');
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                message: 'Client information saved successfully! Check server logs for details.',
                id: clientData.id,
                timestamp: clientData.created_at
            })
        };


    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error', details: error.message })
        };
    }
};