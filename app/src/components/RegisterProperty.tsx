import { useState } from 'react';
import { useStore } from '../lib/store';
import { getMidnightClient, isMidnightClientReady } from '../lib/midnight';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  Hash, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Shield,
  Building2,
  Sparkles
} from 'lucide-react';

export default function RegisterProperty() {
  const { isConnected } = useStore();
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isHashing, setIsHashing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ txHash: string; proof: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setHash('');
    setResult(null);
    setError(null);
    setProgress(0);
  };

  // Generate SHA-256 hash of the file
  const generateHash = async () => {
    if (!file) return;

    try {
      setIsHashing(true);
      setError(null);
      setProgress(10);
      
      const arrayBuffer = await file.arrayBuffer();
      setProgress(50);
      
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      setProgress(80);
      
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setHash(hashHex);
      setProgress(100);
      
      setTimeout(() => setProgress(0), 1000);
    } catch (err) {
      setError('Failed to generate file hash');
      console.error('Hash generation error:', err);
    } finally {
      setIsHashing(false);
    }
  };

  // Register property with Midnight.js
  const registerProperty = async () => {
    if (!hash || !isConnected) return;

    try {
      setIsRegistering(true);
      setError(null);
      setProgress(10);
      
      // Check if Midnight client is ready
      const midnightClient = getMidnightClient();
      setProgress(50);
      
      const response = await midnightClient.registerProperty(hash);
      setProgress(90);
      
      setResult(response);
      setProgress(100);
      
      setTimeout(() => setProgress(0), 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register property';
      
      if (errorMessage.includes('not initialized')) {
        setError('Please connect your Midnight wallet first to register properties.');
      } else {
        setError('Failed to register property: ' + errorMessage);
      }
      
      console.error('Registration error:', err);
    } finally {
      setIsRegistering(false);
    }
  };

  const formatHash = (hash: string) => {
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 mb-6">
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
              <Building2 className="w-3 h-3 mr-1" />
              Property Registration
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Register Property
            <span className="block bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              Documents
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Upload your property documents and register them securely with <span className="text-orange-400 font-semibold">blockchain immutability</span> and 
            <span className="text-red-400 font-semibold"> zero-knowledge proofs</span> on the Midnight Network.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-slate-800/50 backdrop-blur-lg border-purple-500/20 shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">Register Property</CardTitle>
                  <CardDescription className="text-gray-300">
                    Upload your property document and register it securely on the blockchain
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
        
            <CardContent className="space-y-6">
              {!isConnected && (
                <Alert className="border-red-500/20 bg-red-500/10">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">
                    Please connect your wallet to register a property.
                  </AlertDescription>
                </Alert>
              )}

              {/* File Upload Section */}
              <div className="space-y-3">
                <Label htmlFor="file-upload" className="text-gray-200 text-base font-medium">
                  Property Document (PDF)
                </Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      disabled={!isConnected || isRegistering || isHashing}
                      className="cursor-pointer bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  {file && (
                    <Badge variant="secondary" className="flex items-center gap-1 bg-orange-100 text-orange-800">
                      <Upload className="h-3 w-3" />
                      {file.name}
                    </Badge>
                  )}
                </div>
                {file && (
                  <p className="text-sm text-gray-400">
                    File size: {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </div>

              <Separator className="bg-slate-600/30" />

              {/* Hash Generation Section */}
              {file && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-200 text-base font-medium">Document Hash</Label>
                    <Button
                      onClick={generateHash}
                      disabled={!file || isRegistering || isHashing}
                      variant="outline"
                      size="sm"
                      className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50"
                    >
                      {isHashing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Hash className="mr-2 h-4 w-4" />
                          Generate Hash
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {isHashing && progress > 0 && (
                    <Progress value={progress} className="w-full" />
                  )}
                  
                  {hash && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        <span className="text-sm font-medium text-green-400">Hash Generated</span>
                      </div>
                      <div className="bg-slate-700/30 p-3 rounded-md border border-slate-600/30">
                        <p className="font-mono text-sm break-all text-gray-300">{hash}</p>
                      </div>
                      <p className="text-xs text-gray-400">
                        Short hash: <code className="bg-slate-700/30 px-1 rounded text-gray-300">{formatHash(hash)}</code>
                      </p>
                    </div>
                  )}
                </div>
              )}

              <Separator className="bg-slate-600/30" />

              {/* Registration Section */}
              {hash && (
                <div className="space-y-4">
                  <Button
                    onClick={registerProperty}
                    disabled={isRegistering || !hash || !isConnected || !isMidnightClientReady()}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    size="lg"
                  >
                    {isRegistering ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Registering Property...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-5 w-5" />
                        Register Property
                      </>
                    )}
                  </Button>
                  
                  {!isConnected && (
                    <p className="text-sm text-yellow-400 text-center">
                      Please connect your wallet first
                    </p>
                  )}
                  
                  {isConnected && !isMidnightClientReady() && (
                    <p className="text-sm text-blue-400 text-center">
                      Initializing Midnight client...
                    </p>
                  )}
                  
                  {isRegistering && progress > 0 && (
                    <Progress value={progress} className="w-full" />
                  )}
                </div>
              )}

              {/* Results Section */}
              {result && (
                <Alert className="border-green-500/20 bg-green-500/10">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-300">
                    <div className="space-y-2">
                      <p className="font-semibold">Registration Successful!</p>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="font-medium">Transaction Hash:</span>
                          <br />
                          <code className="text-xs bg-slate-700/30 px-2 py-1 rounded break-all">{result.txHash}</code>
                        </div>
                        <div>
                          <span className="font-medium">Proof:</span>
                          <br />
                          <code className="text-xs bg-slate-700/30 px-2 py-1 rounded break-all">{result.proof}</code>
                        </div>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Error Section */}
              {error && (
                <Alert className="border-red-500/20 bg-red-500/10">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">{error}</AlertDescription>
                </Alert>
              )}
        </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}