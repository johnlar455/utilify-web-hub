import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import WordCounter from "./pages/tools/text/WordCounter";
import TextCaseConverter from "./pages/tools/text/TextCaseConverter";
import TextToSlug from "./pages/tools/text/TextToSlug";
import LoremIpsumGenerator from "./pages/tools/text/LoremIpsumGenerator";
import RemoveLineBreaks from "./pages/tools/text/RemoveLineBreaks";
import RandomWordGenerator from "./pages/tools/text/RandomWordGenerator";
import ImageResizer from "./pages/tools/image/ImageResizer";
import ImageToBase64 from "./pages/tools/image/ImageToBase64";
import Base64ToImage from "./pages/tools/image/Base64ToImage";
import AgeCalculator from "./pages/tools/calculators/AgeCalculator";
import PercentageCalculator from "./pages/tools/calculators/PercentageCalculator";
import AverageCalculator from "./pages/tools/calculators/AverageCalculator";
import ConfidenceIntervalCalculator from "./pages/tools/calculators/ConfidenceIntervalCalculator";
import MarginCalculator from "./pages/tools/calculators/MarginCalculator";
import ProbabilityCalculator from "./pages/tools/calculators/ProbabilityCalculator";
import PaypalFeeCalculator from "./pages/tools/calculators/PaypalFeeCalculator";
import CpmCalculator from "./pages/tools/calculators/CpmCalculator";
import LoanCalculator from "./pages/tools/calculators/LoanCalculator";
import GstCalculator from "./pages/tools/calculators/GstCalculator";
import DaysCalculator from "./pages/tools/calculators/DaysCalculator";
import HoursCalculator from "./pages/tools/calculators/HoursCalculator";
import MonthCalculator from "./pages/tools/calculators/MonthCalculator";
import StripeFeeCalculator from "./pages/tools/calculators/StripeFeeCalculator";
import CalorieCalculator from "./pages/tools/calculators/CalorieCalculator";
import TdeeCalculator from "./pages/tools/calculators/TdeeCalculator";
import JsonFormatter from "./pages/tools/dev/JsonFormatter";
import Base64Converter from "./pages/tools/binary/Base64Converter";
import HexConverter from "./pages/tools/binary/HexConverter";
import ColorConverter from "./pages/tools/converters/ColorConverter";
import LengthConverter from "./pages/tools/converters/LengthConverter";
import UnitConverter from "./pages/tools/converters/UnitConverter";
import HtmlMinifier from "./pages/tools/website/HtmlMinifier";
import CssMinifier from "./pages/tools/website/CssMinifier";
import RegexTester from "./pages/tools/dev/RegexTester";
import PasswordGenerator from "./pages/tools/misc/PasswordGenerator";
import UuidGenerator from "./pages/tools/misc/UuidGenerator";
import AreaConverter from "./pages/tools/converters/AreaConverter";
import WeightConverter from "./pages/tools/converters/WeightConverter";
import VolumeConverter from "./pages/tools/converters/VolumeConverter";
import TemperatureConverter from "./pages/tools/converters/TemperatureConverter";
import TimeConverter from "./pages/tools/converters/TimeConverter";
import DigitalConverter from "./pages/tools/converters/DigitalConverter";
import SpeedConverter from "./pages/tools/converters/SpeedConverter";
import PressureConverter from "./pages/tools/converters/PressureConverter";
import PowerConverter from "./pages/tools/converters/PowerConverter";
import EnergyConverter from "./pages/tools/converters/EnergyConverter";
import AngleConverter from "./pages/tools/converters/AngleConverter";
import CurrencyConverter from "./pages/tools/converters/CurrencyConverter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          
          {/* Text Tools */}
          <Route path="/tools/text/word-counter" element={<Layout><WordCounter /></Layout>} />
          <Route path="/tools/text/text-case-converter" element={<Layout><TextCaseConverter /></Layout>} />
          <Route path="/tools/text/text-to-slug" element={<Layout><TextToSlug /></Layout>} />
          <Route path="/tools/text/lorem-ipsum-generator" element={<Layout><LoremIpsumGenerator /></Layout>} />
          <Route path="/tools/text/remove-line-breaks" element={<Layout><RemoveLineBreaks /></Layout>} />
          <Route path="/tools/text/random-word-generator" element={<Layout><RandomWordGenerator /></Layout>} />
          
          {/* Image Tools */}
          <Route path="/tools/image/image-resizer" element={<Layout><ImageResizer /></Layout>} />
          <Route path="/tools/image/image-to-base64" element={<Layout><ImageToBase64 /></Layout>} />
          <Route path="/tools/image/base64-to-image" element={<Layout><Base64ToImage /></Layout>} />
          
          {/* Calculator Tools */}
          <Route path="/tools/calculators/age-calculator" element={<Layout><AgeCalculator /></Layout>} />
          <Route path="/tools/calculators/percentage-calculator" element={<Layout><PercentageCalculator /></Layout>} />
          <Route path="/tools/calculators/average-calculator" element={<Layout><AverageCalculator /></Layout>} />
          <Route path="/tools/calculators/confidence-interval-calculator" element={<Layout><ConfidenceIntervalCalculator /></Layout>} />
          <Route path="/tools/calculators/margin-calculator" element={<Layout><MarginCalculator /></Layout>} />
          <Route path="/tools/calculators/probability-calculator" element={<Layout><ProbabilityCalculator /></Layout>} />
          <Route path="/tools/calculators/paypal-fee-calculator" element={<Layout><PaypalFeeCalculator /></Layout>} />
          <Route path="/tools/calculators/cpm-calculator" element={<Layout><CpmCalculator /></Layout>} />
          <Route path="/tools/calculators/loan-calculator" element={<Layout><LoanCalculator /></Layout>} />
          <Route path="/tools/calculators/gst-calculator" element={<Layout><GstCalculator /></Layout>} />
          <Route path="/tools/calculators/days-calculator" element={<Layout><DaysCalculator /></Layout>} />
          <Route path="/tools/calculators/hours-calculator" element={<Layout><HoursCalculator /></Layout>} />
          <Route path="/tools/calculators/month-calculator" element={<Layout><MonthCalculator /></Layout>} />
          <Route path="/tools/calculators/stripe-fee-calculator" element={<Layout><StripeFeeCalculator /></Layout>} />
          <Route path="/tools/calculators/calorie-calculator" element={<Layout><CalorieCalculator /></Layout>} />
          <Route path="/tools/calculators/tdee-calculator" element={<Layout><TdeeCalculator /></Layout>} />
          
          {/* Converter Tools */}
          <Route path="/tools/converters/unit-converter" element={<Layout><UnitConverter /></Layout>} />
          <Route path="/tools/converters/color-converter" element={<Layout><ColorConverter /></Layout>} />
          <Route path="/tools/converters/length-converter" element={<Layout><LengthConverter /></Layout>} />
          <Route path="/tools/converters/area-converter" element={<Layout><AreaConverter /></Layout>} />
          <Route path="/tools/converters/weight-converter" element={<Layout><WeightConverter /></Layout>} />
          <Route path="/tools/converters/volume-converter" element={<Layout><VolumeConverter /></Layout>} />
          <Route path="/tools/converters/temperature-converter" element={<Layout><TemperatureConverter /></Layout>} />
          <Route path="/tools/converters/time-converter" element={<Layout><TimeConverter /></Layout>} />
          <Route path="/tools/converters/digital-converter" element={<Layout><DigitalConverter /></Layout>} />
          <Route path="/tools/converters/speed-converter" element={<Layout><SpeedConverter /></Layout>} />
          <Route path="/tools/converters/pressure-converter" element={<Layout><PressureConverter /></Layout>} />
          <Route path="/tools/converters/power-converter" element={<Layout><PowerConverter /></Layout>} />
          <Route path="/tools/converters/energy-converter" element={<Layout><EnergyConverter /></Layout>} />
          <Route path="/tools/converters/angle-converter" element={<Layout><AngleConverter /></Layout>} />
          <Route path="/tools/converters/currency-converter" element={<Layout><CurrencyConverter /></Layout>} />
          
          {/* Binary Tools */}
          <Route path="/tools/binary/base64-converter" element={<Layout><Base64Converter /></Layout>} />
          <Route path="/tools/binary/hex-converter" element={<Layout><HexConverter /></Layout>} />
          
          {/* Website Tools */}
          <Route path="/tools/website/html-minifier" element={<Layout><HtmlMinifier /></Layout>} />
          <Route path="/tools/website/css-minifier" element={<Layout><CssMinifier /></Layout>} />
          
          {/* Dev Tools */}
          <Route path="/tools/dev/json-formatter" element={<Layout><JsonFormatter /></Layout>} />
          <Route path="/tools/dev/regex-tester" element={<Layout><RegexTester /></Layout>} />
          
          {/* Misc Tools */}
          <Route path="/tools/misc/password-generator" element={<Layout><PasswordGenerator /></Layout>} />
          <Route path="/tools/misc/uuid-generator" element={<Layout><UuidGenerator /></Layout>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
