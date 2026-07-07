
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { 
  scientific4DAPI, 
  Scientific4DVerificationResult,
  verifyAll4DShapes,
  quickVerify4D 
} from '../lib/4DScientificAPI';
import { SurfaceType } from '../../../shared/schema';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  BookOpen, 
  Microscope,
  BarChart3,
  RefreshCw,
  Download
} from 'lucide-react';

interface ScientificVerificationPanelProps {
  currentShape: SurfaceType;
  onVerificationComplete?: (result: Scientific4DVerificationResult) => void;
}

export const Scientific4DVerificationPanel: React.FC<ScientificVerificationPanelProps> = ({
  currentShape,
  onVerificationComplete
}) => {
  const [verificationResult, setVerificationResult] = useState<Scientific4DVerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [batchResults, setBatchResults] = useState<Map<SurfaceType, Scientific4DVerificationResult> | null>(null);
  const [activeTab, setActiveTab] = useState('current');

  useEffect(() => {
    // Auto-verify current shape when it changes
    if (currentShape && is4DShape(currentShape)) {
      handleQuickVerify(currentShape);
    }
  }, [currentShape]);

  useEffect(() => {
    // Load system status on mount
    loadSystemStatus();
  }, []);

  const is4DShape = (shapeType: SurfaceType): boolean => {
    const shape = shapeType.toString();
    return shape.includes('4d') || shape.includes('tesseract') || shape.includes('hypersphere') ||
           shape.includes('klein') || shape.includes('hopf') || shape.includes('clifford') ||
           shape.includes('simplex') || shape.includes('cross_polytope');
  };

  const handleQuickVerify = async (shapeType: SurfaceType) => {
    if (!is4DShape(shapeType)) return;
    
    setIsVerifying(true);
    try {
      const score = await quickVerify4D(shapeType);
      console.log(`Quick verification score for ${shapeType}: ${score}/100`);
    } catch (error) {
      console.error('Quick verification failed:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFullVerification = async () => {
    if (!is4DShape(currentShape)) return;
    
    setIsVerifying(true);
    try {
      const response = await scientific4DAPI.verifyShape({
        shapeType: currentShape,
        verificationLevel: 'comprehensive'
      });
      
      if (response.success && response.data) {
        setVerificationResult(response.data);
        onVerificationComplete?.(response.data);
      }
    } catch (error) {
      console.error('Full verification failed:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBatchVerification = async () => {
    setIsVerifying(true);
    try {
      const results = await verifyAll4DShapes();
      if (results) {
        setBatchResults(results);
        setActiveTab('batch');
      }
    } catch (error) {
      console.error('Batch verification failed:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const loadSystemStatus = async () => {
    try {
      const status = await scientific4DAPI.getSystemVerificationStatus();
      setSystemStatus(status);
    } catch (error) {
      console.error('Failed to load system status:', error);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (score >= 70) return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  const downloadReport = () => {
    if (!batchResults) return;
    
    const report = scientific4DAPI.generateScientificReport ? '' : 'Report generation not available';
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `4D_verification_report_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!is4DShape(currentShape)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Microscope className="w-5 h-5" />
            4D Scientific Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Select a 4D shape to enable scientific verification
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Microscope className="w-5 h-5" />
          4D Scientific Verification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">Current Shape</TabsTrigger>
            <TabsTrigger value="batch">Batch Analysis</TabsTrigger>
            <TabsTrigger value="system">System Status</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{currentShape}</h3>
              <div className="flex gap-2">
                <Button 
                  onClick={handleFullVerification}
                  disabled={isVerifying}
                  size="sm"
                >
                  {isVerifying ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Microscope className="w-4 h-4 mr-2" />
                  )}
                  Verify
                </Button>
              </div>
            </div>

            {verificationResult && (
              <div className="space-y-4">
                {/* Overall Score */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    {getScoreIcon(verificationResult.score)}
                    <span className="font-medium">Scientific Accuracy</span>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(verificationResult.score)}`}>
                    {verificationResult.score}/100
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Mathematical Accuracy</span>
                      <span>{Object.values(verificationResult.mathematicalAccuracy).filter(Boolean).length}/4</span>
                    </div>
                    <Progress 
                      value={(Object.values(verificationResult.mathematicalAccuracy).filter(Boolean).length / 4) * 100}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Scientific Compliance</span>
                      <span>{Object.values(verificationResult.scientificCompliance).filter(Boolean).length}/4</span>
                    </div>
                    <Progress 
                      value={(Object.values(verificationResult.scientificCompliance).filter(Boolean).length / 4) * 100}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Computational Verification</span>
                      <span>{Object.values(verificationResult.computationalVerification).filter(Boolean).length}/4</span>
                    </div>
                    <Progress 
                      value={(Object.values(verificationResult.computationalVerification).filter(Boolean).length / 4) * 100}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Visualization Accuracy</span>
                      <span>{Object.values(verificationResult.visualizationAccuracy).filter(Boolean).length}/4</span>
                    </div>
                    <Progress 
                      value={(Object.values(verificationResult.visualizationAccuracy).filter(Boolean).length / 4) * 100}
                      className="h-2"
                    />
                  </div>
                </div>

                {/* Issues and Recommendations */}
                {verificationResult.issues.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-red-600">Issues Found:</h4>
                    <ScrollArea className="h-20">
                      {verificationResult.issues.map((issue, index) => (
                        <div key={index} className="text-sm text-red-600 mb-1">
                          • {issue}
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                )}

                {verificationResult.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-600">Recommendations:</h4>
                    <ScrollArea className="h-20">
                      {verificationResult.recommendations.map((rec, index) => (
                        <div key={index} className="text-sm text-blue-600 mb-1">
                          • {rec}
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                )}

                {/* References */}
                {verificationResult.references.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Literature References:
                    </h4>
                    <ScrollArea className="h-16">
                      {verificationResult.references.map((ref, index) => (
                        <div key={index} className="text-sm text-muted-foreground mb-1">
                          {ref}
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="batch" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">All 4D Shapes Analysis</h3>
              <div className="flex gap-2">
                <Button 
                  onClick={handleBatchVerification}
                  disabled={isVerifying}
                  size="sm"
                >
                  {isVerifying ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <BarChart3 className="w-4 h-4 mr-2" />
                  )}
                  Run Batch
                </Button>
                {batchResults && (
                  <Button 
                    onClick={downloadReport}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Report
                  </Button>
                )}
              </div>
            </div>

            {batchResults && (
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {Array.from(batchResults.entries()).map(([shapeType, result]) => (
                    <div key={shapeType} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        {getScoreIcon(result.score)}
                        <span className="text-sm font-medium">{shapeType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={result.score >= 90 ? 'default' : result.score >= 70 ? 'secondary' : 'destructive'}>
                          {result.score}/100
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <h3 className="text-lg font-semibold">System Verification Status</h3>
            
            {systemStatus && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="text-2xl font-bold">{systemStatus.verifiedShapes}</div>
                    <div className="text-sm text-muted-foreground">Verified Shapes</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-2xl font-bold">{systemStatus.verificationCoverage}%</div>
                    <div className="text-sm text-muted-foreground">Coverage</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>System Coverage</span>
                    <span>{systemStatus.verifiedShapes}/{systemStatus.totalShapes}</span>
                  </div>
                  <Progress value={systemStatus.verificationCoverage} className="h-2" />
                </div>

                {systemStatus.criticalIssues.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-red-600">Critical Issues:</h4>
                    <ScrollArea className="h-20">
                      {systemStatus.criticalIssues.map((issue: string, index: number) => (
                        <div key={index} className="text-sm text-red-600 mb-1">
                          • {issue}
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Last verification: {new Date(systemStatus.lastVerification).toLocaleString()}
                </div>
              </div>
            )}

            <Button 
              onClick={loadSystemStatus}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Status
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Scientific4DVerificationPanel;
