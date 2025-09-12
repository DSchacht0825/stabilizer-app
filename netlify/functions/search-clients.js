exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    const searchTerm = event.queryStringParameters?.search || '';
    const stabilizer = event.queryStringParameters?.stabilizer || '';
    const location = event.queryStringParameters?.location || '';
    const dateFilter = event.queryStringParameters?.dateFilter || '';
    const sortBy = event.queryStringParameters?.sortBy || 'recent';
    const dateField = event.queryStringParameters?.dateField || 'created_at';
    const dateFrom = event.queryStringParameters?.dateFrom || '';
    const dateTo = event.queryStringParameters?.dateTo || '';
    
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    try {
        // Check if environment variables are available
        if (!supabaseUrl || !supabaseKey) {
            // Return mock data for demo purposes
            const mockClients = [
                {
                    id: 'demo-001',
                    client_name: 'John Demo',
                    clientName: 'John Demo',
                    housing_stabilizer: 'Carolina',
                    caseManager: 'Carolina',
                    housing_location: 'Downtown',
                    housingLocation: 'Downtown',
                    phone_primary: '(555) 123-4567',
                    intake_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: 'demo-002',
                    client_name: 'Jane Sample',
                    clientName: 'Jane Sample',
                    housing_stabilizer: 'Alex',
                    caseManager: 'Alex',
                    housing_location: 'Hillcrest',
                    housingLocation: 'Hillcrest',
                    phone_primary: '(555) 234-5678',
                    intake_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
                }
            ];
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true, 
                    clients: mockClients,
                    note: 'Demo data - database not configured'
                })
            };
        }
        let query = '';
        let conditions = [];
        
        // Add search term condition
        if (searchTerm) {
            conditions.push(`or=("clientName".ilike.*${searchTerm}*,"housingLocation".ilike.*${searchTerm}*,"caseManager".ilike.*${searchTerm}*,"id".ilike.*${searchTerm}*)`);
        }
        
        // Add stabilizer filter
        if (stabilizer) {
            conditions.push(`"caseManager".ilike.*${stabilizer}*`);
        }
        
        // Add location filter
        if (location) {
            conditions.push(`"housingLocation".ilike.*${location}*`);
        }
        
        // Add date filter conditions
        if (dateFilter) {
            const now = new Date();
            let fromDate;
            
            switch(dateFilter) {
                case 'today':
                    fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    conditions.push(`"created_at".gte.${fromDate.toISOString()}`);
                    break;
                case 'week':
                    fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    conditions.push(`"created_at".gte.${fromDate.toISOString()}`);
                    break;
                case 'month':
                    fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    conditions.push(`"created_at".gte.${fromDate.toISOString()}`);
                    break;
                case 'quarter':
                    fromDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                    conditions.push(`"created_at".gte.${fromDate.toISOString()}`);
                    break;
            }
        }
        
        // Add date range conditions (for backward compatibility)
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