import React, { useState, useRef } from "react";
import { Image, Trash2, PlusCircle } from "lucide-react"; // Lucide icons

const ComprehensionQuestion = ({ isPreview, passage, setPassage, comprehensionQuestion, setComprehensionQuestion, answer, setAnswer, comprehensionUploadedImage, setComprehensionUploadedImage }) => {
  
   // Single question
  const [options, setOptions] = useState(["", ""]); // Options array
   // Answer for the question
  const [correctOption, setCorrectOption] = useState(null); // Selected correct option
 
  const inputRef = useRef();

  // Add a new option
  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setComprehensionUploadedImage({ file, preview: URL.createObjectURL(file) });
    }
  };

  const handleRemoveImage = () => {
    setComprehensionUploadedImage(null);
    if (inputRef.current) inputRef.current.value = null;
  };

  const handleCorrectOptionSelect = (optionIndex) => {
    setCorrectOption(optionIndex);
  };

  if (isPreview) {
    return (
      <div className="p-4 bg-gray-100 rounded-md shadow-md space-y-4">
        <div>
          <h3 className="font-semibold text-lg">Passage:</h3>
          <p className="text-gray-800">{passage}</p>
        </div>
        {comprehensionUploadedImage && (
          <div className="mt-2">
            <img
              src={comprehensionUploadedImage.preview}
              alt="Preview"
              className="max-w-full h-auto max-h-48 object-contain rounded-md"
            />
          </div>
        )}
        <div className="p-2 border border-gray-300 rounded-md">
          <h4 className="font-medium text-gray-700">{`Q: ${comprehensionQuestion}`}</h4>
          <ul className="space-y-1 mt-2">
            {options.map((option, index) => (
              <li
                key={index}
                className={`p-2 rounded-md cursor-pointer ${
                  correctOption === index ? "bg-green-100 border-green-400" : "border-gray-300"
                } border hover:bg-gray-100`}
                onClick={() => handleCorrectOptionSelect(index)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-md shadow-md space-y-4">
  {/* Header with Upload Image */}
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-semibold">Comprehension Question</h2>
    <div className="flex items-center space-x-2">
      <input
        type="file"
        accept="image/*"
        id="questionImageUpload"
        ref={inputRef}
        name="questionImage"
        className="hidden"
        onChange={handleImageUpload}
      />
      <label
        htmlFor="questionImageUpload"
        className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
      >
        <Image className="mr-2 w-4 h-4" />
        Upload Image
      </label>
      {comprehensionUploadedImage && (
        <button
          onClick={handleRemoveImage}
          className="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
        >
          <Trash2 className="mr-2 w-4 h-4" />
          Remove
        </button>
      )}
    </div>
  </div>

  {/* Passage Input */}
  <div>
    <label htmlFor="passageInput" className="block text-gray-700 font-medium">
      Type Passage Here
    </label>
    <textarea
      id="passageInput"
      value={passage}
      onChange={(e) => setPassage(e.target.value)}
      className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      rows="4"
      placeholder="Enter the passage..."
    />
  </div>

  {/* Image Preview */}
  {comprehensionUploadedImage && (
    <div className="mt-2">
      <img
        src={comprehensionUploadedImage.preview}
        alt="Preview"
        className="max-w-full h-auto max-h-48 object-contain rounded-md"
      />
    </div>
  )}

  {/* Question */}
  <div>
    <label htmlFor="questionInput" className="block text-gray-700 font-medium">
      Question
    </label>
    <input
      type="text"
      id="questionInput"
      value={comprehensionQuestion}
      onChange={(e) => setComprehensionQuestion(e.target.value)}
      className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter the question..."
    />
  </div>

  {/* Options */}
  <div className="space-y-2">
    <label className="block text-gray-700 font-medium">Options</label>
    {options.map((option, index) => (
      <input
        key={index}
        type="text"
        value={option}
        onChange={(e) =>
          setOptions(
            options.map((opt, optIdx) => (optIdx === index ? e.target.value : opt))
          )
        }
        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={`Option ${index + 1}`}
      />
    ))}
    <button
      onClick={handleAddOption}
      className="flex items-center mt-2 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
    >
      <PlusCircle className="mr-2 w-4 h-4" />
      Add Another Option
    </button>
  </div>

  {/* Answer Field */}
  <div>
    <label htmlFor="answerInput" className="block text-gray-700 font-medium">
      Answer
    </label>
    <input
      type="text"
      id="answerInput"
      value={answer}
      onChange={(e) => setAnswer(e.target.value)}
      className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter the answer..."
    />
  </div>
</div>

  );
};

export default ComprehensionQuestion;
