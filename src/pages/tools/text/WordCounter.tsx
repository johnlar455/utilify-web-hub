
import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
}

const WordCounter: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [stats, setStats] = useState<TextStats>({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    lines: 0,
  });

  useEffect(() => {
    const analyzeText = () => {
      // Count characters
      const characters = text.length;
      
      // Count characters excluding spaces
      const charactersNoSpaces = text.replace(/\s/g, '').length;
      
      // Count words
      const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
      
      // Count sentences
      const sentences = text === '' ? 0 : (text.match(/[.!?]+(?=\s|$)/g) || []).length;
      
      // Count paragraphs
      const paragraphs = text === '' ? 0 : text.split(/\n+/).filter(p => p.trim() !== '').length;
      
      // Count lines
      const lines = text === '' ? 0 : text.split('\n').length;
      
      setStats({
        characters,
        charactersNoSpaces,
        words,
        sentences,
        paragraphs,
        lines,
      });
    };

    analyzeText();
  }, [text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleClearClick = () => {
    setText('');
  };

  const StatItem: React.FC<{ label: string; value: number }> = ({ label, value }) => (
    <div className="flex flex-col items-center p-3 border rounded-md bg-background">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );

  return (
    <ToolLayout
      title="Word Counter"
      description="Analyze your text with character, word, sentence and paragraph count"
      category="Text Tools"
      categoryColor="textTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Type or paste your text in the input area</li>
          <li>View live statistics as you type</li>
          <li>Switch between tabs to see different visualizations</li>
        </ol>
      }
    >
      <Tabs defaultValue="counter">
        <div className="p-4 border-b">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="counter">Counter</TabsTrigger>
            <TabsTrigger value="density">Word Density</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="counter" className="p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <StatItem label="Characters" value={stats.characters} />
            <StatItem label="Characters (no spaces)" value={stats.charactersNoSpaces} />
            <StatItem label="Words" value={stats.words} />
            <StatItem label="Sentences" value={stats.sentences} />
            <StatItem label="Paragraphs" value={stats.paragraphs} />
            <StatItem label="Lines" value={stats.lines} />
          </div>
          
          <div className="relative">
            <Textarea
              placeholder="Type or paste your text here..."
              className="min-h-[200px] font-mono"
              value={text}
              onChange={handleTextChange}
            />
            {text && (
              <button
                onClick={handleClearClick}
                className="absolute top-2 right-2 p-1 rounded-sm bg-muted hover:bg-muted-foreground/20 text-muted-foreground text-xs"
              >
                Clear
              </button>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground text-right">
            All processing happens in your browser. No data is sent to any server.
          </div>
        </TabsContent>
        
        <TabsContent value="density" className="p-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Enter text in the counter tab to see word density analysis</p>
                {text ? (
                  <div className="text-sm">
                    <p>Feature coming soon!</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No text to analyze</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default WordCounter;
