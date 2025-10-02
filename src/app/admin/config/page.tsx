'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ProjectConfig {
  id: string;
  twitter_official: string | null;
  twitter_community: string | null;
  pump_fun_address: string | null;
  contract_address: string | null;
  dexscreener_pair: string | null;
  created_at: string;
  updated_at: string;
}

export default function ConfigPage() {
  const [config, setConfig] = useState<ProjectConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    twitter_official: '',
    twitter_community: '',
    pump_fun_address: '',
    contract_address: '',
    dexscreener_pair: ''
  });

  // Fetch current config
  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/config');
      const data = await response.json();
      setConfig(data);
      setFormData({
        twitter_official: data.twitter_official || '',
        twitter_community: data.twitter_community || '',
        pump_fun_address: data.pump_fun_address || '',
        contract_address: data.contract_address || '',
        dexscreener_pair: data.dexscreener_pair || ''
      });
    } catch (error) {
      console.error('Failed to fetch config:', error);
      toast.error('Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Configuration updated successfully!');
        setConfig(result.config);
      } else {
        throw new Error(result.error || 'Failed to update configuration');
      }
    } catch (error) {
      console.error('Failed to update config:', error);
      toast.error('Failed to update configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <div className="text-center">Loading configuration...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Project Configuration</h1>
          <p className="text-muted-foreground">
            Manage project links and contract addresses
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="twitter_official">Official Twitter</Label>
                <div className="flex gap-2">
                  <Input
                    id="twitter_official"
                    type="url"
                    placeholder="https://twitter.com/official"
                    value={formData.twitter_official}
                    onChange={(e) => handleInputChange('twitter_official', e.target.value)}
                  />
                  {formData.twitter_official && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(formData.twitter_official, 'Official Twitter')}
                    >
                      Copy
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter_community">Community Twitter</Label>
                <div className="flex gap-2">
                  <Input
                    id="twitter_community"
                    type="url"
                    placeholder="https://twitter.com/community"
                    value={formData.twitter_community}
                    onChange={(e) => handleInputChange('twitter_community', e.target.value)}
                  />
                  {formData.twitter_community && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(formData.twitter_community, 'Community Twitter')}
                    >
                      Copy
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pump_fun_address">Pump.fun Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="pump_fun_address"
                    type="url"
                    placeholder="https://pump.fun/coin/ADDRESS"
                    value={formData.pump_fun_address}
                    onChange={(e) => handleInputChange('pump_fun_address', e.target.value)}
                  />
                  {formData.pump_fun_address && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(formData.pump_fun_address, 'Pump.fun Address')}
                    >
                      Copy
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contract_address">Contract Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="contract_address"
                    type="text"
                    placeholder="0x1234...ABCD or full address"
                    value={formData.contract_address}
                    onChange={(e) => handleInputChange('contract_address', e.target.value)}
                  />
                  {formData.contract_address && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(formData.contract_address, 'Contract Address')}
                    >
                      Copy
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="dexscreener_pair">Dexscreener Pair Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="dexscreener_pair"
                    type="text"
                    placeholder="PAIR_ADDRESS for dexscreener chart"
                    value={formData.dexscreener_pair}
                    onChange={(e) => handleInputChange('dexscreener_pair', e.target.value)}
                  />
                  {formData.dexscreener_pair && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(formData.dexscreener_pair, 'Dexscreener Pair')}
                    >
                      Copy
                    </Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  This will be used in the chart: https://dexscreener.com/solana/{formData.dexscreener_pair || 'PAIR_ADDRESS'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Configuration'}
              </Button>
              <Button type="button" variant="outline" onClick={fetchConfig}>
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {config && (
        <Card>
          <CardHeader>
            <CardTitle>Current Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-sm">
              <div>
                <strong>Last Updated:</strong> {new Date(config.updated_at).toLocaleString()}
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <strong>Official Twitter:</strong>
                  <div className="text-muted-foreground break-all">
                    {config.twitter_official || 'Not set'}
                  </div>
                </div>
                <div>
                  <strong>Community Twitter:</strong>
                  <div className="text-muted-foreground break-all">
                    {config.twitter_community || 'Not set'}
                  </div>
                </div>
                <div>
                  <strong>Pump.fun:</strong>
                  <div className="text-muted-foreground break-all">
                    {config.pump_fun_address || 'Not set'}
                  </div>
                </div>
                <div>
                  <strong>Contract Address:</strong>
                  <div className="text-muted-foreground break-all">
                    {config.contract_address || 'Not set'}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <strong>Dexscreener Pair:</strong>
                  <div className="text-muted-foreground break-all">
                    {config.dexscreener_pair || 'Not set'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
