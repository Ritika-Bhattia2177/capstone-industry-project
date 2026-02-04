// Import data directly
const data = require('./data');

// Helper to parse body for Vercel
async function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
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
    const db = data.getDb();
    const url = req.url || '';
    const urlObj = new URL(url, `http://${req.headers.host}`);
    const pathname = urlObj.pathname.replace('/api', '');
    const searchParams = urlObj.searchParams;
    const parts = pathname.split('/').filter(Boolean);
    const resource = parts[0];
    const id = parts[1];

    if (!resource || !db[resource]) {
      return res.status(404).json({ error: `Resource '${resource}' not found. Available: ${Object.keys(db).join(', ')}` });
    }

    // Special handling for 'profile' - it's an object, not an array
    if (resource === 'profile') {
      switch (req.method) {
        case 'GET':
          return res.status(200).json(db.profile);
        case 'PATCH':
        case 'PUT': {
          const updateBody = await parseBody(req);
          db.profile = { ...db.profile, ...updateBody };
          if (updateBody.personalInfo) {
            db.profile.personalInfo = { ...db.profile.personalInfo, ...updateBody.personalInfo };
          }
          return res.status(200).json(db.profile);
        }
        default:
          return res.status(405).json({ error: 'Method not allowed for profile' });
      }
    }
    
    switch (req.method) {
      case 'GET': {
        if (id) {
          const item = db[resource].find(item => item.id === id || item.id === parseInt(id));
          return res.status(item ? 200 : 404).json(item || { error: 'Not found' });
        }
        
        
        let results = db[resource];
        for (const [key, value] of searchParams.entries()) {
          results = results.filter(item => 
            item[key] && item[key].toString().toLowerCase() === value.toLowerCase()
          );
        }
        
        return res.status(200).json(results);
      }

      case 'POST': {
        const body = await parseBody(req);
        const newItem = {
          id: Date.now(),
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
        
        const updateBody = await parseBody(req);
        const index = db[resource].findIndex(item => item.id === id || item.id === parseInt(id));
        
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
        
        const deleteIndex = db[resource].findIndex(item => item.id === id || item.id === parseInt(id));
        
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
    return res.status(500).json({ error: error.message, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined });
  }
};
