import { useState } from "react";
import { summarizeTextWithGroq, generateQuestionsFromGroq, translateTextWithGroq } from "../services/groqApi";

const TextProcessor = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [questions, setQuestions] = useState([]);
  const [translatedText, setTranslatedText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("French");

  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingTranslation, setLoadingTranslation] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) {
      alert("Please enter text to summarize.");
      return;
    }
    setLoadingSummary(true);
    const result = await summarizeTextWithGroq(text);
    setSummary(result);
    setLoadingSummary(false);
  };

  const handleGenerateQuestions = async () => {
    if (!summary.trim()) {
      alert("Please summarize the text first.");
      return;
    }
    setLoadingQuestions(true);
    const generatedQuestions = await generateQuestionsFromGroq(summary);
    setQuestions(generatedQuestions);
    setLoadingQuestions(false);
  };

  const handleTranslate = async () => {
    if (!summary.trim()) {
      alert("Please summarize the text first.");
      return;
    }
    setLoadingTranslation(true);
    const translated = await translateTextWithGroq(summary, targetLanguage);
    setTranslatedText(translated);
    setLoadingTranslation(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-12 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center w-full">
        Text Summarizer, Question Generator & Translator
      </h1>

      <div className="w-full max-w-screen-2xl grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Input Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg w-full">
          <h2 className="text-2xl font-semibold text-gray-700 mb-5">Enter Text</h2>
          <textarea
            className="w-full p-5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
            rows="10"
            placeholder="Enter your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col space-y-5">
            <button
              onClick={handleSummarize}
              className="bg-green-500 text-white py-4 rounded-lg text-lg font-medium hover:bg-green-600 transition"
              disabled={loadingSummary}
            >
              {loadingSummary ? "Summarizing..." : "Summarize"}
            </button>

            <button
              onClick={handleGenerateQuestions}
              className="bg-blue-500 text-white py-4 rounded-lg text-lg font-medium hover:bg-blue-600 transition"
              disabled={loadingQuestions}
            >
              {loadingQuestions ? "Generating Questions..." : "Generate Questions"}
            </button>

            {/* Translation Selection */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Translate To:</label>
              <select
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
              >
                <option value="French">French</option>
                <option value="Spanish">Spanish</option>
                <option value="German">German</option>
                <option value="Hindi">Hindi</option>
                <option value="Chinese">Chinese</option>
              </select>
            </div>

            <button
              onClick={handleTranslate}
              className="bg-purple-500 text-white py-4 rounded-lg text-lg font-medium hover:bg-purple-600 transition"
              disabled={loadingTranslation}
            >
              {loadingTranslation ? "Translating..." : "Translate Summary"}
            </button>
          </div>
        </div>

        {/* Right Column - Output Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg w-full">
          {summary && (
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-gray-700">Summary</h3>
              <p className="p-5 bg-gray-50 border border-gray-200 rounded-lg">{summary}</p>
            </div>
          )}

          {questions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-gray-700">Generated Questions</h3>
              <ul className="list-disc pl-6 bg-gray-50 p-5 border border-gray-200 rounded-lg">
                {questions.map((q, index) => (
                  <li key={index} className="text-gray-600 text-lg">{q}</li>
                ))}
              </ul>
            </div>
          )}

          {translatedText && (
            <div>
              <h3 className="text-2xl font-semibold text-gray-700">
                Translated Summary ({targetLanguage})
              </h3>
              <p className="p-5 bg-gray-50 border border-gray-200 rounded-lg">{translatedText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextProcessor;
