import React, { useState } from "react";

const ClozeQuestion = () => {
  const [sentence, setSentence] = useState("");
  const [options, setOptions] = useState([]);
  const [preview, setPreview] = useState("");

  const handleSentenceChange = (e) => {
    const input = e.target.value;
    setSentence(input);
    updatePreview(input, options);
  };

  const handleUnderlineSelection = () => {
    const textarea = document.getElementById("sentenceInput");
    const selection = textarea.value.substring(
      textarea.selectionStart,
      textarea.selectionEnd
    );

    if (selection.trim() && !options.find((opt) => opt.word === selection.trim())) {
      const newOptions = [...options, { word: selection.trim(), checked: true }];
      setOptions(newOptions);
      updatePreview(sentence, newOptions);
    }
  };

  const toggleOption = (word) => {
    const updatedOptions = options.map((opt) =>
      opt.word === word ? { ...opt, checked: !opt.checked } : opt
    );
    setOptions(updatedOptions);
    updatePreview(sentence, updatedOptions);
  };

  const updatePreview = (input, optionList) => {
    let updatedPreview = input;

    optionList.forEach((opt) => {
      const regex = new RegExp(`\\b${opt.word}\\b`, "g");
      updatedPreview = opt.checked
        ? updatedPreview.replace(regex, "____")
        : updatedPreview.replace(/____/, opt.word);
    });

    setPreview(updatedPreview);
  };

  return (
    <div className="p-6 mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-lg font-semibold mb-4">Cloze Question</h2>

      {/* Preview Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Preview
        </label>
        <textarea
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          readOnly
          value={preview}
        ></textarea>
      </div>

      {/* Sentence Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sentence
        </label>
        <textarea
          id="sentenceInput"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Type the sentence here..."
          value={sentence}
          onChange={handleSentenceChange}
        ></textarea>
        <button
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none"
          onClick={handleUnderlineSelection}
        >
          Underline Selected Word
        </button>
      </div>

      {/* Options */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Options
        </label>
        <div className="flex flex-wrap gap-2">
          {options.map((opt, index) => (
            <label key={index} className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600"
                checked={opt.checked}
                onChange={() => toggleOption(opt.word)}
              />
              <span className="ml-2 text-sm">{opt.word}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Points */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Points
        </label>
        <input
          type="number"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Enter points"
        />
      </div>
    </div>
  );
};

export default ClozeQuestion;
