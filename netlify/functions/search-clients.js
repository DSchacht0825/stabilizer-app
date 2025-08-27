exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    const searchTerm = event.queryStringParameters?.search || '';
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    try {
        const response = await fetch(
            `${supabaseUrl}/rest/v1/clients?or=(clientName.ilike.*${searchTerm}*,housingLocation.ilike.*${searchTerm}*)&order=clientName`,
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