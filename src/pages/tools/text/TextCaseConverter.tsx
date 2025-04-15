
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const TextCaseConverter: React.FC = () => {
  const [text, setText] = useState('');

  const convertCase = (type: 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'kebab' | 'snake') => {
    switch (type) {
      case 'upper':
        setText(text.toUpperCase());
        break;
      case 'lower':
        setText(text.toLowerCase());
        break;
      case 'title':
        setText(text.toLowerCase().replace(/(?:^|\s)\w/g, letter => letter.toUpperCase()));
        break;
      case 'sentence':
        setText(text.toLowerCase().replace(/(^\w|\.\s+\w)/g, letter => letter.toUpperCase()));
        break;
      case 'camel':
        setText(text.toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()));
        break;
      case 'kebab':
        setText(text.toLowerCase()
          .replace(/[^a-zA-Z0-9]+/g, '-')
          .replace(/^-+|-+$/g, ''));
        break;
      case 'snake':
        setText(text.toLowerCase()
          .replace(/[^a-zA-Z0-9]+/g, '_')
          .replace(/^_+|_+$/g, ''));
        break;
    }
  };

  return (
    <ToolLayout
      title="Text Case Converter"
      description="Convert text between different cases (uppercase, lowercase, title case, etc.)"
      category="Text Tools"
      categoryColor="textTool"
      instructions={
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Enter or paste your text in the input area</li>
          <li>Choose the desired case conversion</li>
          <li>The text will be automatically converted</li>
        </ol>
      }
    >
      <div className="p-6 space-y-6">
        <Textarea
          placeholder="Enter your text here..."
          className="min-h-[200px] font-mono"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button onClick={() => convertCase('upper')}>UPPERCASE</Button>
          <Button onClick={() => convertCase('lower')}>lowercase</Button>
          <Button onClick={() => convertCase('title')}>Title Case</Button>
          <Button onClick={() => convertCase('sentence')}>Sentence case</Button>
          <Button onClick={() => convertCase('camel')}>camelCase</Button>
          <Button onClick={() => convertCase('kebab')}>kebab-case</Button>
          <Button onClick={() => convertCase('snake')}>snake_case</Button>
        </div>
      </div>
    </ToolLayout>
  );
};

export default TextCaseConverter;
