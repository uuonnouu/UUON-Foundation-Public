
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Loader2, Hash, DollarSign, Zap, Clock, Shield } from 'lucide-react';

interface HashProduct {
  id: number;
  hashId: string;
  sha256Hash: string;
  price: number;
  metadata: any;
  computationTime: number;
  createdAt: string;
  purchaseCount: number;
}

interface HashAnalytics {
  totalHashes: number;
  totalEnergyUsed: number;
  totalRevenue: number;
  averageComputationTime: number;
  energyEfficiency: number;
}

export default function HashMarketplace() {
  const [activeTab, setActiveTab] = useState('create');
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState('');
  const [iterations, setIterations] = useState(10000);
  const [forSale, setForSale] = useState(false);
  const [customSalt, setCustomSalt] = useState('');
  
  const [hashResult, setHashResult] = useState<any>(null);
  const [userHashes, setUserHashes] = useState<HashProduct[]>([]);
  const [marketplaceHashes, setMarketplaceHashes] = useState<HashProduct[]>([]);
  const [analytics, setAnalytics] = useState<HashAnalytics | null>(null);

  // Create custom hash
  const createHash = async () => {
    if (!inputData.trim()) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/hashing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          data: inputData,
          iterations,
          customSalt: customSalt || undefined,
          forSale,
          storeOriginal: false
        })
      });

      const result = await response.json();
      if (result.success) {
        setHashResult(result);
        await fetchUserHashes();
        await fetchAnalytics();
      }
    } catch (error) {
      console.error('Hash creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's hashes
  const fetchUserHashes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/hashing/my-hashes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const hashes = await response.json();
      setUserHashes(hashes);
    } catch (error) {
      console.error('Error fetching user hashes:', error);
    }
  };

  // Fetch marketplace hashes
  const fetchMarketplaceHashes = async () => {
    try {
      const response = await fetch('/api/hashing/marketplace');
      const hashes = await response.json();
      setMarketplaceHashes(hashes);
    } catch (error) {
      console.error('Error fetching marketplace:', error);
    }
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/hashing/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  // Purchase hash
  const purchaseHash = async (hashProductId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/hashing/purchase/${hashProductId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const result = await response.json();
      if (result.success) {
        await fetchMarketplaceHashes();
        alert('Hash purchased successfully!');
      }
    } catch (error) {
      console.error('Purchase error:', error);
    }
  };

  useEffect(() => {
    fetchUserHashes();
    fetchMarketplaceHashes();
    fetchAnalytics();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">SHA-256 Hash Marketplace</h1>
        <p className="text-muted-foreground">
          Create, monetize, and trade custom SHA-256 hashes with energy tracking
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="create">Create Hash</TabsTrigger>
          <TabsTrigger value="my-hashes">My Hashes</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Create Custom SHA-256 Hash
              </CardTitle>
              <CardDescription>
                Generate a custom hash with energy tracking and monetization options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Input Data</label>
                <Textarea
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  placeholder="Enter data to hash..."
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Iterations</label>
                  <Input
                    type="number"
                    value={iterations}
                    onChange={(e) => setIterations(parseInt(e.target.value) || 10000)}
                    min={1000}
                    max={100000}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Custom Salt (Optional)</label>
                  <Input
                    value={customSalt}
                    onChange={(e) => setCustomSalt(e.target.value)}
                    placeholder="Custom salt..."
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="forSale"
                  checked={forSale}
                  onChange={(e) => setForSale(e.target.checked)}
                />
                <label htmlFor="forSale" className="text-sm">
                  List for sale in marketplace
                </label>
              </div>

              <Button 
                onClick={createHash} 
                disabled={loading || !inputData.trim()}
                className="w-full"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating Hash...</>
                ) : (
                  <><Zap className="w-4 h-4 mr-2" /> Create Hash</>
                )}
              </Button>

              {hashResult && (
                <Card className="mt-4 bg-green-50 border-green-200">
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <p><strong>Hash ID:</strong> {hashResult.hashId}</p>
                      <p><strong>SHA-256:</strong> <code className="text-xs break-all">{hashResult.hash}</code></p>
                      <p><strong>Computation Time:</strong> {hashResult.computationTime}ms</p>
                      <p><strong>Energy Cost:</strong> {hashResult.energyCost} units</p>
                      <p><strong>Estimated Value:</strong> {hashResult.estimatedValue}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-hashes">
          <div className="space-y-4">
            {userHashes.map((hash) => (
              <Card key={hash.id}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Hash ID: {hash.hashId}</p>
                      <code className="text-xs break-all">{hash.sha256Hash}</code>
                      <div className="flex gap-4 mt-2">
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {hash.computationTime}ms
                        </Badge>
                        <Badge variant="outline">
                          <Zap className="w-3 h-3 mr-1" />
                          {hash.metadata?.energyCost} units
                        </Badge>
                        <Badge variant="outline">
                          <DollarSign className="w-3 h-3 mr-1" />
                          ${(hash.price / 100).toFixed(2)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Purchases: {hash.purchaseCount}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(hash.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="marketplace">
          <div className="space-y-4">
            {marketplaceHashes.map((hash) => (
              <Card key={hash.id}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <code className="text-xs break-all">{hash.sha256Hash}</code>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">
                          <Clock className="w-3 h-3 mr-1" />
                          {hash.computationTime}ms
                        </Badge>
                        <Badge variant="secondary">
                          Complexity: {hash.metadata?.complexity}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="font-semibold">${(hash.price / 100).toFixed(2)}</p>
                      <Button 
                        size="sm" 
                        onClick={() => purchaseHash(hash.id)}
                      >
                        <Shield className="w-4 h-4 mr-1" />
                        Purchase
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Hashes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{analytics.totalHashes}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Energy Used</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{analytics.totalEnergyUsed.toFixed(4)}</p>
                  <p className="text-sm text-muted-foreground">units</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">${analytics.totalRevenue.toFixed(2)}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Avg Computation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{analytics.averageComputationTime.toFixed(0)}</p>
                  <p className="text-sm text-muted-foreground">milliseconds</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Energy Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{analytics.energyEfficiency.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">hashes/unit</p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
