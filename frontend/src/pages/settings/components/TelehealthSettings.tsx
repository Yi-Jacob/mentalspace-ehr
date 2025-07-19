
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Video, 
  Monitor, 
  Shield, 
  Clock,
  Settings as SettingsIcon,
  Camera,
  Mic
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TelehealthSettings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    general: {
      enabled: true,
      platformName: 'MentalSpace Video',
      maxSessionDuration: 90,
      recordSessions: false,
      allowScreenShare: true,
      enableChat: true,
      waitingRoomEnabled: true,
    },
    security: {
      requirePatientId: true,
      endToEndEncryption: true,
      sessionPasswords: false,
      recordingConsent: true,
      hipaaCompliant: true,
    },
    technical: {
      videoQuality: 'hd',
      audioQuality: 'high',
      bandwidthOptimization: true,
      mobileSupport: true,
      browserRequirements: 'chrome_firefox_safari',
    },
    notifications: {
      joinReminders: true,
      connectionAlerts: true,
      recordingNotifications: true,
      sessionStartAlert: true,
    }
  });

  const handleSave = () => {
    toast({
      title: 'Telehealth Settings Saved',
      description: 'Your telehealth configuration has been updated successfully.',
    });
  };

  const handleTestConnection = () => {
    toast({
      title: 'Connection Test',
      description: 'Testing telehealth connection... Check network diagnostics.',
    });
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Video className="h-5 w-5" />
            <span>General Telehealth Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="telehealthEnabled">Enable telehealth services</Label>
            <Switch
              id="telehealthEnabled"
              checked={settings.general.enabled}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                general: {...settings.general, enabled: checked}
              })}
            />
          </div>

          <div>
            <Label htmlFor="platformName">Platform branding name</Label>
            <Input
              id="platformName"
              value={settings.general.platformName}
              onChange={(e) => setSettings({
                ...settings,
                general: {...settings.general, platformName: e.target.value}
              })}
              placeholder="Your Practice Video"
            />
          </div>

          <div>
            <Label htmlFor="maxDuration">Maximum session duration (minutes)</Label>
            <Select value={settings.general.maxSessionDuration.toString()} onValueChange={(value) => setSettings({
              ...settings,
              general: {...settings.general, maxSessionDuration: parseInt(value)}
            })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
                <SelectItem value="120">120 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="recordSessions">Allow session recording</Label>
            <Switch
              id="recordSessions"
              checked={settings.general.recordSessions}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                general: {...settings.general, recordSessions: checked}
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="screenShare">Enable screen sharing</Label>
            <Switch
              id="screenShare"
              checked={settings.general.allowScreenShare}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                general: {...settings.general, allowScreenShare: checked}
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="chatEnabled">Enable in-session chat</Label>
            <Switch
              id="chatEnabled"
              checked={settings.general.enableChat}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                general: {...settings.general, enableChat: checked}
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="waitingRoom">Enable waiting room</Label>
            <Switch
              id="waitingRoom"
              checked={settings.general.waitingRoomEnabled}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                general: {...settings.general, waitingRoomEnabled: checked}
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security & Compliance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="requireId">Require patient ID verification</Label>
            <Switch
              id="requireId"
              checked={settings.security.requirePatientId}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                security: {...settings.security, requirePatientId: checked}
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="encryption">End-to-end encryption</Label>
            <Switch
              id="encryption"
              checked={settings.security.endToEndEncryption}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                security: {...settings.security, endToEndEncryption: checked}
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sessionPasswords">Require session passwords</Label>
            <Switch
              id="sessionPasswords"
              checked={settings.security.sessionPasswords}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                security: {...settings.security, sessionPasswords: checked}
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="recordingConsent">Require recording consent</Label>
            <Switch
              id="recordingConsent"
              checked={settings.security.recordingConsent}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                security: {...settings.security, recordingConsent: checked}
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="hipaaCompliant">HIPAA compliant mode</Label>
            <Switch
              id="hipaaCompliant"
              checked={settings.security.hipaaCompliant}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                security: {...settings.security, hipaaCompliant: checked}
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Technical Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <SettingsIcon className="h-5 w-5" />
            <span>Technical Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="videoQuality">Video quality</Label>
            <Select value={settings.technical.videoQuality} onValueChange={(value) => setSettings({
              ...settings,
              technical: {...settings.technical, videoQuality: value}
            })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sd">Standard Definition (480p)</SelectItem>
                <SelectItem value="hd">High Definition (720p)</SelectItem>
                <SelectItem value="fhd">Full HD (1080p)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="audioQuality">Audio quality</Label>
            <Select value={settings.technical.audioQuality} onValueChange={(value) => setSettings({
              ...settings,
              technical: {...settings.technical, audioQuality: value}
            })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="high">High Quality</SelectItem>
                <SelectItem value="studio">Studio Quality</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="bandwidthOpt">Bandwidth optimization</Label>
            <Switch
              id="bandwidthOpt"
              checked={settings.technical.bandwidthOptimization}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                technical: {...settings.technical, bandwidthOptimization: checked}
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="mobileSupport">Mobile device support</Label>
            <Switch
              id="mobileSupport"
              checked={settings.technical.mobileSupport}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                technical: {...settings.technical, mobileSupport: checked}
              })}
            />
          </div>

          <div>
            <Label htmlFor="browserReq">Browser requirements</Label>
            <Select value={settings.technical.browserRequirements} onValueChange={(value) => setSettings({
              ...settings,
              technical: {...settings.technical, browserRequirements: value}
            })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chrome_firefox_safari">Chrome, Firefox, Safari</SelectItem>
                <SelectItem value="chrome_firefox">Chrome, Firefox only</SelectItem>
                <SelectItem value="chrome_only">Chrome only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-4">
            <Button onClick={handleTestConnection} variant="outline">
              <Camera className="h-4 w-4 mr-2" />
              Test Camera
            </Button>
            <Button variant="outline">
              <Mic className="h-4 w-4 mr-2" />
              Test Microphone
            </Button>
            <Button variant="outline">
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor className="h-5 w-5" />
            <span>Notification Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="joinReminders">Send join reminders</Label>
            <Switch
              id="joinReminders"
              checked={settings.notifications.joinReminders}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                notifications: {...settings.notifications, joinReminders: checked}
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="connectionAlerts">Connection quality alerts</Label>
            <Switch
              id="connectionAlerts"
              checked={settings.notifications.connectionAlerts}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                notifications: {...settings.notifications, connectionAlerts: checked}
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="recordingNotifs">Recording notifications</Label>
            <Switch
              id="recordingNotifs"
              checked={settings.notifications.recordingNotifications}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                notifications: {...settings.notifications, recordingNotifications: checked}
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sessionStart">Session start alerts</Label>
            <Switch
              id="sessionStart"
              checked={settings.notifications.sessionStartAlert}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                notifications: {...settings.notifications, sessionStartAlert: checked}
              })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="px-8">
          Save Telehealth Settings
        </Button>
      </div>
    </div>
  );
};

export default TelehealthSettings;
