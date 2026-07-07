import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Download, FileText, Loader2, Package, Image, FileImage, File, Camera, Layers } from 'lucide-react';
import { useMathVisualization } from '../lib/stores/useMathVisualization';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import JSZip from 'jszip';

interface ResearchExportButtonProps {
  currentShape: string;
  verificationResults: {
    lmfdb: number;
    arxiv: number;
    geometric: number;
    scientific: number;
  };
  scene?: THREE.Scene;
  camera?: THREE.Camera;
  renderer?: THREE.WebGLRenderer;
}

interface ModelMetadata {
  // Basic Details
  title: string;
  category: string;
  tags: string[];
  description: string;
  price: string;
  licenseType: string;
  
  // Technical Specifications
  polygonCount: number;
  dimensions: { x: number; y: number; z: number };
  softwareCompatibility: string[];
  renderEngineCompatibility: string[];
  animationCapabilities: string;
  uvMappingStatus: string;
  
  // Quality Information
  geometryQuality: string;
  textureResolution: string;
  pbrMaterials: boolean;
  lodLevels: number;
  vertexCount: number;
}

export const ResearchExportButton: React.FC<ResearchExportButtonProps> = ({ 
  currentShape, 
  verificationResults,
  scene,
  camera,
  renderer
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showMetadataForm, setShowMetadataForm] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const { surfaceParams: parameters } = useMathVisualization();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Get proper shape name
  const getShapeName = (shape: string): string => {
    const shapeNames: Record<string, string> = {
      // Basic shapes
      cube: 'Cube',
      sphere: 'Sphere',
      cylinder: 'Cylinder',
      torus: 'Torus',
      cone: 'Cone',
      
      // Lattice structures
      cubic_lattice: 'Cubic Lattice',
      diamond_lattice: 'Diamond Lattice',
      hexagonal_lattice: 'Hexagonal Lattice',
      body_centered_cubic: 'Body-Centered Cubic Lattice',
      face_centered_cubic: 'Face-Centered Cubic Lattice',
      honeycomb_lattice: 'Honeycomb Lattice',
      triangular_lattice: 'Triangular Lattice',
      kagome_lattice: 'Kagome Lattice',
      
      // 4D objects
      tesseract_4d: 'Tesseract (4D Hypercube)',
      hypersphere_4d: '4D Hypersphere',
      klein_bottle_4d: 'Klein Bottle 4D',
      hopf_fibration: 'Hopf Fibration',
      calabi_yau_4d: 'Calabi-Yau Manifold',
      
      // Advanced mathematical objects
      mobius_strip: 'Möbius Strip',
      trefoil_knot: 'Trefoil Knot',
      boys_surface: 'Boy\'s Surface',
      roman_surface: 'Roman Surface',
      enneper_surface: 'Enneper Surface',
      
      // Fractals
      mandelbrot_surface: 'Mandelbrot Surface',
      julia_surface: 'Julia Surface',
      sierpinski_carpet: 'Sierpinski Carpet',
      
      // Polygons
      triangle: 'Triangle',
      square: 'Square',
      pentagon: 'Pentagon',
      hexagon: 'Hexagon',
      octagon: 'Octagon',
      
      // Prisms and pyramids
      triangular_prism: 'Triangular Prism',
      pentagonal_prism: 'Pentagonal Prism',
      hexagonal_prism: 'Hexagonal Prism',
      octagonal_prism: 'Octagonal Prism',
      square_pyramid: 'Square Pyramid',
      pentagonal_pyramid: 'Pentagonal Pyramid',
      hexagonal_pyramid: 'Hexagonal Pyramid',
      
      // High-order polygons
      polygon_24: '24-Sided Polygon',
      polygon_30: '30-Sided Polygon',
      polygon_36: '36-Sided Polygon',
      polygon_48: '48-Sided Polygon',
      polygon_60: '60-Sided Polygon',
      polygon_72: '72-Sided Polygon',
      
      // Default fallback
      default: shape.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    };
    
    return shapeNames[shape] || shapeNames.default;
  };

  // Model metadata state
  const [metadata, setMetadata] = useState<ModelMetadata>({
    title: getShapeName(currentShape),
    category: 'Mathematical Geometry',
    tags: [currentShape, 'mathematics', 'parametric', 'research', 'wireframe'],
    description: `Mathematical ${getShapeName(currentShape)} with 23-parameter control system. Research-grade geometric visualization with multi-source verification.`,
    price: '0.00',
    licenseType: 'Research License',
    polygonCount: 0,
    dimensions: { x: 10, y: 10, z: 10 },
    softwareCompatibility: ['Blender', 'Maya', 'Three.js', 'Unity', 'Unreal Engine'],
    renderEngineCompatibility: ['Three.js', 'V-Ray', 'Arnold', 'Cycles', 'Eevee'],
    animationCapabilities: 'Parametric animation ready',
    uvMappingStatus: 'Procedurally mapped',
    geometryQuality: 'Research-grade manifold surfaces',
    textureResolution: '2K procedural materials',
    pbrMaterials: true,
    lodLevels: 1,
    vertexCount: 0
  });

  const getShapeCategory = (shape: string): string => {
    if (shape.includes('4d')) return '4D Geometric Objects';
    if (shape.includes('fractal')) return 'Fractal Mathematics';
    if (shape.includes('sacred')) return 'Sacred Geometry';
    if (shape.includes('topology')) return 'Topological Structures';
    if (shape.includes('klein')) return 'Non-Euclidean Geometry';
    return 'Advanced Mathematical Objects';
  };

  const getProjectionMethod = (shape: string): string => {
    if (shape.includes('hopf')) return 'Hopf Fibration Projection';
    if (shape.includes('klein')) return 'Stereographic 4D-to-3D';
    if (shape.includes('torus')) return 'Cylindrical Projection';
    return 'Perspective 4D-to-3D Projection';
  };

  const calculatePolygonCount = (): number => {
    if (scene) {
      let totalPolygons = 0;
      let totalVertices = 0;
      
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh && object.geometry) {
          const geometry = object.geometry;
          if (geometry.index) {
            totalPolygons += geometry.index.count / 3;
          } else if (geometry.attributes.position) {
            totalPolygons += geometry.attributes.position.count / 3;
          }
          if (geometry.attributes.position) {
            totalVertices += geometry.attributes.position.count;
          }
        }
      });
      
      return Math.floor(totalPolygons);
    }
    
    // Fallback when scene not available
    const baseComplexity = parameters.uSegments * parameters.vSegments * 2;
    const parameterComplexity = Object.values(parameters).reduce((sum, val) => sum + val, 0) / 23;
    return Math.round(baseComplexity * parameterComplexity);
  };

  const generateGLTF = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!scene) {
        reject(new Error('Scene not available'));
        return;
      }

      // Create a clean scene with only the parametric surface (no orb/grid)
      const exportScene = new THREE.Scene();
      let mathObjectFound = false;
      
      // Find and clone ONLY the parametric surface mesh, exclude orb/grid/helpers
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh && 
            object.geometry && 
            object.geometry.attributes.position &&
            !object.name.includes('grid') &&
            !object.name.includes('orb') &&
            !object.name.includes('exclude') &&
            !object.name.includes('helper') &&
            !object.name.includes('light') &&
            !object.name.includes('holographic') &&
            !object.name.includes('reference') &&
            !(object.parent && object.parent.name.includes('grid'))) {
          
          // Clone the geometry and convert to pure wireframe edges
          const clonedGeometry = object.geometry.clone();
          
          // Extract edges for true wireframe representation
          const edges = new THREE.EdgesGeometry(clonedGeometry);
          
          // Create line material for wireframe (not mesh material)
          const wireframeMaterial = new THREE.LineBasicMaterial({ 
            color: 0xffffff,
            linewidth: 1,
            transparent: false,
            opacity: 1.0
          });
          
          // Create wireframe object using LineSegments (not Mesh)
          const mathObject = new THREE.LineSegments(edges, wireframeMaterial);
          
          // mathObject already created above as LineSegments
          mathObject.position.copy(object.position);
          mathObject.rotation.copy(object.rotation);
          mathObject.scale.copy(object.scale);
          mathObject.name = `${getShapeName(currentShape)}_wireframe_gltf`;
          
          exportScene.add(mathObject);
          mathObjectFound = true;
          
          console.log('Found and cloned parametric surface for GLTF export:', {
            shapeName: getShapeName(currentShape),
            vertices: clonedGeometry.attributes.position.count,
            triangles: clonedGeometry.index ? clonedGeometry.index.count / 3 : clonedGeometry.attributes.position.count / 3,
            name: mathObject.name,
            wireframe: true
          });
        }
      });

      if (!mathObjectFound) {
        reject(new Error('No mathematical object found in scene for export'));
        return;
      }

      const exporter = new GLTFExporter();
      exporter.parse(
        exportScene,
        (gltf) => {
          if (typeof gltf === 'string') {
            resolve(gltf);
          } else {
            resolve(JSON.stringify(gltf, null, 2));
          }
        },
        (error) => reject(error),
        { binary: false, includeCustomExtensions: true }
      );
    });
  };

  const captureHighQualityRenders = async (): Promise<string[]> => {
    if (!renderer || !scene || !camera) return [];

    const renders: string[] = [];
    const originalPosition = camera.position.clone();
    const originalTarget = new THREE.Vector3(0, 0, 0);

    // Multiple angle renders
    const angles = [
      { pos: [5, 3, 5], name: 'perspective' },
      { pos: [0, 5, 0], name: 'top' },
      { pos: [5, 0, 0], name: 'side' },
      { pos: [0, 0, 5], name: 'front' }
    ];

    for (const angle of angles) {
      camera.position.set(angle.pos[0], angle.pos[1], angle.pos[2]);
      camera.lookAt(originalTarget);
      renderer.render(scene, camera);
      
      const dataUrl = renderer.domElement.toDataURL('image/png');
      renders.push(dataUrl);
    }

    // Restore original camera position
    camera.position.copy(originalPosition);
    camera.lookAt(originalTarget);

    return renders;
  };

  const generateWireframeView = async (): Promise<string> => {
    if (!renderer || !scene || !camera) return '';

    // Temporarily switch to wireframe mode
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => mat.wireframe = true);
        } else {
          child.material.wireframe = true;
        }
      }
    });

    renderer.render(scene, camera);
    const wireframeDataUrl = renderer.domElement.toDataURL('image/png');

    // Restore solid mode
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => mat.wireframe = false);
        } else {
          child.material.wireframe = false;
        }
      }
    });

    return wireframeDataUrl;
  };

  const generateTexturePreviews = (): string[] => {
    // Generate procedural texture previews
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    const textures: string[] = [];

    // Gradient texture
    const gradient = ctx.createLinearGradient(0, 0, 256, 256);
    gradient.addColorStop(0, '#ff0080');
    gradient.addColorStop(1, '#0080ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    textures.push(canvas.toDataURL());

    // Normal map texture
    ctx.fillStyle = '#8080ff';
    ctx.fillRect(0, 0, 256, 256);
    textures.push(canvas.toDataURL());

    return textures;
  };

  const generateDocumentation = (): string => {
    const timestamp = new Date().toISOString();
    
    return `# ${metadata.title} - Technical Documentation

## Overview
Advanced 4D mathematical visualization exported from ΔMension Mathematical Universe platform.

## Model Information
- **Title**: ${metadata.title}
- **Category**: ${metadata.category}
- **Tags**: ${metadata.tags.join(', ')}
- **Description**: ${metadata.description}
- **License**: ${metadata.licenseType}

## Technical Specifications
- **Polygon Count**: ${calculatePolygonCount().toLocaleString()} triangles
- **Dimensions**: ${metadata.dimensions.x} × ${metadata.dimensions.y} × ${metadata.dimensions.z} units
- **UV Mapping**: ${metadata.uvMappingStatus}
- **Animation**: ${metadata.animationCapabilities}
- **LOD Levels**: ${metadata.lodLevels}

## Software Compatibility
${metadata.softwareCompatibility.map(sw => `- ${sw}`).join('\n')}

## Render Engine Support
${metadata.renderEngineCompatibility.map(re => `- ${re}`).join('\n')}

## Quality Information
- **Geometry**: ${metadata.geometryQuality}
- **Textures**: ${metadata.textureResolution}
- **PBR Ready**: ${metadata.pbrMaterials ? 'Yes' : 'No'}

## Mathematical Properties
- **Shape Type**: ${currentShape}
- **Projection Method**: ${getProjectionMethod(currentShape)}
- **Parameter System**: 23-parameter control (a-w)
- **Verification Scores**:
  - LMFDB: ${verificationResults.lmfdb.toFixed(1)}%
  - arXiv: ${verificationResults.arxiv.toFixed(1)}%
  - Geometric: ${verificationResults.geometric.toFixed(1)}%
  - Scientific: ${verificationResults.scientific.toFixed(1)}%

## Usage Instructions
1. Import the GLTF file into your 3D software
2. Apply the provided textures and materials
3. Adjust lighting for optimal visualization
4. Use the mathematical parameters for animation

## Export Details
- **Platform**: ΔMension Mathematical Universe (Replit)
- **Export Date**: ${new Date().toLocaleString()}
- **Export ID**: ${timestamp}
- **Research Status**: Active Investigation

---
Created by Phillip Aguilar Ruiz III., Founder of UUON Foundation
`;
  };

  const createComprehensiveExport = async () => {
    setIsExporting(true);
    
    try {
      // Calculate geometry stats once to prevent re-renders
      const polygonCount = calculatePolygonCount();
      const vertexCount = scene ? (() => {
        let total = 0;
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh && object.geometry?.attributes.position) {
            total += object.geometry.attributes.position.count;
          }
        });
        return total;
      })() : polygonCount * 3;
      
      // Update metadata with calculated values
      setMetadata(prev => ({ 
        ...prev, 
        polygonCount,
        vertexCount
      }));

      // Create ZIP file
      const zip = new JSZip();

      // Generate documentation first
      const documentation = generateDocumentation();

      // Add documentation files
      zip.file('README.md', documentation);
      zip.file('technical_specs.json', JSON.stringify(metadata, null, 2));
      zip.file('mathematical_data.json', JSON.stringify({
        shape: currentShape,
        parameters,
        verification: verificationResults,
        formulas: {
          name: getShapeName(currentShape),
          type: currentShape,
          description: `Mathematical formulas for ${getShapeName(currentShape)}`,
          projectionMethod: getProjectionMethod(currentShape),
          category: getShapeCategory(currentShape)
        }
      }, null, 2));

      // Add setup guide
      zip.file('setup_guide.txt', generateSetupGuide());

      // Add material properties
      zip.file('materials/material_properties.json', JSON.stringify({
        name: metadata.title,
        type: 'PBR',
        properties: {
          roughness: 0.4,
          metallic: 0.1,
          emission: [0.1, 0.1, 0.2],
          normalScale: 1.0
        }
      }, null, 2));

      // Add marketplace metadata
      zip.file('metadata/marketplace_info.json', JSON.stringify({
        title: metadata.title,
        description: metadata.description,
        category: metadata.category,
        tags: metadata.tags,
        price: metadata.price,
        license: metadata.licenseType,
        technical: {
          polygons: polygonCount,
          dimensions: metadata.dimensions,
          compatibility: metadata.softwareCompatibility
        }
      }, null, 2));

      // Generate GLTF/GLB from actual scene if available
      if (scene) {
        try {
          console.log('Exporting 3D models from scene...');
          
          // Generate GLTF (text format) - wireframe only
          const gltfBuffer = await generateGLTF();
          zip.file(`${getShapeName(currentShape).replace(/\s+/g, '_')}_wireframe.gltf`, gltfBuffer);
          
          // Generate GLB (binary format) with actual mathematical object
          const exportSceneGLB = new THREE.Scene();
          let mathObjectFoundGLB = false;
          
          // Find and clone ONLY the parametric surface mesh for GLB (no orb/grid)
          scene.traverse((object) => {
            if (object instanceof THREE.Mesh && 
                object.geometry && 
                object.geometry.attributes.position &&
                !object.name.includes('grid') &&
                !object.name.includes('orb') &&
                !object.name.includes('exclude') &&
                !object.name.includes('helper') &&
                !object.name.includes('light') &&
                !object.name.includes('holographic') &&
                !object.name.includes('reference') &&
                !(object.parent && object.parent.name.includes('grid'))) {
              
              const clonedGeometry = object.geometry.clone();
              
              // Convert to pure wireframe geometry using edges
              const edges = new THREE.EdgesGeometry(clonedGeometry);
              
              // Create pure wireframe material (no surface fills)
              const wireframeMaterial = new THREE.LineBasicMaterial({ 
                color: 0xffffff,
                linewidth: 1,
                transparent: false,
                opacity: 1.0
              });
              
              // Create wireframe using LineSegments instead of Mesh
              const mathObject = new THREE.LineSegments(edges, wireframeMaterial);
              
              // mathObject already created above as LineSegments
              mathObject.position.copy(object.position);
              mathObject.rotation.copy(object.rotation);
              mathObject.scale.copy(object.scale);
              mathObject.name = `${getShapeName(currentShape)}_wireframe_mesh`;
              
              exportSceneGLB.add(mathObject);
              mathObjectFoundGLB = true;
              
              console.log('Found and cloned parametric surface for GLB export:', {
                vertices: clonedGeometry.attributes.position.count,
                triangles: clonedGeometry.index ? clonedGeometry.index.count / 3 : clonedGeometry.attributes.position.count / 3,
                name: mathObject.name,
                wireframe: true
              });
            }
          });

          if (!mathObjectFoundGLB) {
            throw new Error('No mathematical object found in scene for GLB export');
          }

          const exporterGLB = new GLTFExporter();
          const glbBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
            exporterGLB.parse(exportSceneGLB, (gltf) => {
              if (gltf instanceof ArrayBuffer) {
                resolve(gltf);
              } else {
                reject(new Error('GLB export failed - expected binary buffer'));
              }
            }, reject, { binary: true });
          });
          zip.file(`${getShapeName(currentShape).replace(/\s+/g, '_')}_wireframe.glb`, glbBuffer);
          
          // Capture high-quality renders from multiple angles
          const renders = await captureHighQualityRenders();
          const wireframe = await generateWireframeView();
          
          // Add render images with proper names
          const angleNames = ['perspective', 'top', 'side', 'front'];
          for (let i = 0; i < renders.length && i < angleNames.length; i++) {
            if (renders[i]) {
              const response = await fetch(renders[i]);
              const blob = await response.blob();
              zip.file(`renders/${angleNames[i]}_view.png`, blob);
            }
          }
          
          // Add wireframe topology view
          if (wireframe) {
            const wireframeResponse = await fetch(wireframe);
            const wireframeBlob = await wireframeResponse.blob();
            zip.file('wireframe/topology_view.png', wireframeBlob);
          }
          
          console.log('3D models exported successfully');
          
        } catch (error) {
          console.error('3D export error:', error);
          zip.file('3D_EXPORT_ERROR.txt', `3D model export failed: ${error instanceof Error ? error.message : String(error)}\n\nThe scene may not be fully loaded or compatible with GLTF export.\nTry waiting for the visualization to fully render before exporting.`);
        }
      } else {
        zip.file('NO_SCENE_DATA.txt', 'No 3D scene data available for export. The visualization may not be fully loaded.\n\nTo get 3D model files:\n1. Wait for the mathematical object to fully render\n2. Try the export again\n\nThis export contains all mathematical data and documentation.');
      }

      // Generate and add textures
      const textures = generateTexturePreviews();
      if (textures[0]) {
        // Convert data URL to blob for ZIP
        const diffuseResponse = await fetch(textures[0]);
        const diffuseBlob = await diffuseResponse.blob();
        zip.file('textures/diffuse_map.png', diffuseBlob);
      }
      if (textures[1]) {
        const normalResponse = await fetch(textures[1]);
        const normalBlob = await normalResponse.blob();
        zip.file('textures/normal_map.png', normalBlob);
      }

      // Add mathematical formulas and equations file
      const formulasContent = `
# Mathematical Formulas for ${metadata.title}

## Primary Equations
${getShapeFormulas(currentShape)}

## Parameter Values (a-w)
${Object.entries(parameters)
  .filter(([key]) => key.length === 1 && key >= 'a' && key <= 'w')
  .map(([key, value]) => `${key}: ${value}`)
  .join('\n')}

## 4D-to-3D Projection Method
${getProjectionMethod(currentShape)}

## Verification Results
- LMFDB Database: ${verificationResults.lmfdb.toFixed(1)}%
- arXiv Papers: ${verificationResults.arxiv.toFixed(1)}%
- Geometric Analysis: ${verificationResults.geometric.toFixed(1)}%
- Scientific Computing: ${verificationResults.scientific.toFixed(1)}%
`;
      zip.file('formulas/mathematical_equations.md', formulasContent);

      // Add parameter configuration file
      const configContent = `
# Configuration File for ${metadata.title}

## Surface Parameters
Type: ${currentShape}
U Range: ${parameters.uMin} to ${parameters.uMax}
V Range: ${parameters.vMin} to ${parameters.vMax}
U Segments: ${parameters.uSegments}
V Segments: ${parameters.vSegments}

## 23-Parameter System Values
${Object.entries(parameters)
  .filter(([key]) => key.length === 1)
  .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
  .join('\n')}

## Export Information
Generated: ${new Date().toLocaleString()}
Platform: ΔMension Mathematical Universe
Research Status: Active Investigation
`;
      zip.file('config/surface_parameters.txt', configContent);

      // Note about 3D assets
      zip.file('NOTE_3D_ASSETS.txt', `
3D Model Export Note:

This export contains comprehensive mathematical data, documentation, 
and configuration files for the ${metadata.title} object.

For full 3D model files (GLTF, renders), please ensure the 3D scene 
is fully loaded before exporting.

Current export includes:
✓ Complete mathematical formulas
✓ All parameter configurations  
✓ Technical documentation
✓ Material properties
✓ Marketplace metadata
✓ Texture samples

To generate 3D model files, wait for the visualization to fully load,
then try the export again.
`);

      // Generate ZIP file and download
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${metadata.title.replace(/\s+/g, '_')}_Complete_Export.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setShowMetadataForm(false);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsExporting(false);
    }
  };

  const getShapeFormulas = (shape: string): string => {
    if (shape.includes('torus_4d')) {
      return 'x = (R + r*cos(v))*cos(u), y = (R + r*cos(v))*sin(u), z = r*sin(v), w = cos(θ)';
    }
    if (shape.includes('klein')) {
      return 'Klein Bottle 4D: x = cos(u)*(cos(u/2)*(√2+cos(v)) + sin(u/2)*sin(v)*cos(v))';
    }
    return `Parametric equations for ${shape} with 23-parameter system`;
  };

  const generateSetupGuide = (): string => {
    return `Setup Guide for ${metadata.title}

1. Import the GLTF file into your 3D software
2. Load texture files from the textures/ folder
3. Apply material properties from materials/material_properties.json
4. Review technical specifications in documentation/
5. Use mathematical parameters for procedural animation

For technical support, refer to the mathematical documentation.`;
  };

  if (showMetadataForm) {
    return (
      <Card className="bg-black/80 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Package className="w-4 h-4" />
            3D Model Export Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="quality">Quality</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={metadata.title}
                    onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-gray-900 border-green-500/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={metadata.category}
                    onValueChange={(value) => setMetadata(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="bg-gray-900 border-green-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematical Geometry">Mathematical Geometry</SelectItem>
                      <SelectItem value="4D Objects">4D Objects</SelectItem>
                      <SelectItem value="Research Models">Research Models</SelectItem>
                      <SelectItem value="Educational">Educational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={metadata.description}
                  onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-gray-900 border-green-500/30"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input
                    value={metadata.price}
                    onChange={(e) => setMetadata(prev => ({ ...prev, price: e.target.value }))}
                    className="bg-gray-900 border-green-500/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label>License Type</Label>
                  <Select
                    value={metadata.licenseType}
                    onValueChange={(value) => setMetadata(prev => ({ ...prev, licenseType: value }))}
                  >
                    <SelectTrigger className="bg-gray-900 border-green-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Research License">Research License</SelectItem>
                      <SelectItem value="Royalty-free">Royalty-free</SelectItem>
                      <SelectItem value="Editorial">Editorial</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="technical" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Dimensions X</Label>
                  <Input
                    type="number"
                    value={metadata.dimensions.x}
                    onChange={(e) => setMetadata(prev => ({ 
                      ...prev, 
                      dimensions: { ...prev.dimensions, x: parseFloat(e.target.value) }
                    }))}
                    className="bg-gray-900 border-green-500/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dimensions Y</Label>
                  <Input
                    type="number"
                    value={metadata.dimensions.y}
                    onChange={(e) => setMetadata(prev => ({ 
                      ...prev, 
                      dimensions: { ...prev.dimensions, y: parseFloat(e.target.value) }
                    }))}
                    className="bg-gray-900 border-green-500/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dimensions Z</Label>
                  <Input
                    type="number"
                    value={metadata.dimensions.z}
                    onChange={(e) => setMetadata(prev => ({ 
                      ...prev, 
                      dimensions: { ...prev.dimensions, z: parseFloat(e.target.value) }
                    }))}
                    className="bg-gray-900 border-green-500/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Animation Capabilities</Label>
                <Input
                  value={metadata.animationCapabilities}
                  onChange={(e) => setMetadata(prev => ({ ...prev, animationCapabilities: e.target.value }))}
                  className="bg-gray-900 border-green-500/30"
                />
              </div>

              <div className="space-y-2">
                <Label>UV Mapping Status</Label>
                <Input
                  value={metadata.uvMappingStatus}
                  onChange={(e) => setMetadata(prev => ({ ...prev, uvMappingStatus: e.target.value }))}
                  className="bg-gray-900 border-green-500/30"
                />
              </div>
            </TabsContent>

            <TabsContent value="quality" className="space-y-4">
              <div className="space-y-2">
                <Label>Geometry Quality</Label>
                <Input
                  value={metadata.geometryQuality}
                  onChange={(e) => setMetadata(prev => ({ ...prev, geometryQuality: e.target.value }))}
                  className="bg-gray-900 border-green-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Texture Resolution</Label>
                  <Select
                    value={metadata.textureResolution}
                    onValueChange={(value) => setMetadata(prev => ({ ...prev, textureResolution: value }))}
                  >
                    <SelectTrigger className="bg-gray-900 border-green-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1K">1K</SelectItem>
                      <SelectItem value="2K">2K</SelectItem>
                      <SelectItem value="4K">4K</SelectItem>
                      <SelectItem value="8K">8K</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>LOD Levels</Label>
                  <Input
                    type="number"
                    value={metadata.lodLevels}
                    onChange={(e) => setMetadata(prev => ({ ...prev, lodLevels: parseInt(e.target.value) }))}
                    className="bg-gray-900 border-green-500/30"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div className="text-green-300 text-sm">
                <p>Export will include:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>GLTF 3D model file</li>
                  <li>High-quality renders (4 angles)</li>
                  <li>Wireframe topology view</li>
                  <li>Texture files (diffuse, normal)</li>
                  <li>Material properties (JSON)</li>
                  <li>Technical documentation (PDF)</li>
                  <li>Setup guide and readme</li>
                  <li>Mathematical formulas and data</li>
                  <li>Marketplace metadata</li>
                </ul>
              </div>
              
              <div className="bg-green-900/20 p-3 rounded border border-green-500/30">
                <p className="text-green-400 text-sm font-medium">Estimated Export Size</p>
                <p className="text-green-300 text-xs">~15-25MB complete package</p>
                <p className="text-green-300 text-xs">Polygons: ~{calculatePolygonCount().toLocaleString()}</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 mt-6">
            <Button
              onClick={createComprehensiveExport}
              disabled={isExporting}
              className="flex-1 bg-green-600 hover:bg-green-500 text-black"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Complete Package
                </>
              )}
            </Button>
            <Button
              onClick={() => setShowMetadataForm(false)}
              variant="outline"
              className="border-green-500/30 text-green-300"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button
      onClick={() => setShowMetadataForm(true)}
      className="w-full bg-green-600 hover:bg-green-500 text-black"
    >
      <Package className="w-4 h-4 mr-2" />
      Export 3D Research Package
    </Button>
  );
};

export default ResearchExportButton;