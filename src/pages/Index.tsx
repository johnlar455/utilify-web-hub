import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Type, 
  Image as ImageIcon, 
  Calculator, 
  ArrowLeftRight, 
  Binary, 
  Globe, 
  Code, 
  Package 
} from 'lucide-react';

interface ToolCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  tools: Tool[];
}

interface Tool {
  id: string;
  title: string;
  description: string;
  path: string;
  implemented: boolean;
}

const categories: ToolCategory[] = [
  {
    id: 'text',
    title: 'Text Tools',
    description: 'Analyze, format and manipulate text with ease',
    icon: Type,
    color: 'textTool',
    gradient: 'textTool-gradient',
    tools: [
      {
        id: 'word-counter',
        title: 'Word Counter',
        description: 'Count characters, words, sentences and paragraphs',
        path: '/tools/text/word-counter',
        implemented: true,
      },
      {
        id: 'text-case-converter',
        title: 'Text Case Converter',
        description: 'Convert text between cases (upper, lower, title, etc.)',
        path: '/tools/text/text-case-converter',
        implemented: true,
      },
      {
        id: 'text-to-slug',
        title: 'Text to Slug',
        description: 'Convert text to URL-friendly slugs',
        path: '/tools/text/text-to-slug',
        implemented: true,
      },
      {
        id: 'lorem-ipsum-generator',
        title: 'Lorem Ipsum Generator',
        description: 'Generate placeholder text for designs',
        path: '/tools/text/lorem-ipsum-generator',
        implemented: true,
      },
      {
        id: 'remove-line-breaks',
        title: 'Remove Line Breaks',
        description: 'Remove or add line breaks in text',
        path: '/tools/text/remove-line-breaks',
        implemented: true,
      },
      {
        id: 'random-word-generator',
        title: 'Random Word Generator',
        description: 'Generate random words for creative writing',
        path: '/tools/text/random-word-generator',
        implemented: true,
      },
    ],
  },
  {
    id: 'image',
    title: 'Image Tools',
    description: 'Resize, convert and optimize your images',
    icon: ImageIcon,
    color: 'imageTool',
    gradient: 'imageTool-gradient',
    tools: [
      {
        id: 'image-resizer',
        title: 'Image Resizer',
        description: 'Resize and compress images with preview',
        path: '/tools/image/image-resizer',
        implemented: true,
      },
      {
        id: 'image-to-base64',
        title: 'Image to Base64',
        description: 'Convert images to base64 encoded strings',
        path: '/tools/image/image-to-base64',
        implemented: true,
      },
      {
        id: 'base64-to-image',
        title: 'Base64 to Image',
        description: 'Convert base64 strings back to images',
        path: '/tools/image/base64-to-image',
        implemented: true,
      },
    ],
  },
  {
    id: 'calculators',
    title: 'Calculators',
    description: 'Handy calculators for various needs',
    icon: Calculator,
    color: 'calculatorTool',
    gradient: 'calculatorTool-gradient',
    tools: [
      {
        id: 'age-calculator',
        title: 'Age Calculator',
        description: 'Calculate age based on birth date',
        path: '/tools/calculators/age-calculator',
        implemented: true,
      },
      {
        id: 'percentage-calculator',
        title: 'Percentage Calculator',
        description: 'Calculate percentages easily',
        path: '/tools/calculators/percentage-calculator',
        implemented: true,
      },
      {
        id: 'average-calculator',
        title: 'Average Calculator',
        description: 'Calculate mean, median, mode and other statistics',
        path: '/tools/calculators/average-calculator',
        implemented: true,
      },
    ],
  },
  {
    id: 'converters',
    title: 'Converters',
    description: 'Convert between different units and formats',
    icon: ArrowLeftRight,
    color: 'converterTool',
    gradient: 'converterTool-gradient',
    tools: [
      {
        id: 'length-converter',
        title: 'Length Converter',
        description: 'Convert between different units of length',
        path: '/tools/converters/length-converter',
        implemented: true,
      },
      {
        id: 'unit-converter',
        title: 'Unit Converter',
        description: 'Convert between different measurement units',
        path: '/tools/converters/unit-converter',
        implemented: true,
      },
      {
        id: 'color-converter',
        title: 'Color Converter',
        description: 'Convert between color formats (HEX, RGB, HSL)',
        path: '/tools/converters/color-converter',
        implemented: true,
      },
    ],
  },
  {
    id: 'binary',
    title: 'Binary Tools',
    description: 'Work with binary data and encoding',
    icon: Binary,
    color: 'binaryTool',
    gradient: 'binaryTool-gradient',
    tools: [
      {
        id: 'base64-converter',
        title: 'Base64 Encoder/Decoder',
        description: 'Convert text to/from Base64 encoding',
        path: '/tools/binary/base64-converter',
        implemented: true,
      },
      {
        id: 'hex-converter',
        title: 'Hex Converter',
        description: 'Convert text to/from hexadecimal',
        path: '/tools/binary/hex-converter',
        implemented: true,
      },
    ],
  },
  {
    id: 'website',
    title: 'Website Tools',
    description: 'Tools for web development and management',
    icon: Globe,
    color: 'websiteTool',
    gradient: 'websiteTool-gradient',
    tools: [
      {
        id: 'html-minifier',
        title: 'HTML Minifier',
        description: 'Minify HTML code to reduce file size',
        path: '/tools/website/html-minifier',
        implemented: true,
      },
      {
        id: 'css-minifier',
        title: 'CSS Minifier',
        description: 'Minify CSS code to reduce file size',
        path: '/tools/website/css-minifier',
        implemented: true,
      },
    ],
  },
  {
    id: 'dev',
    title: 'Dev Tools',
    description: 'Tools for developers and programmers',
    icon: Code,
    color: 'devTool',
    gradient: 'devTool-gradient',
    tools: [
      {
        id: 'json-formatter',
        title: 'JSON Formatter',
        description: 'Format, validate and beautify JSON data',
        path: '/tools/dev/json-formatter',
        implemented: true,
      },
      {
        id: 'regex-tester',
        title: 'Regex Tester',
        description: 'Test regular expressions with visual feedback',
        path: '/tools/dev/regex-tester',
        implemented: true,
      },
    ],
  },
  {
    id: 'misc',
    title: 'Miscellaneous',
    description: 'Other useful tools and utilities',
    icon: Package,
    color: 'miscTool',
    gradient: 'miscTool-gradient',
    tools: [
      {
        id: 'password-generator',
        title: 'Password Generator',
        description: 'Generate secure random passwords',
        path: '/tools/misc/password-generator',
        implemented: true,
      },
      {
        id: 'uuid-generator',
        title: 'UUID Generator',
        description: 'Generate random UUIDs (v4)',
        path: '/tools/misc/uuid-generator',
        implemented: true,
      },
    ],
  },
];

const Index: React.FC = () => {
  return (
    <div className="space-y-12">
      <section className="text-center space-y-4 mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Utilify Web Hub</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A collection of free, browser-based utility tools to help with everyday tasks
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="col-span-1">
            <div className={`rounded-lg p-0.5 ${category.gradient}`}>
              <div className="bg-card rounded-[calc(0.5rem-1px)] p-6 h-full">
                <div className="flex items-center mb-4">
                  <div className={`p-2 rounded-md bg-${category.color}/10 text-${category.color} mr-3`}>
                    <category.icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold">{category.title}</h2>
                </div>
                <p className="text-muted-foreground mb-4">{category.description}</p>
                <ul className="space-y-3">
                  {category.tools.map((tool) => (
                    <li key={tool.id}>
                      {tool.implemented ? (
                        <Link 
                          to={tool.path}
                          className="tool-card block p-3 rounded-md border hover:bg-muted/50 transition-all"
                        >
                          <div className="font-medium">{tool.title}</div>
                          <div className="text-sm text-muted-foreground">{tool.description}</div>
                        </Link>
                      ) : (
                        <div className="block p-3 rounded-md border bg-muted/30 opacity-60 cursor-not-allowed">
                          <div className="font-medium flex items-center">
                            {tool.title}
                            <span className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded">Coming soon</span>
                          </div>
                          <div className="text-sm text-muted-foreground">{tool.description}</div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
