import { list } from '@vercel/blob';

// Helper function to get existing phrases
async function getExistingPhrases() {
  try {
    // List all blobs to see if our file exists
    const { blobs } = await list();
    const phrasesBlob = blobs.find(blob => blob.pathname === 'phrases.json');
    
    if (phrasesBlob) {
      // If blob exists, fetch its content
      const response = await fetch(phrasesBlob.url);
      if (response.ok) {
        return await response.json();
      }
    }
    return {};
  } catch (error) {
    return {};
  }
}

// Mock function that processes phrases
function processPhrase(phrase) {
  const words = phrase.split(' ');
  return {
    wordCount: words.length,
    firstWord: words[0] || '',
    lastWord: words[words.length - 1] || '',
    reversed: phrase.split('').reverse().join(''),
    uppercase: phrase.toUpperCase(),
    processed: true,
    timestamp: new Date().toISOString()
  };
}

export async function POST(request) {
  try {
    const { phraseId, action = 'process' } = await request.json();
    
    if (!phraseId) {
      return Response.json({ error: 'Phrase ID is required' }, { status: 400 });
    }
    
    // Get all phrases
    const phrases = await getExistingPhrases();
    const phrase = phrases[phraseId];
    
    if (!phrase) {
      return Response.json({ error: 'Phrase not found' }, { status: 404 });
    }
    
    // Process the phrase
    const result = processPhrase(phrase);
    
    return Response.json({
      originalPhrase: phrase,
      result: result,
      action: action
    });
    
  } catch (error) {
    console.error('Trigger error:', error);
    return Response.json({ error: 'Failed to process phrase' }, { status: 500 });
  }
}
