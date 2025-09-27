'use client';

import { useState } from 'react';
import { useStore } from '../lib/store';
import { getMidnightClient } from '../lib/midnight';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Upload, Hash, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

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
      
      const midnightClient = getMidnightClient();
      setProgress(50);
      
      const response = await midnightClient.registerProperty(hash);
      setProgress(90);
      
      setResult(response);
      setProgress(100);
      
      setTimeout(() => setProgress(0), 1000);
    } catch (err) {
      setError('Failed to register property');
      console.error('Registration error:', err);
    } finally {
      setIsRegistering(false);
    }
  };

  const formatHash = (hash: string) => {
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-2xl">Register Property</CardTitle>
              <CardDescription>
                Upload your property document and register it securely on the blockchain
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!isConnected && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please connect your wallet to register a property.
              </AlertDescription>
            </Alert>
          )}

          {/* File Upload Section */}
          <div className="space-y-3">
            <Label htmlFor="file-upload" className="text-base font-medium">
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
                  className="cursor-pointer"
                />
              </div>
              {file && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Upload className="h-3 w-3" />
                  {file.name}
                </Badge>
              )}
            </div>
            {file && (
              <p className="text-sm text-muted-foreground">
                File size: {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            )}
          </div>

          <Separator />

          {/* Hash Generation Section */}
          {file && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Document Hash</Label>
                <Button
                  onClick={generateHash}
                  disabled={!file || isRegistering || isHashing}
                  variant="outline"
                  size="sm"
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
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Hash Generated</span>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="font-mono text-sm break-all">{hash}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Short hash: <code className="bg-muted px-1 rounded">{formatHash(hash)}</code>
                  </p>
                </div>
              )}
            </div>
          )}

          <Separator />

          {/* Registration Section */}
          {hash && (
            <div className="space-y-4">
              <Button
                onClick={registerProperty}
                disabled={isRegistering || !hash || !isConnected}
                className="w-full"
                size="lg"
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering Property...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Register Property
                  </>
                )}
              </Button>
              
              {isRegistering && progress > 0 && (
                <Progress value={progress} className="w-full" />
              )}
            </div>
          )}

          {/* Results Section */}
          {result && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <div className="space-y-2">
                  <p className="font-semibold">Registration Successful!</p>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-medium">Transaction Hash:</span>
                      <br />
                      <code className="text-xs bg-white/50 px-1 rounded">{result.txHash}</code>
                    </div>
                    <div>
                      <span className="font-medium">Proof:</span>
                      <br />
                      <code className="text-xs bg-white/50 px-1 rounded">{result.proof}</code>
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Error Section */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}