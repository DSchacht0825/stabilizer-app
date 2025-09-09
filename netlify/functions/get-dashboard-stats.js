exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    try {
        // Get all active clients
        const response = await fetch(`${supabaseUrl}/rest/v1/clients`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });

        const clients = await response.json();
        
        // Calculate stats
        const stats = {
            total: clients.length,
            employed: clients.filter(c => 
                c.workStatus && 
                (c.workStatus.includes('Full-Time') || c.workStatus.includes('Part-Time') || c.workStatus.includes('Employed'))
            ).length,
            selfPaying: clients.filter(c => 
                c.rentPaid && parseFloat(c.rentPaid) > 0 && 
                (!c.benefits || c.benefits === 'None')
            ).length,
            withBenefits: clients.filter(c => 
                c.benefits && 
                c.benefits !== 'None' && 
                c.benefits !== ''
            ).length
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, stats })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to load stats' })
        };
    }
};