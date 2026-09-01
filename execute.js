const FIREBASE_KEY = process.env.FIREBASE_WEB_API_KEY || 'AIzaSyBjFzJSW36kOI75Nhz0uiZgwhU9qTnSiKE';

async function authenticatedUser(req) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) throw new Error('Sign in required');
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_KEY}`, {
    method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({idToken: token})
  });
  if (!response.ok) throw new Error('Invalid or expired login');
  const data = await response.json();
  if (!data.users?.[0]?.localId) throw new Error('Invalid login');
  return data.users[0];
}
const fill = (text, input) => String(text || '').replace(/\{\{input\}\}/g, typeof input === 'string' ? input : JSON.stringify(input));

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({error:'POST required'});
  try {
    await authenticatedUser(req);
    if (!process.env.OPENROUTER_API_KEY) throw new Error('OPENROUTER_API_KEY has not been added in Vercel');
    const {nodes = [], input = {}} = req.body || {};
    const aiNodes = nodes.filter(n => n?.data?.kind === 'ai');
    if (!aiNodes.length) throw new Error('Add at least one AI reasoning node');
    let output = input; const steps = [];
    for (const node of aiNodes.slice(0, 10)) {
      const started = Date.now(); const config = node.data.config || {};
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method:'POST',
        headers:{Authorization:`Bearer ${process.env.OPENROUTER_API_KEY}`,'content-type':'application/json','HTTP-Referer':req.headers.origin || 'https://nexusai.vercel.app','X-Title':'NexusAI'},
        body:JSON.stringify({model:config.model || 'openai/gpt-4o-mini',messages:[{role:'user',content:fill(config.prompt || 'Process this input: {{input}}', output)}]})
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message || `OpenRouter returned ${response.status}`);
      output = {text:data.choices?.[0]?.message?.content || '',usage:data.usage || null};
      steps.push({nodeId:node.id,label:node.data.label,status:'success',durationMs:Date.now()-started,output});
    }
    return res.status(200).json({status:'success',output,steps});
  } catch (error) {
    return res.status(error.message?.includes('login') ? 401 : 400).json({status:'failed',error:error.message || 'Execution failed'});
  }
}
