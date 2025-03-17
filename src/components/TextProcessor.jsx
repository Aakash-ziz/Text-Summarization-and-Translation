import { useState } from "react";
import { summarizeTextWithGroq, generateQuestionsFromGroq, translateTextWithGroq } from "../services/groqApi";

const TextProcessor = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [questions, setQuestions] = useState([]);
  const [translatedText, setTranslatedText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("French");
  const [loading, setLoading] = useState({ summary: false, questions: false, translation: false });

  const handleAction = async (action) => {
    if (!text.trim()) return alert("Please enter text before proceeding.");
    
    setLoading((prev) => ({ ...prev, [action]: true }));

    let result;
    if (action === "summary") result = await summarizeTextWithGroq(text, { length: 50, simplicity: true });
    if (action === "questions") result = await generateQuestionsFromGroq(summary);
    if (action === "translation") result = await translateTextWithGroq(summary, targetLanguage);

    if (action === "summary") setSummary(result);
    if (action === "questions") setQuestions(result);
    if (action === "translation") setTranslatedText(result);

    setLoading((prev) => ({ ...prev, [action]: false }));
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">AI-Powered Text Processor</h1>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full">
          <h2 className="text-xl font-semibold mb-4">Enter Text</h2>
          <textarea
            className="w-full p-4 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 outline-none"
            rows="6"
            placeholder="Enter your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>

          <div className="mt-6 space-y-4">
            <button
              onClick={() => handleAction("summary")}
              className="w-full bg-blue-500 text-white py-3 rounded-md font-medium hover:bg-blue-600 transition disabled:bg-gray-500"
              disabled={loading.summary}
            >
              {loading.summary ? "Summarizing..." : "Summarize"}
            </button>

            <button
              onClick={() => handleAction("questions")}
              className="w-full bg-green-500 text-white py-3 rounded-md font-medium hover:bg-green-600 transition disabled:bg-gray-500"
              disabled={loading.questions || !summary}
            >
              {loading.questions ? "Generating..." : "Generate Questions"}
            </button>

            <div>
              <label className="block font-semibold mb-2">Translate To:</label>
              <select
                className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-purple-400 outline-none"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
              >
                {["French", "Spanish", "German", "Chinese"].map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handleAction("translation")}
              className="w-full bg-purple-500 text-white py-3 rounded-md font-medium hover:bg-purple-600 transition disabled:bg-gray-500"
              disabled={loading.translation || !summary}
            >
              {loading.translation ? "Translating..." : "Translate Summary"}
            </button>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full">
          {summary && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold">Summary</h3>
              <p className="p-4 bg-gray-700 border border-gray-600 rounded-md">{summary}</p>
            </div>
          )}

          {questions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold">Generated Questions</h3>
              <ul className="list-disc pl-5 bg-gray-700 p-4 border border-gray-600 rounded-md">
                {questions.map((q, index) => (
                  <li key={index} className="text-gray-300">{q}</li>
                ))}
              </ul>
            </div>
          )}

          {translatedText && (
            <div>
              <h3 className="text-xl font-semibold">
                Translated Summary ({targetLanguage})
              </h3>
              <p className="p-4 bg-gray-700 border border-gray-600 rounded-md">{translatedText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextProcessor;
