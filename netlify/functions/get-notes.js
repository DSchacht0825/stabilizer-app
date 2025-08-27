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

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    try {
        const response = await fetch(
            `${supabaseUrl}/rest/v1/notes?client_id=eq.${clientId}&order=created_at.desc`,
            {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`
                }
            }
        );

        const notes = await response.json();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, notes })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to load notes' })
        };
    }
};