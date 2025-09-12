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
    
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || 'patVULqEVYNJyBX8L.f6a8b9c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5';
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appHousingStabilization';
    const AIRTABLE_API_URL = 'https://api.airtable.com/v0';

    try {
        // Fetch from Airtable
        try {
            let url = `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/Clients`;
            
            // Build filter formula for Airtable
            let filterParts = [];
            
            if (searchTerm) {
                filterParts.push(`OR(SEARCH("${searchTerm}", {Client Name}), SEARCH("${searchTerm}", {ID}))`);
            }
            
            if (stabilizer) {
                filterParts.push(`{Housing Stabilizer} = "${stabilizer}"`);
            }
            
            if (location) {
                filterParts.push(`SEARCH("${location}", {Housing Location})`);
            }
            
            if (filterParts.length > 0) {
                const filterFormula = filterParts.length > 1 
                    ? `AND(${filterParts.join(', ')})` 
                    : filterParts[0];
                url += `?filterByFormula=${encodeURIComponent(filterFormula)}`;
            }
            
            console.log('Fetching from Airtable URL:', url);

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
            const clients = result.records.map(record => ({
                id: record.fields.ID || record.id,
                client_name: record.fields['Client Name'],
                clientName: record.fields['Client Name'],
                housing_stabilizer: record.fields['Housing Stabilizer'],
                caseManager: record.fields['Housing Stabilizer'],
                housing_location: record.fields['Housing Location'],
                housingLocation: record.fields['Housing Location'],
                phone_primary: record.fields['Phone Primary'],
                email: record.fields.Email,
                current_address: record.fields['Current Address'],
                age: record.fields.Age,
                employment_status: record.fields['Employment Status'],
                monthly_income: record.fields['Monthly Income'],
                monthly_rent: record.fields['Monthly Rent'],
                services_requested: record.fields['Services Requested']?.split(', ') || [],
                intake_date: record.fields['Intake Date'],
                created_at: record.fields['Created At'],
                airtable_id: record.id
            }));

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true, 
                    clients: clients,
                    message: `Found ${clients.length} client(s) from database`
                })
            };

        } catch (error) {
            console.error('Airtable fetch error:', error);
            
            // Fallback to demo data if Airtable fails
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
                }
            ];
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true, 
                    clients: mockClients,
                    message: 'Using demo data - database connection failed'
                })
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Search failed' })
        };
    }
};