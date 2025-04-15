
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import WordCounter from "./pages/tools/text/WordCounter";
import ImageResizer from "./pages/tools/image/ImageResizer";
import ImageToBase64 from "./pages/tools/image/ImageToBase64";
import AgeCalculator from "./pages/tools/calculators/AgeCalculator";
import JsonFormatter from "./pages/tools/dev/JsonFormatter";
import Base64Converter from "./pages/tools/binary/Base64Converter";
import HexConverter from "./pages/tools/binary/HexConverter";
import TextCaseConverter from "./pages/tools/text/TextCaseConverter";
import PercentageCalculator from "./pages/tools/calculators/PercentageCalculator";
import ColorConverter from "./pages/tools/converters/ColorConverter";
import HtmlMinifier from "./pages/tools/website/HtmlMinifier";
import CssMinifier from "./pages/tools/website/CssMinifier";
import RegexTester from "./pages/tools/dev/RegexTester";
import PasswordGenerator from "./pages/tools/misc/PasswordGenerator";
import UuidGenerator from "./pages/tools/misc/UuidGenerator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/tools/text/word-counter" element={<Layout><WordCounter /></Layout>} />
          <Route path="/tools/text/text-case-converter" element={<Layout><TextCaseConverter /></Layout>} />
          <Route path="/tools/image/image-resizer" element={<Layout><ImageResizer /></Layout>} />
          <Route path="/tools/image/image-to-base64" element={<Layout><ImageToBase64 /></Layout>} />
          <Route path="/tools/calculators/age-calculator" element={<Layout><AgeCalculator /></Layout>} />
          <Route path="/tools/calculators/percentage-calculator" element={<Layout><PercentageCalculator /></Layout>} />
          <Route path="/tools/converters/color-converter" element={<Layout><ColorConverter /></Layout>} />
          <Route path="/tools/binary/base64-converter" element={<Layout><Base64Converter /></Layout>} />
          <Route path="/tools/binary/hex-converter" element={<Layout><HexConverter /></Layout>} />
          <Route path="/tools/website/html-minifier" element={<Layout><HtmlMinifier /></Layout>} />
          <Route path="/tools/website/css-minifier" element={<Layout><CssMinifier /></Layout>} />
          <Route path="/tools/dev/json-formatter" element={<Layout><JsonFormatter /></Layout>} />
          <Route path="/tools/dev/regex-tester" element={<Layout><RegexTester /></Layout>} />
          <Route path="/tools/misc/password-generator" element={<Layout><PasswordGenerator /></Layout>} />
          <Route path="/tools/misc/uuid-generator" element={<Layout><UuidGenerator /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
