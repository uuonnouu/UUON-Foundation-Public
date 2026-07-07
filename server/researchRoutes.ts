import { Router, Request, Response } from 'express';
import { storage } from './storage';
import { authenticateToken, AuthenticatedRequest } from './auth';
import { validationResult } from 'express-validator';

const router = Router();

// Create new research entry
router.post('/api/research/create', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      researchTitle,
      researchType,
      researchCategory,
      surfaceType,
      parameters,
      enhancedParameters,
      defaultDesign,
      screenshotUrls,
      videoUrls,
      visualizationSettings,
      renderingQuality,
      verificationResults,
      proofOfWork,
      lmfdbValidation,
      arxivReferences,
      oeisSequences,
      geometricAnalysis,
      scientificComputing,
      confidenceScore,
      medianScore,
      meanScore,
      reproducibilityScore,
      renderingMetrics,
      systemSpecs,
      softwareVersion
    } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const research = await storage.saveScientific4DResearch({
      userId: req.user.id,
      researchTitle,
      researchType,
      researchCategory,
      publicationStatus: 'draft',
      surfaceType,
      parameters,
      enhancedParameters,
      defaultDesign,
      screenshotUrls: screenshotUrls || [],
      videoUrls: videoUrls || [],
      visualizationSettings,
      renderingQuality: renderingQuality || 'high',
      verificationResults,
      proofOfWork,
      lmfdbValidation,
      arxivReferences: arxivReferences || [],
      oeisSequences: oeisSequences || [],
      geometricAnalysis,
      scientificComputing,
      confidenceScore,
      medianScore,
      meanScore,
      reproducibilityScore: reproducibilityScore || 0,
      reviewStatus: 'pending',
      reviewerNotes: [],
      citations: 0,
      downloadCount: 0,
      collaborators: [],
      sharedWithInstitutions: [],
      isPublicResearch: false,
      renderingMetrics,
      systemSpecs,
      softwareVersion,
      publishedAt: null
    });

    res.json({ success: true, research });
  } catch (error) {
    console.error('Error creating research:', error);
    res.status(500).json({ error: 'Failed to create research entry' });
  }
});

// Get user's research entries
router.get('/api/research/my-research', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const research = await storage.getUserScientific4DResearch(req.user.id);
    res.json({ research });
  } catch (error) {
    console.error('Error fetching user research:', error);
    res.status(500).json({ error: 'Failed to fetch research data' });
  }
});

// Get public research entries
router.get('/api/research/public', async (req: Request, res: Response) => {
  try {
    const research = await storage.getPublicScientific4DResearch();
    res.json({ research });
  } catch (error) {
    console.error('Error fetching public research:', error);
    res.status(500).json({ error: 'Failed to fetch public research' });
  }
});

// Get research by type
router.get('/api/research/by-type/:type', async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const research = await storage.getScientific4DResearchByType(type);
    res.json({ research });
  } catch (error) {
    console.error('Error fetching research by type:', error);
    res.status(500).json({ error: 'Failed to fetch research by type' });
  }
});

// Get specific research entry
router.get('/api/research/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid research ID' });
    }

    const research = await storage.getScientific4DResearch(id);
    if (!research) {
      return res.status(404).json({ error: 'Research not found' });
    }

    // Increment download count
    await storage.updateScientific4DResearch(id, {
      downloadCount: (research.downloadCount || 0) + 1
    });

    res.json({ research });
  } catch (error) {
    console.error('Error fetching research:', error);
    res.status(500).json({ error: 'Failed to fetch research' });
  }
});

// Update research entry
router.put('/api/research/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid research ID' });
    }

    if (!req.user?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check if user owns this research
    const existingResearch = await storage.getScientific4DResearch(id);
    if (!existingResearch || existingResearch.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this research' });
    }

    const research = await storage.updateScientific4DResearch(id, req.body);
    if (!research) {
      return res.status(404).json({ error: 'Research not found' });
    }

    res.json({ success: true, research });
  } catch (error) {
    console.error('Error updating research:', error);
    res.status(500).json({ error: 'Failed to update research' });
  }
});

// Delete research entry
router.delete('/api/research/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid research ID' });
    }

    if (!req.user?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check if user owns this research
    const existingResearch = await storage.getScientific4DResearch(id);
    if (!existingResearch || existingResearch.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this research' });
    }

    const success = await storage.deleteScientific4DResearch(id);
    if (!success) {
      return res.status(404).json({ error: 'Research not found' });
    }

    res.json({ success: true, message: 'Research deleted successfully' });
  } catch (error) {
    console.error('Error deleting research:', error);
    res.status(500).json({ error: 'Failed to delete research' });
  }
});

// Update verification results for research
router.post('/api/research/:id/verify', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid research ID' });
    }

    const { verificationResults } = req.body;
    if (!verificationResults) {
      return res.status(400).json({ error: 'Verification results required' });
    }

    const research = await storage.validateScientific4DResearch(id, verificationResults);
    if (!research) {
      return res.status(404).json({ error: 'Research not found' });
    }

    res.json({ success: true, research });
  } catch (error) {
    console.error('Error validating research:', error);
    res.status(500).json({ error: 'Failed to validate research' });
  }
});

// Make research public
router.post('/api/research/:id/publish', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid research ID' });
    }

    if (!req.user?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check if user owns this research
    const existingResearch = await storage.getScientific4DResearch(id);
    if (!existingResearch || existingResearch.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to publish this research' });
    }

    const research = await storage.updateScientific4DResearch(id, {
      isPublicResearch: true,
      publicationStatus: 'published',
      publishedAt: new Date()
    });

    if (!research) {
      return res.status(404).json({ error: 'Research not found' });
    }

    res.json({ success: true, research });
  } catch (error) {
    console.error('Error publishing research:', error);
    res.status(500).json({ error: 'Failed to publish research' });
  }
});

// Upload 4D images/screenshots
router.post('/api/research/:id/upload-images', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid research ID' });
    }

    if (!req.user?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { imageUrls } = req.body;
    if (!imageUrls || !Array.isArray(imageUrls)) {
      return res.status(400).json({ error: 'Image URLs array required' });
    }

    // Check if user owns this research
    const existingResearch = await storage.getScientific4DResearch(id);
    if (!existingResearch || existingResearch.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this research' });
    }

    // Merge new image URLs with existing ones
    const currentUrls = Array.isArray(existingResearch.screenshotUrls) ? existingResearch.screenshotUrls : [];
    const updatedUrls = [...currentUrls, ...imageUrls];

    const research = await storage.updateScientific4DResearch(id, {
      screenshotUrls: updatedUrls
    });

    if (!research) {
      return res.status(404).json({ error: 'Research not found' });
    }

    res.json({ success: true, research, imageCount: updatedUrls.length });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

// Upload 4D videos
router.post('/api/research/:id/upload-videos', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid research ID' });
    }

    if (!req.user?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { videoUrls } = req.body;
    if (!videoUrls || !Array.isArray(videoUrls)) {
      return res.status(400).json({ error: 'Video URLs array required' });
    }

    // Check if user owns this research
    const existingResearch = await storage.getScientific4DResearch(id);
    if (!existingResearch || existingResearch.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this research' });
    }

    // Merge new video URLs with existing ones
    const currentUrls = Array.isArray(existingResearch.videoUrls) ? existingResearch.videoUrls : [];
    const updatedUrls = [...currentUrls, ...videoUrls];

    const research = await storage.updateScientific4DResearch(id, {
      videoUrls: updatedUrls
    });

    if (!research) {
      return res.status(404).json({ error: 'Research not found' });
    }

    res.json({ success: true, research, videoCount: updatedUrls.length });
  } catch (error) {
    console.error('Error uploading videos:', error);
    res.status(500).json({ error: 'Failed to upload videos' });
  }
});

export default router;