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
        // Return comprehensive demo data for testing all features
        const mockClients = [
            {
                id: 'demo-001',
                client_name: 'John Martinez',
                clientName: 'John Martinez',
                housing_stabilizer: 'Carolina',
                caseManager: 'Carolina',
                housing_location: 'Downtown',
                housingLocation: 'Downtown',
                phone_primary: '(619) 555-0123',
                email: 'john.martinez@email.com',
                current_address: '123 Main St, San Diego, CA 92101',
                age: 34,
                employment_status: 'Part-time',
                monthly_income: 1800,
                monthly_rent: 1200,
                services_requested: ['rental_assistance', 'job_placement'],
                intake_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'demo-002',
                client_name: 'Maria Rodriguez',
                clientName: 'Maria Rodriguez',
                housing_stabilizer: 'Alex',
                caseManager: 'Alex',
                housing_location: 'Hillcrest',
                housingLocation: 'Hillcrest',
                phone_primary: '(619) 555-0124',
                email: 'maria.rodriguez@email.com',
                current_address: '456 Oak Ave, San Diego, CA 92103',
                age: 28,
                employment_status: 'Unemployed',
                monthly_income: 800,
                monthly_rent: 1000,
                services_requested: ['eviction_prevention', 'emergency_assistance'],
                intake_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'demo-003',
                client_name: 'Robert Johnson',
                clientName: 'Robert Johnson',
                housing_stabilizer: 'Vanessa',
                caseManager: 'Vanessa',
                housing_location: 'National City',
                housingLocation: 'National City',
                phone_primary: '(619) 555-0125',
                email: 'robert.johnson@email.com',
                current_address: '789 Pine St, National City, CA 91950',
                age: 45,
                employment_status: 'Full-time',
                monthly_income: 3200,
                monthly_rent: 1500,
                services_requested: ['utility_assistance', 'financial_counseling'],
                intake_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];
        
        // Filter based on search parameters
        let filteredClients = mockClients;
        
        if (searchTerm) {
            filteredClients = filteredClients.filter(client => 
                client.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (stabilizer) {
            filteredClients = filteredClients.filter(client => 
                client.housing_stabilizer === stabilizer || client.caseManager === stabilizer
            );
        }
        
        if (location) {
            filteredClients = filteredClients.filter(client => 
                client.housing_location.includes(location) || client.housingLocation.includes(location)
            );
        }
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                clients: filteredClients,
                message: `Found ${filteredClients.length} client(s) - Demo data active`
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Search failed' })
        };
    }
};