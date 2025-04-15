
import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Match {
  text: string;
  index: number;
  length: number;
}

const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string>('');

  const [useGlobal, setUseGlobal] = useState(true);
  const [useMultiline, setUseMultiline] = useState(false);
  const [useInsensitive, setUseInsensitive] = useState(false);

  useEffect(() => {
    updateFlags();
  }, [useGlobal, useMultiline, useInsensitive]);

  const updateFlags = () => {
    let newFlags = '';
    if (useGlobal) newFlags += 'g';
    if (useMultiline) newFlags += 'm';
    if (useInsensitive) newFlags += 'i';
    setFlags(newFlags);
  };

  useEffect(() => {
    if (!pattern || !testText) {
      setMatches([]);
      setError('');
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const newMatches: Match[] = [];
      let match;

      if (flags.includes('g')) {
        while ((match = regex.exec(testText)) !== null) {
          newMatches.push({
            text: match[0],
            index: match.index,
            length: match[0].length,
          });
        }
      } else {
        match = regex.exec(testText);
        if (match) {
          newMatches.push({
            text: match[0],
            index: match.index,
            length: match[0].length,
          });
        }
      }

      setMatches(newMatches);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid regular expression');
      setMatches([]);
    }
  }, [pattern, testText, flags]);

  const highlightText = () => {
    if (!testText || matches.length === 0) return testText;

    let result = [];
    let lastIndex = 0;

    matches.forEach((match, i) => {
      // Add text before match
      if (match.index > lastIndex) {
        result.push(testText.substring(lastIndex, match.index));
      }

      // Add highlighted match
      result.push(
        <mark
          key={i}
          className="bg-yellow-200 dark:bg-yellow-800"
        >
          {testText.substr(match.index, match.length)}
        </mark>
      );

      lastIndex = match.index + match.length;
    });

    // Add remaining text
    if (lastIndex < testText.length) {
      result.push(testText.substring(lastIndex));
    }

    return result;
  };

  return (
    <ToolLayout
      title="Regex Tester"
      description="Test regular expressions with visual feedback"
      category="Dev Tools"
      categoryColor="devTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Enter your regular expression pattern</li>
          <li>Add test text to match against</li>
          <li>Configure regex flags as needed</li>
          <li>See matches highlighted in real-time</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pattern">Regular Expression</Label>
            <Input
              id="pattern"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern..."
              className="font-mono"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="global"
                checked={useGlobal}
                onCheckedChange={setUseGlobal}
              />
              <Label htmlFor="global">Global (g)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="multiline"
                checked={useMultiline}
                onCheckedChange={setUseMultiline}
              />
              <Label htmlFor="multiline">Multiline (m)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="insensitive"
                checked={useInsensitive}
                onCheckedChange={setUseInsensitive}
              />
              <Label htmlFor="insensitive">Case Insensitive (i)</Label>
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="test-text">Test Text</Label>
            <Textarea
              id="test-text"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Enter text to test against..."
              className="min-h-[200px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Results</Label>
            <div className="p-4 rounded-md border bg-muted min-h-[100px] whitespace-pre-wrap">
              {highlightText()}
            </div>
            <div className="text-sm text-muted-foreground">
              {matches.length} {matches.length === 1 ? 'match' : 'matches'} found
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default RegexTester;
