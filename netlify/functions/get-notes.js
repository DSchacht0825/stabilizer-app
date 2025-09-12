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
        // Check if environment variables are available
        if (!supabaseUrl || !supabaseKey) {
            // Return mock notes for demo purposes
            const mockNotes = [
                {
                    id: 'note-001',
                    client_id: clientId,
                    content: 'Initial intake meeting completed. Client is motivated and engaged in services. Discussed housing options and timeline.',
                    visit_type: 'office_visit',
                    visitType: 'office_visit',
                    category: 'housing',
                    outcome: 'successful',
                    next_steps: 'Schedule follow-up appointment for next week to review housing applications.',
                    nextSteps: 'Schedule follow-up appointment for next week to review housing applications.',
                    stabilizer: 'Carolina',
                    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: 'note-002',
                    client_id: clientId,
                    content: 'Phone check-in completed. Client reported they submitted housing application and are waiting for response.',
                    visit_type: 'phone_call',
                    visitType: 'phone_call',
                    category: 'housing',
                    outcome: 'partial_progress',
                    next_steps: 'Follow up in 3 days if no response from housing authority.',
                    nextSteps: 'Follow up in 3 days if no response from housing authority.',
                    stabilizer: 'Carolina',
                    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
                }
            ];
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true, 
                    notes: mockNotes,
                    note: 'Demo data - database not configured'
                })
            };
        }
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