export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    try {
      // Route: Submit client
      if (path === '/api/submit-client' && request.method === 'POST') {
        const data = await request.json();
        
        // Generate unique ID
        data.id = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        data.created_at = new Date().toISOString();
        data.updated_at = new Date().toISOString();
        
        // Convert arrays to JSON strings for SQLite
        if (data.services_requested && Array.isArray(data.services_requested)) {
          data.services_requested = JSON.stringify(data.services_requested);
        }
        
        // Build insert query
        const columns = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map(() => '?').join(', ');
        const values = Object.values(data);
        
        const result = await env.DB.prepare(
          `INSERT INTO clients (${columns}) VALUES (${placeholders})`
        ).bind(...values).run();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Client information saved successfully',
          id: data.id
        }), { headers });
      }

      // Route: Search clients
      if (path === '/api/search-clients' && request.method === 'GET') {
        const params = url.searchParams;
        const search = params.get('search') || '';
        const stabilizer = params.get('stabilizer') || '';
        const location = params.get('location') || '';
        const sortBy = params.get('sortBy') || 'recent';
        
        let query = 'SELECT * FROM clients WHERE 1=1';
        const bindings = [];
        
        if (search) {
          query += ' AND (client_name LIKE ? OR clientName LIKE ? OR id LIKE ?)';
          bindings.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        
        if (stabilizer) {
          query += ' AND (housing_stabilizer = ? OR caseManager = ?)';
          bindings.push(stabilizer, stabilizer);
        }
        
        if (location) {
          query += ' AND (housing_location = ? OR housingLocation = ?)';
          bindings.push(location, location);
        }
        
        // Add sorting
        switch(sortBy) {
          case 'name':
            query += ' ORDER BY client_name ASC';
            break;
          case 'name-desc':
            query += ' ORDER BY client_name DESC';
            break;
          case 'oldest':
            query += ' ORDER BY created_at ASC';
            break;
          case 'recent':
          default:
            query += ' ORDER BY created_at DESC';
        }
        
        query += ' LIMIT 100';
        
        const result = await env.DB.prepare(query).bind(...bindings).all();
        
        // Parse JSON strings back to arrays
        const clients = result.results.map(client => {
          if (client.services_requested && typeof client.services_requested === 'string') {
            try {
              client.services_requested = JSON.parse(client.services_requested);
            } catch (e) {
              client.services_requested = [];
            }
          }
          return client;
        });
        
        return new Response(JSON.stringify({
          success: true,
          clients: clients
        }), { headers });
      }

      // Route: Get notes
      if (path === '/api/get-notes' && request.method === 'GET') {
        const clientId = url.searchParams.get('clientId');
        
        if (!clientId) {
          return new Response(JSON.stringify({
            error: 'Client ID required'
          }), { status: 400, headers });
        }
        
        const result = await env.DB.prepare(
          'SELECT * FROM notes WHERE client_id = ? ORDER BY created_at DESC'
        ).bind(clientId).all();
        
        return new Response(JSON.stringify({
          success: true,
          notes: result.results
        }), { headers });
      }

      // Route: Add note
      if (path === '/api/add-note' && request.method === 'POST') {
        const data = await request.json();
        
        // Generate unique ID
        const noteId = `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const result = await env.DB.prepare(
          `INSERT INTO notes (id, client_id, content, visit_type, category, outcome, next_steps, stabilizer, created_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          noteId,
          data.clientId,
          data.content,
          data.visitType || 'office_visit',
          data.category || 'general',
          data.outcome || 'successful',
          data.nextSteps || '',
          data.stabilizer || 'Unknown',
          new Date().toISOString()
        ).run();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Note added successfully',
          id: noteId
        }), { headers });
      }

      // Route: Get dashboard stats
      if (path === '/api/get-dashboard-stats' && request.method === 'GET') {
        const totalClients = await env.DB.prepare('SELECT COUNT(*) as count FROM clients').first();
        const recentClients = await env.DB.prepare(
          "SELECT COUNT(*) as count FROM clients WHERE date(created_at) >= date('now', '-7 days')"
        ).first();
        const totalNotes = await env.DB.prepare('SELECT COUNT(*) as count FROM notes').first();
        
        return new Response(JSON.stringify({
          success: true,
          stats: {
            totalClients: totalClients?.count || 0,
            recentClients: recentClients?.count || 0,
            totalNotes: totalNotes?.count || 0
          }
        }), { headers });
      }

      // Route: Update client
      if (path === '/api/update-client' && request.method === 'PUT') {
        const data = await request.json();
        const { id, ...updateData } = data;
        
        if (!id) {
          return new Response(JSON.stringify({
            error: 'Client ID required'
          }), { status: 400, headers });
        }
        
        updateData.updated_at = new Date().toISOString();
        
        // Build update query
        const setClause = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updateData), id];
        
        const result = await env.DB.prepare(
          `UPDATE clients SET ${setClause} WHERE id = ?`
        ).bind(...values).run();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Client updated successfully'
        }), { headers });
      }

      // Default route
      return new Response(JSON.stringify({
        message: 'Housing Stabilization API',
        endpoints: [
          'POST /api/submit-client',
          'GET /api/search-clients',
          'GET /api/get-notes',
          'POST /api/add-note',
          'GET /api/get-dashboard-stats',
          'PUT /api/update-client'
        ]
      }), { headers });

    } catch (error) {
      console.error('API Error:', error);
      return new Response(JSON.stringify({
        error: 'Internal server error',
        details: error.message
      }), { status: 500, headers });
    }
  }
};