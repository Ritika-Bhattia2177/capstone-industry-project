const fs = require('fs');
const path = require('path');

// Read db.json
const dbPath = path.join(__dirname, '..', 'db.json');
let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.replace('/api', '');
  const searchParams = url.searchParams;

  // Parse the resource from the URL
  const [, resource, id] = pathname.split('/').filter(Boolean);

  if (!resource || !db[resource]) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  try {
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
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const newItem = {
          id: String(Date.now()),
          ...body
        };
        db[resource].push(newItem);
        
        // Write to db.json (note: this won't persist in serverless)
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        
        return res.status(201).json(newItem);

      case 'PUT':
      case 'PATCH':
        if (!id) {
          return res.status(400).json({ error: 'ID required for update' });
        }
        
        const updateBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
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
