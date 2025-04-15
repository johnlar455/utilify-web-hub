
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

// English word lists by category
const nouns = ["time", "person", "year", "way", "day", "thing", "man", "world", "life", "hand", "part", "child", "eye", "woman", "place", "work", "week", "case", "point", "government", "company", "number", "group", "problem", "fact"];
const adjectives = ["good", "new", "first", "last", "long", "great", "little", "own", "other", "old", "right", "big", "high", "different", "small", "large", "next", "early", "young", "important", "few", "public", "bad", "same", "able"];
const verbs = ["be", "have", "do", "say", "get", "make", "go", "know", "take", "see", "come", "think", "look", "want", "give", "use", "find", "tell", "ask", "work", "seem", "feel", "try", "leave", "call"];
const adverbs = ["up", "so", "out", "just", "now", "how", "then", "more", "also", "here", "well", "only", "very", "even", "back", "there", "down", "still", "in", "as", "too", "when", "never", "really", "most"];

const RandomWordGenerator: React.FC = () => {
  const [wordCount, setWordCount] = useState<number>(5);
  const [includeNouns, setIncludeNouns] = useState<boolean>(true);
  const [includeAdjectives, setIncludeAdjectives] = useState<boolean>(true);
  const [includeVerbs, setIncludeVerbs] = useState<boolean>(false);
  const [includeAdverbs, setIncludeAdverbs] = useState<boolean>(false);
  const [generatedWords, setGeneratedWords] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  
  const generateWords = () => {
    // Combine selected word types
    let availableWords: string[] = [];
    if (includeNouns) availableWords = [...availableWords, ...nouns];
    if (includeAdjectives) availableWords = [...availableWords, ...adjectives];
    if (includeVerbs) availableWords = [...availableWords, ...verbs];
    if (includeAdverbs) availableWords = [...availableWords, ...adverbs];
    
    if (availableWords.length === 0) {
      toast.error('Please select at least one word type');
      return;
    }
    
    // Generate random words
    const result: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      result.push(availableWords[randomIndex]);
    }
    
    setGeneratedWords(result.join('\n'));
  };
  
  const copyToClipboard = () => {
    if (!generatedWords) return;
    
    navigator.clipboard.writeText(generatedWords)
      .then(() => {
        setIsCopied(true);
        toast.success('Words copied to clipboard');
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy words');
      });
  };
  
  return (
    <ToolLayout
      title="Random Word Generator"
      description="Generate random words for creative writing, brainstorming, or games"
      category="Text Tools"
      categoryColor="textTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Select the types of words you want to include</li>
          <li>Choose how many words to generate</li>
          <li>Click the Generate button</li>
          <li>Use the generated words for your creative projects</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wordCount">Number of Words</Label>
              <Input
                id="wordCount"
                type="number"
                min="1"
                max="100"
                value={wordCount}
                onChange={(e) => setWordCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              />
            </div>
            
            <div className="space-y-3">
              <Label>Word Types</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="includeNouns"
                    checked={includeNouns}
                    onCheckedChange={setIncludeNouns}
                  />
                  <Label htmlFor="includeNouns">Nouns</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="includeAdjectives"
                    checked={includeAdjectives}
                    onCheckedChange={setIncludeAdjectives}
                  />
                  <Label htmlFor="includeAdjectives">Adjectives</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="includeVerbs"
                    checked={includeVerbs}
                    onCheckedChange={setIncludeVerbs}
                  />
                  <Label htmlFor="includeVerbs">Verbs</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="includeAdverbs"
                    checked={includeAdverbs}
                    onCheckedChange={setIncludeAdverbs}
                  />
                  <Label htmlFor="includeAdverbs">Adverbs</Label>
                </div>
              </div>
            </div>
            
            <Button onClick={generateWords} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate Words
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="generatedWords">Generated Words</Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyToClipboard}
                disabled={!generatedWords}
              >
                {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                Copy
              </Button>
            </div>
            <Textarea
              id="generatedWords"
              value={generatedWords}
              placeholder="Words will appear here..."
              className="min-h-[250px] font-mono"
              readOnly
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default RandomWordGenerator;
