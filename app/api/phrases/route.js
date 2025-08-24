import { put, list, del } from '@vercel/blob';

const BLOB_FILENAME = 'phrases.json';

// Helper function to get existing phrases
async function getExistingPhrases() {
  try {
    // List all blobs to see if our file exists
    const { blobs } = await list();
    const phrasesBlob = blobs.find(blob => blob.pathname === BLOB_FILENAME);
    
    if (phrasesBlob) {
      // If blob exists, fetch its content
      const response = await fetch(phrasesBlob.url);
      if (response.ok) {
        return await response.json();
      }
    }
    return {};
  } catch (error) {
    console.log('Error getting existing phrases:', error);
    return {};
  }
}

// Helper function to save phrases
async function savePhrases(phrases) {
  try {
    // Delete old versions of the file
    const { blobs } = await list();
    const oldPhrasesBlobs = blobs.filter(blob => blob.pathname === BLOB_FILENAME);
    
    for (const oldBlob of oldPhrasesBlobs) {
      try {
        await del(oldBlob.url);
      } catch (error) {
        console.log('Error deleting old blob:', error);
      }
    }
    
    // Create new file
    const blob = await put(BLOB_FILENAME, JSON.stringify(phrases), {
      access: 'public',
    });
    return blob;
  } catch (error) {
    console.error('Error saving phrases:', error);
    throw error;
  }
}

export async function POST(request) {
  try {
    const { phrase, id } = await request.json();
    
    if (!phrase || !id) {
      return Response.json({ error: 'Phrase and ID are required' }, { status: 400 });
    }
    
    const existingPhrases = await getExistingPhrases();
    existingPhrases[id] = phrase;
    
    await savePhrases(existingPhrases);
    return Response.json({ success: true, message: 'Phrase stored' });
  } catch (error) {
    console.error('Store error:', error);
    return Response.json({ error: 'Failed to store phrase' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const phrases = await getExistingPhrases();
    
    if (id) {
      // Get specific phrase
      const phrase = phrases[id];
      if (!phrase) {
        return Response.json({ error: 'Phrase not found' }, { status: 404 });
      }
      return Response.json({ phrase });
    } else {
      // Get all phrases
      return Response.json({ phrases });
    }
  } catch (error) {
    console.error('Retrieve error:', error);
    return Response.json({ error: 'Failed to retrieve phrases' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const existingPhrases = await getExistingPhrases();
    delete existingPhrases[id];
    
    await savePhrases(existingPhrases);
    return Response.json({ success: true, message: 'Phrase deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    return Response.json({ error: 'Failed to delete phrase' }, { status: 500 });
  }
}
