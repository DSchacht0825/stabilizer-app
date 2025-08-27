exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    try {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Missing environment variables',
                    hasUrl: !!supabaseUrl,
                    hasKey: !!supabaseKey
                })
            };
        }

        // Test simple connection
        const response = await fetch(`${supabaseUrl}/rest/v1/clients?limit=1`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Database connection failed',
                    details: errorText,
                    status: response.status
                })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true,
                message: 'Connection test passed!'
            })
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Function error',
                details: error.message
            })
        };
    }
};