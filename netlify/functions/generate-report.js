exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    const reportType = event.queryStringParameters?.type || '';
    const stabilizer = event.queryStringParameters?.stabilizer || '';
    
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    try {
        let query = '';
        
        // Add stabilizer filter if specified
        if (stabilizer) {
            query = `"caseManager".eq.${stabilizer}`;
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

        const allClients = await response.json();
        let reportData = [];
        let summary = { details: '' };
        
        switch (reportType) {
            case 'employment':
                reportData = allClients
                    .filter(c => c.workStatus && c.workStatus !== '')
                    .map(c => ({
                        'Client Name': c.clientName || 'N/A',
                        'Stabilizer': c.caseManager || 'N/A',
                        'Work Status': c.workStatus || 'N/A',
                        'Employer & Income': c.employerIncome || 'N/A',
                        'Job Leads': c.jobLeads || 'N/A',
                        'Status': c.status || 'N/A'
                    }));
                summary.details = `Employed clients: ${reportData.filter(c => c['Work Status'].includes('Full-Time') || c['Work Status'].includes('Part-Time')).length}`;
                break;
                
            case 'rent-payment':
                reportData = allClients
                    .filter(c => c.rentPaid && parseFloat(c.rentPaid) > 0)
                    .map(c => ({
                        'Client Name': c.clientName || 'N/A',
                        'Stabilizer': c.caseManager || 'N/A',
                        'Rent Amount': c.rentAmount ? `$${c.rentAmount}` : 'N/A',
                        'Total Rent Paid': c.rentPaid ? `$${c.rentPaid}` : 'N/A',
                        'Last Payment Date': c.lastPaymentDate || 'N/A',
                        'Housing Location': c.housingLocation || 'N/A',
                        'Benefits': c.benefits || 'None'
                    }));
                const selfPaying = reportData.filter(c => !c.Benefits || c.Benefits === 'None');
                summary.details = `Self-paying clients (no benefits): ${selfPaying.length} out of ${reportData.length}`;
                break;
                
            case 'disability':
                reportData = allClients
                    .filter(c => c.benefits && (c.benefits.includes('SSI') || c.benefits.includes('SSDI')))
                    .map(c => ({
                        'Client Name': c.clientName || 'N/A',
                        'Stabilizer': c.caseManager || 'N/A',
                        'Benefit Type': c.benefits || 'N/A',
                        'Work Status': c.workStatus || 'N/A',
                        'Housing Status': c.status || 'N/A',
                        'Rent Paid': c.rentPaid ? `$${c.rentPaid}` : '$0'
                    }));
                summary.details = `SSI recipients: ${reportData.filter(c => c['Benefit Type'].includes('SSI')).length}, SSDI recipients: ${reportData.filter(c => c['Benefit Type'].includes('SSDI')).length}`;
                break;
                
            case 'benefits-overview':
                reportData = allClients
                    .filter(c => c.benefits && c.benefits !== 'None' && c.benefits !== '')
                    .map(c => ({
                        'Client Name': c.clientName || 'N/A',
                        'Stabilizer': c.caseManager || 'N/A',
                        'Benefits': c.benefits || 'N/A',
                        'Work Status': c.workStatus || 'N/A',
                        'Monthly Income': c.employerIncome || 'N/A',
                        'Housing Status': c.status || 'N/A'
                    }));
                const benefitTypes = {};
                reportData.forEach(c => {
                    const benefit = c.Benefits;
                    benefitTypes[benefit] = (benefitTypes[benefit] || 0) + 1;
                });
                summary.details = Object.entries(benefitTypes).map(([type, count]) => `${type}: ${count}`).join(', ');
                break;
                
            case 'stabilizer-caseload':
                const caseloads = {};
                allClients.forEach(c => {
                    const stabilizer = c.caseManager || 'Unassigned';
                    if (!caseloads[stabilizer]) {
                        caseloads[stabilizer] = { total: 0, active: 0, housed: 0 };
                    }
                    caseloads[stabilizer].total++;
                    if (c.status && c.status.includes('Active')) {
                        caseloads[stabilizer].active++;
                    }
                    if (c.results && c.results.includes('Housed')) {
                        caseloads[stabilizer].housed++;
                    }
                });
                
                reportData = Object.entries(caseloads).map(([name, data]) => ({
                    'Stabilizer': name,
                    'Total Clients': data.total,
                    'Active Cases': data.active,
                    'Successfully Housed': data.housed,
                    'Success Rate': data.total > 0 ? `${Math.round((data.housed / data.total) * 100)}%` : '0%'
                }));
                summary.details = `Total active cases: ${Object.values(caseloads).reduce((sum, c) => sum + c.active, 0)}`;
                break;
                
            default:
                reportData = [];
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, report: reportData, summary })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to generate report' })
        };
    }
};