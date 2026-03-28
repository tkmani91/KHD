// api/github-upload.js

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filePath, content, commitMessage } = req.body;

    // Validation
    if (!filePath || !content || !commitMessage) {
      return res.status(400).json({ 
        error: 'Missing required fields: filePath, content, commitMessage' 
      });
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO || 'tkmani91/KHD';
    const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

    if (!GITHUB_TOKEN) {
      return res.status(500).json({ 
        error: 'GitHub token not configured on server' 
      });
    }

    // Step 1: Get current file SHA (required for update)
    const getFileUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`;
    
    const getFileResponse = await fetch(getFileUrl, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'KHD-Admin-Panel'
      }
    });

    let fileSHA = null;
    
    if (getFileResponse.ok) {
      const fileData = await getFileResponse.json();
      fileSHA = fileData.sha;
    } else if (getFileResponse.status !== 404) {
      // Error other than "file not found"
      const errorData = await getFileResponse.json();
      return res.status(getFileResponse.status).json({ 
        error: `Failed to get file info: ${errorData.message}` 
      });
    }

    // Step 2: Encode content to base64
    const base64Content = Buffer.from(content, 'utf-8').toString('base64');

    // Step 3: Upload/Update file
    const uploadUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
    
    const uploadPayload = {
      message: commitMessage,
      content: base64Content,
      branch: GITHUB_BRANCH
    };

    // Include SHA only if file exists
    if (fileSHA) {
      uploadPayload.sha = fileSHA;
    }

    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'KHD-Admin-Panel'
      },
      body: JSON.stringify(uploadPayload)
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      return res.status(uploadResponse.status).json({ 
        error: `Upload failed: ${errorData.message}`,
        details: errorData
      });
    }

    const result = await uploadResponse.json();

    // Success!
    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully to GitHub',
      commit: {
        sha: result.commit.sha,
        url: result.commit.html_url
      },
      file: {
        path: filePath,
        url: result.content.html_url
      }
    });

  } catch (error) {
    console.error('GitHub upload error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}
