import { put, list, del } from '@vercel/blob';

const BLOB_FILENAME = 'alerts.json';

// Helper function to get existing alerts
async function getExistingAlerts() {
  try {
    // List all blobs to see if our file exists
    const { blobs } = await list();
    const alertsBlob = blobs.find(blob => blob.pathname === BLOB_FILENAME);
    
    if (alertsBlob) {
      // If blob exists, fetch its content
      const response = await fetch(alertsBlob.url);
      if (response.ok) {
        return await response.json();
      }
    }
    return {};
  } catch (error) {
    console.log('Error getting existing alerts:', error);
    return {};
  }
}

// Helper function to save alerts
async function saveAlerts(alerts) {
  try {
    // Delete old versions of the file
    const { blobs } = await list();
    const oldAlertsBlobs = blobs.filter(blob => blob.pathname === BLOB_FILENAME);
    
    for (const oldBlob of oldAlertsBlobs) {
      try {
        await del(oldBlob.url);
      } catch (error) {
        console.log('Error deleting old blob:', error);
      }
    }
    
    // Create new file
    const blob = await put(BLOB_FILENAME, JSON.stringify(alerts), {
      access: 'public',
    });
    return blob;
  } catch (error) {
    console.error('Error saving alerts:', error);
    throw error;
  }
}

export async function POST(request) {
  try {
    const { nft, alertText, id } = await request.json();
    
    if (!nft || !alertText || !id) {
      return Response.json({ error: 'NFT, Alert Text, and ID are required' }, { status: 400 });
    }
    
    const existingAlerts = await getExistingAlerts();
    existingAlerts[id] = {
      nft,
      alertText,
      timestamp: Date.now(),
      isWatched: true
    };
    
    await saveAlerts(existingAlerts);
    return Response.json({ success: true, message: 'Alert stored' });
  } catch (error) {
    console.error('Store error:', error);
    return Response.json({ error: 'Failed to store alert' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const alerts = await getExistingAlerts();
    
    if (id) {
      // Get specific alert
      const alert = alerts[id];
      if (!alert) {
        return Response.json({ error: 'Alert not found' }, { status: 404 });
      }
      return Response.json({ alert });
    } else {
      // Get all alerts
      return Response.json({ alerts });
    }
  } catch (error) {
    console.error('Retrieve error:', error);
    return Response.json({ error: 'Failed to retrieve alerts' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, updates } = await request.json();
    
    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const existingAlerts = await getExistingAlerts();
    
    if (!existingAlerts[id]) {
      return Response.json({ error: 'Alert not found' }, { status: 404 });
    }
    
    existingAlerts[id] = { ...existingAlerts[id], ...updates };
    
    await saveAlerts(existingAlerts);
    return Response.json({ success: true, message: 'Alert updated' });
  } catch (error) {
    console.error('Update error:', error);
    return Response.json({ error: 'Failed to update alert' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const existingAlerts = await getExistingAlerts();
    delete existingAlerts[id];
    
    await saveAlerts(existingAlerts);
    return Response.json({ success: true, message: 'Alert deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    return Response.json({ error: 'Failed to delete alert' }, { status: 500 });
  }
}
