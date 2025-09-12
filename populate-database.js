// Script to populate D1 database with existing CSV data
// This script converts CSV data to API calls to populate the database

const fs = require('fs');
const path = require('path');

// Base URL for your deployed site
const BASE_URL = 'https://amazing-brigadeiros-75b20a.netlify.app';

// Function to parse CSV
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = values[index] || '';
        });
        return obj;
    });
}

// Function to submit client data
async function submitClient(clientData) {
    try {
        const response = await fetch(`${BASE_URL}/api/submit-client`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clientData)
        });
        
        const result = await response.json();
        if (result.success) {
            console.log(`✅ Client ${clientData['Client Name']} added successfully`);
            return result.id;
        } else {
            console.error(`❌ Failed to add client ${clientData['Client Name']}:`, result.error);
            return null;
        }
    } catch (error) {
        console.error(`❌ Error adding client ${clientData['Client Name']}:`, error.message);
        return null;
    }
}

// Function to submit note data
async function submitNote(noteData) {
    try {
        const response = await fetch(`${BASE_URL}/api/add-note`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(noteData)
        });
        
        const result = await response.json();
        if (result.success) {
            console.log(`✅ Note added for client ${noteData.clientId}`);
        } else {
            console.error(`❌ Failed to add note for client ${noteData.clientId}:`, result.error);
        }
    } catch (error) {
        console.error(`❌ Error adding note for client ${noteData.clientId}:`, error.message);
    }
}

// Main function to populate database
async function populateDatabase() {
    console.log('🚀 Starting database population...\n');
    
    try {
        // Read and process clients
        console.log('📋 Processing clients...');
        const clientsCSV = fs.readFileSync(path.join(__dirname, 'clients.csv'), 'utf8');
        const clients = parseCSV(clientsCSV);
        
        const clientIdMap = new Map(); // Map old IDs to new IDs
        
        for (const client of clients) {
            const clientData = {
                client_name: client['Client Name'],
                phone_primary: client['Phone Primary'],
                email: client['Email'],
                housing_location: client['Housing Location'],
                housing_stabilizer: client['Housing Stabilizer'],
                current_address: client['Current Address'],
                age: client['Age'] ? parseInt(client['Age']) : null,
                monthly_income: client['Monthly Income'] ? parseInt(client['Monthly Income']) : null,
                monthly_rent: client['Monthly Rent'] ? parseInt(client['Monthly Rent']) : null,
                services_requested: client['Services Requested'] ? client['Services Requested'].split(', ') : [],
                intake_date: client['Intake Date'],
                created_at: client['Created At'] || new Date().toISOString()
            };
            
            const newId = await submitClient(clientData);
            if (newId) {
                clientIdMap.set(client['ID'], newId);
            }
            
            // Add small delay to avoid overwhelming the server
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.log(`\n✅ Processed ${clients.length} clients\n`);
        
        // Read and process notes
        console.log('📝 Processing notes...');
        const notesCSV = fs.readFileSync(path.join(__dirname, 'notes.csv'), 'utf8');
        const notes = parseCSV(notesCSV);
        
        for (const note of notes) {
            const newClientId = clientIdMap.get(note['Client ID']);
            if (!newClientId) {
                console.warn(`⚠️ Skipping note ${note['ID']} - client not found`);
                continue;
            }
            
            const noteData = {
                clientId: newClientId,
                content: note['Content'],
                visitType: note['Visit Type'] ? note['Visit Type'].toLowerCase().replace(' ', '_') : 'office_visit',
                category: note['Category'] ? note['Category'].toLowerCase() : 'general',
                outcome: note['Outcome'] ? note['Outcome'].toLowerCase().replace(' ', '_') : 'successful',
                nextSteps: note['Next Steps'] || '',
                stabilizer: note['Stabilizer'] || 'Unknown'
            };
            
            await submitNote(noteData);
            
            // Add small delay
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.log(`\n✅ Processed ${notes.length} notes`);
        console.log('\n🎉 Database population complete!');
        
    } catch (error) {
        console.error('❌ Error during database population:', error);
    }
}

// Run the script
if (require.main === module) {
    populateDatabase();
}

module.exports = { populateDatabase };