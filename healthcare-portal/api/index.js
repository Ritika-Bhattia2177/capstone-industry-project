const fs = require('fs');
const path = require('path');

// Read db.json
const dbPath = path.join(__dirname, '..', 'db.json');

// Helper to get fresh data each request (to handle concurrent requests)
const getDb = () => {
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (error) {
    console.error('Error reading db.json:', error);
    return { users: [], doctors: [], appointments: [] };
  }
};

// Helper to read request body
const getBody = async (req) => {
  if (req.body) return req.body;
  
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
};

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = getDb();
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname.replace('/api', '');
    const searchParams = url.searchParams;

    // Parse the resource from the URL
    const [, resource, id] = pathname.split('/').filter(Boolean);

    if (!resource || !db[resource]) {
      return res.status(404).json({ error: `Resource '${resource}' not found` });
    }
    switch (req.method) {
      case 'GET':
        if (id) {
          // Get single item by ID
          const item = db[resource].find(item => item.id === id);
          return res.status(item ? 200 : 404).json(item || { error: 'Not found' });
        } else {
          // Get all items or filter
          let items = db[resource];
          
          // Apply filters from query params
          for (const [key, value] of searchParams.entries()) {
            items = items.filter(item => String(item[key]) === value);
          }
          
          return res.status(200).json(items);
        }

      case 'POST':
        const body = await getBody(req);
        const newItem = {
          id: String(Date.now()),
          ...body
        };
        db[resource].push(newItem);
        
        // Write to db.json
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        
        return res.status(201).json(newItem);

      case 'PUT':
      case 'PATCH':
        if (!id) {
          return res.status(400).json({ error: 'ID required for update' });
        }
        
        const updateBody = await getBody(req);
        const index = db[resource].findIndex(item => item.id === id);
        
        if (index === -1) {
          return res.status(404).json({ error: 'Not found' });
        }
        
        db[resource][index] = { ...db[resource][index], ...updateBody };
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        
        return res.status(200).json(db[resource][index]);

      case 'DELETE':
        if (!id) {
          return res.status(400).json({ error: 'ID required for delete' });
        }
        
        const deleteIndex = db[resource].findIndex(item => item.id === id);
        
        if (deleteIndex === -1) {
          return res.status(404).json({ error: 'Not found' });
        }
        
        const deleted = db[resource].splice(deleteIndex, 1)[0];
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        
        return res.status(200).json(deleted);

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
};
