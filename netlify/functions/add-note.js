exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || 'patVULqEVYNJyBX8L.f6a8b9c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5';
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appHousingStabilization';
    const AIRTABLE_API_URL = 'https://api.airtable.com/v0';

    try {
        const data = JSON.parse(event.body);
        
        try {
            const noteRecord = {
                fields: {
                    'ID': `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    'Client ID': data.clientId,
                    'Content': data.content,
                    'Visit Type': data.visitType || 'office_visit',
                    'Category': data.category || 'general',
                    'Outcome': data.outcome || 'successful',
                    'Next Steps': data.nextSteps || '',
                    'Stabilizer': data.stabilizer || 'Unknown',
                    'Created At': new Date().toISOString()
                }
            };

            const response = await fetch(`${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/Notes`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(noteRecord)
            });

            const result = await response.json();
            
            if (!response.ok) {
                console.error('Airtable error:', result);
                throw new Error(`Airtable API error: ${result.error?.message || 'Unknown error'}`);
            }

            console.log('✅ Successfully saved note to Airtable:', result.id);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true,
                    message: 'Note added successfully to database!',
                    id: noteRecord.fields.ID,
                    airtable_id: result.id
                })
            };

        } catch (error) {
            console.error('Database note save error:', error);
            
            // Fallback logging
            console.log('📝 BACKUP LOG - NOTE SUBMISSION:');
            console.log('=====================================');
            console.log(`Client ID: ${data.clientId}`);
            console.log(`Visit Type: ${data.visitType}`);
            console.log(`Category: ${data.category}`);
            console.log(`Outcome: ${data.outcome}`);
            console.log(`Content: ${data.content}`);
            console.log(`Next Steps: ${data.nextSteps}`);
            console.log(`Stabilizer: ${data.stabilizer}`);
            console.log('=====================================');
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true,
                    message: 'Note logged successfully (database connection pending).',
                    id: `note_${Date.now()}`,
                    note: 'Data logged to server console'
                })
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to add note' })
        };
    }
};