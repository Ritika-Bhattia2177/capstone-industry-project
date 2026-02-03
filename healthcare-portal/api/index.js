const fs = require('fs');
const path = require('path');

// Read db.json once at startup
let db;
try {
  const dbPath = path.join(process.cwd(), 'db.json');
  db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
} catch (error) {
  console.error('Error loading db.json:', error);
  db = { users: [], doctors: [], appointments: [] };
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const url = req.url || '';
    const pathname = url.split('?')[0].replace('/api', '');
    const parts = pathname.split('/').filter(Boolean);
    const resource = parts[0];
    const id = parts[1];

    if (!resource || !db[resource]) {
      return res.status(404).json({ error: `Resource '${resource}' not found. Available: ${Object.keys(db).join(', ')}` });
    }
    switch (req.method) {
      case 'GET':
        if (id) {
          const item = db[resource].find(item => item.id === id);
          return res.status(item ? 200 : 404).json(item || { error: 'Not found' });
        }
        return res.status(200).json(db[resource]);

      case 'POST': {
        const body = req.body || {};
        const newItem = {
          id: String(Date.now()),
          ...body
        };
        db[resource].push(newItem);
        return res.status(201).json(newItem);
      }

      case 'PUT':
      case 'PATCH': {
        if (!id) {
          return res.status(400).json({ error: 'ID required for update' });
        }
        
        const updateBody = req.body || {};
        const index = db[resource].findIndex(item => item.id === id);
        
        if (index === -1) {
          return res.status(404).json({ error: 'Not found' });
        }
        
        db[resource][index] = { ...db[resource][index], ...updateBody };
        return res.status(200).json(db[resource][index]);
      }

      case 'DELETE': {
        if (!id) {
          return res.status(400).json({ error: 'ID required for delete' });
        }
        
        const deleteIndex = db[resource].findIndex(item => item.id === id);
        
        if (deleteIndex === -1) {
          return res.status(404).json({ error: 'Not found' });
        }
        
        const deleted = db[resource].splice(deleteIndex, 1)[0];
        return res.status(200).json(deleted);
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
};
