import React, { useState, useRef } from 'react';
import { Camera, Download, Package, Loader2, Hash, Image, FileArchive } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useMathVisualization } from '../lib/stores/useMathVisualization';
import { getCryptoService } from '../lib/cryptoService';
import NFTExporter from '../lib/nftExporter';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

interface NFTSnapshotButtonProps {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
  currentShape: string;
  parameters: Record<string, number>;
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  animation_url: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  timestamp: string;
}

export const NFTSnapshotButton: React.FC<NFTSnapshotButtonProps> = ({
  scene,
  camera,
  renderer,
  currentShape,
  parameters
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [nftName, setNftName] = useState('4D_Element_Spiral_001');
  const [showPreview, setShowPreview] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const { surfaceParams } = useMathVisualization();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateNFTMetadata = (imageHash: string, modelHash: string): NFTMetadata => {
    const timestamp = new Date().toISOString();
    
    return {
      name: nftName,
      description: `Symbolic 4D NFT with encoded temporal geometry. Mathematical object: ${currentShape} with 23-parameter control system.`,
      image: `ipfs://Qm.../nft_image.png`,
      animation_url: `ipfs://Qm.../4D_model.gltf`,
      attributes: [
        { trait_type: "Dimension", value: "4D" },
        { trait_type: "Element", value: currentShape },
        { trait_type: "Hash", value: `sha256-${imageHash.substring(0, 16)}...` },
        { trait_type: "Mathematical_Type", value: getShapeCategory(currentShape) },
        { trait_type: "Parameter_Count", value: "23" },
        { trait_type: "Verification_Level", value: "Research-Grade" }
      ],
      timestamp
    };
  };

  const getShapeCategory = (shape: string): string => {
    if (shape.includes('4d')) return '4D Geometric';
    if (shape.includes('fractal')) return 'Fractal';
    if (shape.includes('sacred')) return 'Sacred Geometry';
    return 'Mathematical';
  };

  const calculateComplexityScore = (params: Record<string, number>): number => {
    const values = Object.values(params);
    const variance = values.reduce((sum, val) => sum + Math.pow(val - 1, 2), 0) / values.length;
    return Math.round(variance * 100);
  };

  const captureSnapshot = async (): Promise<string> => {
    return new Promise((resolve) => {
      renderer.render(scene, camera);
      const canvas = renderer.domElement;
      canvas.toBlob((blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        }
      });
    });
  };

  const exportGLTF = (): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const exporter = new GLTFExporter();
      exporter.parse(
        scene,
        (gltf) => {
          if (gltf instanceof ArrayBuffer) {
            resolve(gltf);
          } else {
            const buffer = new TextEncoder().encode(JSON.stringify(gltf));
            resolve(buffer);
          }
        },
        (error) => reject(error),
        { binary: true }
      );
    });
  };

  const generateSHA256 = async (data: string | ArrayBuffer): Promise<string> => {
    const encoder = new TextEncoder();
    const dataBuffer = typeof data === 'string' ? encoder.encode(data) : data;
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const createZipFile = async (files: Record<string, string | ArrayBuffer>): Promise<Blob> => {
    // Simple implementation - in production, use JSZip or similar
    const zipContent = Object.entries(files)
      .map(([filename, content]) => `${filename}: ${content}`)
      .join('\n\n');
    
    return new Blob([zipContent], { type: 'application/zip' });
  };

  const handleWalletConnect = async () => {
    try {
      const cryptoService = getCryptoService();
      const address = await cryptoService.connectWallet();
      setWalletConnected(!!address);
      if (address) {
        console.log('Wallet connected:', address);
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  };

  const handleBlockchainMint = async () => {
    setIsMinting(true);
    
    try {
      const nftExporter = NFTExporter.getInstance();
      const { pattern, color, brightness } = surfaceParams;
      
      const transactionHash = await nftExporter.mintToBlockchain({
        scene,
        camera,
        renderer,
        currentShape,
        parameters,
        pattern: pattern || 'default',
        color: color || 0x00ff00,
        brightness: brightness || 1.0
      });

      if (transactionHash) {
        setTransactionHash(transactionHash);
        setShowPreview(true);
        console.log('NFT minted successfully. Transaction hash:', transactionHash);
      } else {
        throw new Error('Minting failed - no transaction hash received');
      }
    } catch (error) {
      console.error('Blockchain minting failed:', error);
      alert('Minting failed: ' + (error as Error).message);
    } finally {
      setIsMinting(false);
    }
  };

  const handleNFTExport = async () => {
    setIsProcessing(true);
    
    try {
      // Capture snapshot
      const imageDataUrl = await captureSnapshot();
      const imageHash = await generateSHA256(imageDataUrl);
      
      // Export 3D model
      const gltfBuffer = await exportGLTF();
      const modelHash = await generateSHA256(gltfBuffer);
      
      // Generate metadata
      const metadata = generateNFTMetadata(imageHash, modelHash);
      
      // Create comprehensive package
      const files = {
        'nft_image.png': imageDataUrl,
        '4D_model.gltf': gltfBuffer,
        'metadata.json': JSON.stringify(metadata, null, 2),
        'transformation_log.json': JSON.stringify({
          parameters: surfaceParams,
          projection_method: "Stereographic 4D-to-3D",
          complexity_score: calculateComplexityScore(surfaceParams)
        }, null, 2),
        'symbolic_config.html': generateSymbolicConfig(),
        'preview.html': generatePreviewHTML(imageDataUrl)
      };
      
      // Create ZIP
      const zipBlob = await createZipFile(files);
      
      // Download
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${nftName}_4D_NFT_Package.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setShowPreview(true);
      
    } catch (error) {
      console.error('NFT Export Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateSymbolicConfig = (): string => {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>4D NFT Configuration</title>
  <style>
    body { font-family: monospace; background: #000; color: #0f0; }
    .param { margin: 5px 0; }
  </style>
</head>
<body>
  <h2>4D Mathematical NFT Configuration</h2>
  <div class="param">Shape: ${currentShape}</div>
  <div class="param">Parameters: ${JSON.stringify(surfaceParams)}</div>
  <div class="param">Timestamp: ${new Date().toISOString()}</div>
</body>
</html>
    `;
  };

  const generatePreviewHTML = (imageUrl: string): string => {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>4D NFT Preview</title>
  <style>
    body { font-family: Arial, sans-serif; text-align: center; background: #000; color: #fff; }
    img { max-width: 100%; border-radius: 10px; }
  </style>
</head>
<body>
  <h1>${nftName}</h1>
  <img src="${imageUrl}" alt="4D NFT Preview" />
  <p>Mathematical Shape: ${currentShape}</p>
  <p>Generated: ${new Date().toLocaleString()}</p>
</body>
</html>
    `;
  };

  return (
    <Card className="bg-black/80 border-green-500/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-green-400 flex items-center gap-2">
          <Package className="w-4 h-4" />
          4D NFT Export
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label className="text-green-300">NFT Name</Label>
          <Input
            value={nftName}
            onChange={(e) => setNftName(e.target.value)}
            className="bg-gray-900 border-green-500/30 text-green-300"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleNFTExport}
            disabled={isProcessing}
            className="flex-1 bg-green-600 hover:bg-green-500 text-black"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FileArchive className="w-4 h-4 mr-2" />
                Export NFT
              </>
            )}
          </Button>
        </div>
        
        <div className="space-y-2 pt-2 border-t border-green-500/30">
          {!walletConnected ? (
            <Button
              onClick={handleWalletConnect}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white"
            >
              Connect Wallet
            </Button>
          ) : (
            <Button
              onClick={handleBlockchainMint}
              disabled={isMinting}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white"
            >
              {isMinting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Minting to Blockchain...
                </>
              ) : (
                <>
                  <Hash className="w-4 h-4 mr-2" />
                  Mint to OpenSea
                </>
              )}
            </Button>
          )}
        </div>
        
        {showPreview && (
          <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">
                {transactionHash ? 'NFT Minted to Blockchain' : 'NFT Package Created'}
              </span>
            </div>
            <div className="text-xs text-green-300 space-y-1">
              <div>Shape: {currentShape}</div>
              <div>Parameters: {Object.keys(parameters).length} active</div>
              <div>Complexity: {calculateComplexityScore(parameters)}/100</div>
              {transactionHash && (
                <div className="pt-2 border-t border-green-500/30">
                  <div>Transaction: {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}</div>
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    View on Etherscan
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NFTSnapshotButton;