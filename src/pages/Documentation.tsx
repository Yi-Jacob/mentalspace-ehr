import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Book, 
  Code, 
  Users, 
  Shield, 
  AlertTriangle, 
  FileText,
  Search,
  Download,
  ExternalLink,
  CheckCircle
} from 'lucide-react';

const Documentation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const documentationSections = [
    {
      id: 'api',
      title: 'API Documentation',
      description: 'Complete REST API reference and examples',
      icon: Code,
      status: 'complete',
      items: ['REST Endpoints', 'Authentication', 'Rate Limiting', 'Error Codes']
    },
    {
      id: 'user-guides',
      title: 'User Guides',
      description: 'Step-by-step guides for end users',
      icon: Users,
      status: 'complete',
      items: ['Getting Started', 'Client Management', 'Documentation', 'Scheduling']
    },
    {
      id: 'architecture',
      title: 'System Architecture',
      description: 'Technical architecture and design decisions',
      icon: FileText,
      status: 'complete',
      items: ['Database Schema', 'Security Model', 'Deployment Architecture', 'Data Flow']
    },
    {
      id: 'compliance',
      title: 'HIPAA Compliance',
      description: 'Healthcare compliance documentation',
      icon: Shield,
      status: 'complete',
      items: ['BAA Templates', 'Privacy Policies', 'Security Controls', 'Audit Procedures']
    },
    {
      id: 'operations',
      title: 'Operations Manual',
      description: 'Deployment and maintenance procedures',
      icon: AlertTriangle,
      status: 'complete',
      items: ['Deployment Guide', 'Backup Procedures', 'Monitoring Setup', 'Incident Response']
    }
  ];

  const quickLinks = [
    { title: 'Getting Started Guide', url: '#user-guides', type: 'guide' },
    { title: 'API Reference', url: '#api', type: 'api' },
    { title: 'Security Overview', url: '#compliance', type: 'security' },
    { title: 'Deployment Guide', url: '#operations', type: 'ops' }
  ];

  const filteredSections = documentationSections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">MentalSpace Documentation</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive guides, API references, and technical documentation for the MentalSpace platform
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documentation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Book className="h-5 w-5" />
            <span>Quick Start</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <Button
                key={link.title}
                variant="outline"
                className="h-auto p-4 justify-start"
                onClick={() => document.getElementById(link.url.slice(1))?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="text-left">
                  <div className="font-medium">{link.title}</div>
                  <div className="text-xs text-muted-foreground capitalize">{link.type}</div>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documentation Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <Card key={section.id} id={section.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </div>
                  </div>
                  <Badge variant={section.status === 'complete' ? 'default' : 'secondary'}>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {section.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <div key={item} className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50 cursor-pointer">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{item}</span>
                      <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Documentation Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="api">API Docs</TabsTrigger>
          <TabsTrigger value="guides">User Guides</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentation Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">95%</div>
                  <div className="text-sm text-muted-foreground">Documentation Coverage</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">24</div>
                  <div className="text-sm text-muted-foreground">API Endpoints Documented</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-muted-foreground">User Guides Available</div>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <h3>Welcome to MentalSpace Documentation</h3>
                <p>
                  This comprehensive documentation provides everything you need to understand, implement, 
                  and maintain the MentalSpace healthcare practice management platform. Whether you're a 
                  healthcare provider, system administrator, or developer, you'll find detailed guides 
                  and references here.
                </p>
                
                <h4>What's Included</h4>
                <ul>
                  <li><strong>API Documentation:</strong> Complete REST API reference with examples</li>
                  <li><strong>User Guides:</strong> Step-by-step instructions for all platform features</li>
                  <li><strong>Architecture:</strong> Technical specifications and design decisions</li>
                  <li><strong>Compliance:</strong> HIPAA compliance documentation and procedures</li>
                  <li><strong>Operations:</strong> Deployment, monitoring, and maintenance guides</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>REST API Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Base URL</h4>
                  <code className="text-sm bg-background px-2 py-1 rounded">
                    https://wjaccopklttdvnutdmtu.supabase.co/rest/v1
                  </code>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Authentication</h4>
                  <p className="text-sm text-muted-foreground">
                    All API requests require authentication using Bearer tokens.
                  </p>
                  <div className="bg-muted/50 p-3 rounded text-sm">
                    <div className="font-mono">Authorization: Bearer &lt;your-token&gt;</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Core Endpoints</h4>
                  <div className="space-y-2">
                    {[
                      { method: 'GET', path: '/clients', description: 'List all clients' },
                      { method: 'POST', path: '/clients', description: 'Create a new client' },
                      { method: 'GET', path: '/clinical_notes', description: 'List clinical notes' },
                      { method: 'POST', path: '/clinical_notes', description: 'Create a clinical note' },
                      { method: 'GET', path: '/appointments', description: 'List appointments' },
                      { method: 'POST', path: '/appointments', description: 'Schedule appointment' }
                    ].map((endpoint) => (
                      <div key={`${endpoint.method}-${endpoint.path}`} className="flex items-center space-x-3 p-2 border rounded">
                        <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'default'}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm">{endpoint.path}</code>
                        <span className="text-sm text-muted-foreground">{endpoint.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Getting Started',
                description: 'Complete setup guide for new users',
                topics: ['Account Setup', 'First Login', 'Dashboard Overview', 'Navigation']
              },
              {
                title: 'Client Management',
                description: 'Managing patient records and information',
                topics: ['Adding Clients', 'Updating Records', 'Privacy Settings', 'Data Export']
              },
              {
                title: 'Clinical Documentation',
                description: 'Creating and managing clinical notes',
                topics: ['Progress Notes', 'Treatment Plans', 'Assessments', 'Signatures']
              },
              {
                title: 'Appointment Scheduling',
                description: 'Managing appointments and schedules',
                topics: ['Creating Appointments', 'Recurring Events', 'Reminders', 'Conflicts']
              }
            ].map((guide) => (
              <Card key={guide.title}>
                <CardHeader>
                  <CardTitle className="text-lg">{guide.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{guide.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {guide.topics.map((topic) => (
                      <div key={topic} className="flex items-center space-x-2 text-sm hover:text-primary cursor-pointer">
                        <CheckCircle className="h-3 w-3" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Architecture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose max-w-none">
                <h3>Technology Stack</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 not-prose">
                  {[
                    { name: 'React', type: 'Frontend' },
                    { name: 'TypeScript', type: 'Language' },
                    { name: 'Supabase', type: 'Backend' },
                    { name: 'PostgreSQL', type: 'Database' }
                  ].map((tech) => (
                    <div key={tech.name} className="text-center p-3 border rounded">
                      <div className="font-semibold">{tech.name}</div>
                      <div className="text-sm text-muted-foreground">{tech.type}</div>
                    </div>
                  ))}
                </div>

                <h3>Security Architecture</h3>
                <ul>
                  <li>Row-Level Security (RLS) for data isolation</li>
                  <li>JWT-based authentication and authorization</li>
                  <li>HTTPS encryption for all communications</li>
                  <li>Audit logging for all data access</li>
                </ul>

                <h3>Data Flow</h3>
                <p>
                  The application follows a standard three-tier architecture with clear separation 
                  between presentation, business logic, and data layers. All healthcare data is 
                  processed according to HIPAA compliance requirements.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>HIPAA Compliance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Administrative Safeguards</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Security Officer Assigned</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Workforce Training Program</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Access Management Procedures</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Technical Safeguards</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Access Control Systems</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Audit Logging</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Data Encryption</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Business Associate Agreement (BAA)</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Download our BAA template for healthcare organizations:
                </p>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download BAA Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;