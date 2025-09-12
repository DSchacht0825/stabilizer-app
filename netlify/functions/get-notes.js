exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    const clientId = event.queryStringParameters?.clientId;
    
    if (!clientId) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Client ID required' })
        };
    }

    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || 'patVULqEVYNJyBX8L.f6a8b9c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5';
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appHousingStabilization';
    const AIRTABLE_API_URL = 'https://api.airtable.com/v0';

    try {
        // Fetch notes from Airtable
        try {
            const filterFormula = `{Client ID} = "${clientId}"`;
            const url = `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/Notes?filterByFormula=${encodeURIComponent(filterFormula)}&sort%5B0%5D%5Bfield%5D=Created%20At&sort%5B0%5D%5Bdirection%5D=desc`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_API_KEY}`
                }
            });

            const result = await response.json();
            
            if (!response.ok) {
                console.error('Airtable error:', result);
                throw new Error(`Airtable API error: ${result.error?.message || 'Unknown error'}`);
            }

            // Transform Airtable records to expected format
            const notes = result.records.map(record => ({
                id: record.fields.ID || record.id,
                client_id: record.fields['Client ID'],
                content: record.fields.Content,
                visit_type: record.fields['Visit Type'],
                visitType: record.fields['Visit Type'],
                category: record.fields.Category,
                outcome: record.fields.Outcome,
                next_steps: record.fields['Next Steps'],
                nextSteps: record.fields['Next Steps'],
                stabilizer: record.fields.Stabilizer,
                created_at: record.fields['Created At'],
                airtable_id: record.id
            }));

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true, 
                    notes: notes,
                    message: `Found ${notes.length} note(s) from database`
                })
            };

        } catch (error) {
            console.error('Airtable notes fetch error:', error);
            
            // Return empty array if no notes in database yet
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true, 
                    notes: [],
                    message: 'No notes found - database may be empty or connection failed'
                })
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to load notes' })
        };
    }
};