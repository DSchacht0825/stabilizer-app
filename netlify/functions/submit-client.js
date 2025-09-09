// Simple fetch-based approach to avoid package issues
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

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

        // Add timestamp
        const clientData = {
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Insert data into Supabase using direct API call
        const response = await fetch(`${supabaseUrl}/rest/v1/clients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(clientData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Supabase error:', errorText);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Database error', details: errorText })
            };
        }

        const insertData = await response.json();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                message: 'Client information saved successfully',
                data: insertData
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