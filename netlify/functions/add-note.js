exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    try {
        const data = JSON.parse(event.body);
        
        console.log('📝 NEW NOTE SUBMISSION:');
        console.log('=====================================');
        console.log(`Client ID: ${data.clientId}`);
        console.log(`Visit Type: ${data.visitType}`);
        console.log(`Category: ${data.category}`);
        console.log(`Outcome: ${data.outcome}`);
        console.log(`Content: ${data.content}`);
        console.log(`Next Steps: ${data.nextSteps}`);
        console.log(`Stabilizer: ${data.stabilizer}`);
        console.log('=====================================');
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true,
                message: 'Note added successfully! Check server logs for details.',
                id: `note_${Date.now()}`
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to add note' })
        };
    }
};