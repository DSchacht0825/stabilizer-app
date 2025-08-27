exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    const searchTerm = event.queryStringParameters?.search || '';
    const dateField = event.queryStringParameters?.dateField || 'created_at';
    const dateFrom = event.queryStringParameters?.dateFrom || '';
    const dateTo = event.queryStringParameters?.dateTo || '';
    
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    try {
        let query = '';
        let conditions = [];
        
        // Add search term condition
        if (searchTerm) {
            conditions.push(`or=("clientName".ilike.*${searchTerm}*,"housingLocation".ilike.*${searchTerm}*)`);
        }
        
        // Add date range conditions
        if (dateFrom) {
            conditions.push(`"${dateField}".gte.${dateFrom}`);
        }
        if (dateTo) {
            conditions.push(`"${dateField}".lte.${dateTo}`);
        }
        
        // Build the query string
        if (conditions.length > 0) {
            query = conditions.join('&') + '&order="clientName"';
        } else {
            query = 'order="clientName"&limit=20';
        }
            
        const response = await fetch(
            `${supabaseUrl}/rest/v1/clients?${query}`,
            {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`
                }
            }
        );

        const clients = await response.json();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, clients })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Search failed' })
        };
    }
};