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
        // Return realistic demo notes based on client ID
        const notesDatabase = {
            'demo-001': [
                {
                    id: 'note-001',
                    client_id: 'demo-001',
                    content: 'Initial intake meeting completed with John Martinez. Client is motivated and engaged in services. Discussed current housing situation - he is behind on rent by 2 months. Explored rental assistance options and employment opportunities.',
                    visit_type: 'office_visit',
                    visitType: 'office_visit',
                    category: 'housing',
                    outcome: 'successful',
                    next_steps: 'Apply for emergency rental assistance through County program. Schedule follow-up appointment for next week.',
                    nextSteps: 'Apply for emergency rental assistance through County program. Schedule follow-up appointment for next week.',
                    stabilizer: 'Carolina',
                    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: 'note-002',
                    client_id: 'demo-001',
                    content: 'Phone check-in with John. Rental assistance application submitted successfully. Landlord has agreed to payment plan. Client expressed relief and gratitude.',
                    visit_type: 'phone_call',
                    visitType: 'phone_call',
                    category: 'housing',
                    outcome: 'successful',
                    next_steps: 'Follow up on application status in one week. Continue job search assistance.',
                    nextSteps: 'Follow up on application status in one week. Continue job search assistance.',
                    stabilizer: 'Carolina',
                    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
                }
            ],
            'demo-002': [
                {
                    id: 'note-003',
                    client_id: 'demo-002',
                    content: 'Home visit with Maria Rodriguez. Found client in stable temporary housing with family. Discussed eviction notice received last week. Client is overwhelmed but willing to engage.',
                    visit_type: 'home_visit',
                    visitType: 'home_visit',
                    category: 'housing',
                    outcome: 'needs_follow_up',
                    next_steps: 'Connect with legal aid for eviction defense. Apply for emergency assistance funds.',
                    nextSteps: 'Connect with legal aid for eviction defense. Apply for emergency assistance funds.',
                    stabilizer: 'Alex',
                    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: 'note-004',
                    client_id: 'demo-002',
                    content: 'Emergency contact - Maria called distressed about court date next week. Provided emotional support and reviewed legal aid appointment details.',
                    visit_type: 'emergency_contact',
                    visitType: 'emergency_contact',
                    category: 'legal',
                    outcome: 'crisis',
                    next_steps: 'Accompany client to legal aid appointment tomorrow. Check on mental health resources.',
                    nextSteps: 'Accompany client to legal aid appointment tomorrow. Check on mental health resources.',
                    stabilizer: 'Alex',
                    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
                }
            ],
            'demo-003': [
                {
                    id: 'note-005',
                    client_id: 'demo-003',
                    content: 'Office visit with Robert Johnson. Discussed utility shut-off notice. Client is employed full-time but struggling with medical bills from recent surgery.',
                    visit_type: 'office_visit',
                    visitType: 'office_visit',
                    category: 'financial',
                    outcome: 'partial_progress',
                    next_steps: 'Apply for utility assistance program. Refer to financial counselor for budget planning.',
                    nextSteps: 'Apply for utility assistance program. Refer to financial counselor for budget planning.',
                    stabilizer: 'Vanessa',
                    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
                }
            ]
        };
        
        const clientNotes = notesDatabase[clientId] || [];
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                notes: clientNotes,
                message: `Found ${clientNotes.length} note(s) - Demo data active`
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to load notes' })
        };
    }
};