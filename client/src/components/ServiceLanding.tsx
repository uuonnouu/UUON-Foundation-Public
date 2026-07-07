
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Shield, Zap, DollarSign, Code, Globe, Users } from 'lucide-react';

interface ServiceCatalog {
  service: string;
  tagline: string;
  offerings: any;
  integration: any;
  useCases: string[];
  contact: any;
  metrics: any;
}

export default function ServiceLanding() {
  const [catalog, setCatalog] = useState<ServiceCatalog | null>(null);
  const [showcase, setShowcase] = useState<any>(null);

  useEffect(() => {
    // Fetch service catalog
    fetch('/api/services/catalog')
      .then(res => res.json())
      .then(setCatalog);
    
    // Fetch showcase
    fetch('/api/services/showcase')
      .then(res => res.json())
      .then(setShowcase);
  }, []);

  if (!catalog || !showcase) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            {catalog.service}
          </h1>
          <p className="text-xl text-gray-300 mb-8">{catalog.tagline}</p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              <Code className="w-5 h-5 mr-2" />
              Get API Access
            </Button>
            <Button size="lg" variant="outline">
              <Shield className="w-5 h-5 mr-2" />
              View Demo
            </Button>
          </div>
        </div>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {Object.entries(catalog.metrics).map(([key, value]) => (
            <Card key={key} className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-green-400">{value as string}</div>
                <div className="text-sm text-gray-400 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Service Offerings */}
        <Tabs defaultValue="individual" className="mb-16">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="individual">Individual</TabsTrigger>
            <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          </TabsList>

          {Object.entries(catalog.offerings).map(([key, offering]: [string, any]) => (
            <TabsContent key={key} value={key}>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {key === 'individual' && <Users className="w-5 h-5" />}
                    {key === 'enterprise' && <Globe className="w-5 h-5" />}
                    {key === 'marketplace' && <DollarSign className="w-5 h-5" />}
                    {offering.title}
                  </CardTitle>
                  <CardDescription>{offering.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Features:</h4>
                      <ul className="space-y-2">
                        {offering.features.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-green-400" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Pricing:</h4>
                      <p className="text-green-400 mb-4">{offering.pricing}</p>
                      <Badge variant="secondary" className="mb-4">
                        Endpoint: {offering.endpoint}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Competitive Advantages */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(showcase.advantages).map(([key, advantage]: [string, any]) => (
              <Card key={key} className="bg-gray-800/50 border-gray-700 hover:border-green-500 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">{advantage.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-3">{advantage.description}</p>
                  <p className="text-sm text-green-400">{advantage.benefit}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Use Cases</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalog.useCases.map((useCase: string, idx: number) => (
              <Badge key={idx} variant="outline" className="p-3 text-center border-gray-600">
                {useCase}
              </Badge>
            ))}
          </div>
        </div>

        {/* Integration Guide */}
        <Card className="bg-gray-800/50 border-gray-700 mb-16">
          <CardHeader>
            <CardTitle>Quick Integration</CardTitle>
            <CardDescription>Get started in minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Getting Started:</h4>
                <ol className="space-y-2">
                  {Object.entries(catalog.integration.gettingStarted).map(([step, description]) => (
                    <li key={step} className="flex gap-2">
                      <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                        {step.slice(-1)}
                      </span>
                      {description as string}
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Sample Code:</h4>
                <pre className="bg-gray-900 p-4 rounded text-sm overflow-x-auto">
                  <code>{catalog.integration.sampleCode.javascript}</code>
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact/CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Get Started?</h2>
          <div className="flex justify-center gap-4 mb-8">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Register Company API
            </Button>
            <Button size="lg" variant="outline">
              Browse Marketplace
            </Button>
          </div>
          <p className="text-gray-400">
            Join the future of cryptographic hashing with energy transparency and monetization
          </p>
        </div>
      </div>
    </div>
  );
}
