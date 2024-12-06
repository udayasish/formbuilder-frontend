
import React, { useState, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ImageIcon } from "lucide-react"; // Assuming you're using lucide-react for icons

const ClozeQuestion = ({ isPreview = false, preview, setPreview, filledBlanks, setFilledBlanks, uploadedImage, setUploadedImage, sentence, setSentence }) => {
 
  const [options, setOptions] = useState([]);
 
  
  const inputRef = useRef(null);

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

  const handleDrop = (index, item) => {
    if (!filledBlanks[index]) {
      setFilledBlanks((prev) => ({ ...prev, [index]: item.word }));
      const updatedOptions = options.filter((opt) => opt.word !== item.word);
      setOptions(updatedOptions);
    }
  };

  const handleRemoveFromBlank = (index) => {
    const word = filledBlanks[index];
    setOptions([...options, { word, checked: true }]);
    const updatedBlanks = { ...filledBlanks };
    delete updatedBlanks[index];
    setFilledBlanks(updatedBlanks);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage({file, preview: reader.result});
        console.log("Image uploaded:",uploadedImage);
        
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  // Preview Mode with Drag-and-Drop
  if (isPreview) {
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="p-6 mx-auto bg-white shadow-md rounded-md">
         

          {/* Image Display (if uploaded) */}
          {uploadedImage && (
            <div className="mb-4 relative">
              <img 
                src={uploadedImage.preview} 
                alt="Uploaded" 
                className="max-w-full h-auto max-h-64 object-contain rounded-md"
              />
            </div>
          )}

          {/* Options Display */}
          <div className="flex flex-wrap gap-4 mb-6">
            {options.map((opt, index) => (
              <DraggableOption key={index} word={opt.word} />
            ))}
          </div>

          {/* Sentence with Blanks */}
          <div className="flex flex-wrap gap-2">
            {preview.split(" ").map((word, index) => (
              word === "____" ? (
                <DroppableBlank
                  key={index}
                  index={index}
                  word={filledBlanks[index]}
                  onDrop={(item) => handleDrop(index, item)}
                  onRemove={() => handleRemoveFromBlank(index)}
                />
              ) : (
                <span key={index} className="text-gray-800">{word}</span>
              )
            ))}
          </div>
        </div>
      </DndProvider>
    );
  }

  // Normal Cloze Question Editor
  return (
    // <div className="p-6 mx-auto bg-white shadow-md rounded-md">
    //   <h2 className="text-lg font-semibold mb-4">Cloze Question</h2>
    //   <div className="mb-4 flex justify-end">
       
    //     <div className="flex items-center space-x-2">
    //       <input
    //         type="file"
    //         accept="image/*"
    //         id="questionImageUpload"
    //         ref={inputRef}
    //         name="questionImage"
    //         className="hidden"
    //         onChange={handleImageUpload}
    //       />
    //       <label
    //         htmlFor="questionImageUpload"
    //         className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
    //       >
    //         <ImageIcon className="mr-2" size={16} />
    //         Upload Image
    //       </label>
    //       {uploadedImage && (
    //         <button 
    //           onClick={handleRemoveImage}
    //           className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
    //         >
    //           Remove
    //         </button>
    //       )}
    //     </div>

    //     {/* Image Preview */}
    //     {uploadedImage && (
    //       <div className="mt-2">
    //         <img 
    //           src={uploadedImage.preview} 
    //           alt="Preview" 
    //           className="max-w-full h-auto max-h-48 object-contain rounded-md"
    //         />
    //       </div>
    //     )}
    //   </div>

    //   {/* Image Upload Section */}
      

    //   {/* Rest of the existing code remains the same */}
    //   {/* Preview Section */}
    //   <div className="mb-4">
    //     <label className="block text-sm font-medium text-gray-700 mb-1">
    //       Preview
    //     </label>
    //     <textarea
    //       className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
    //       readOnly
    //       value={preview}
    //     ></textarea>
    //   </div>

    //   {/* Sentence Section */}
    //   <div className="mb-4">
    //     <label className="block text-sm font-medium text-gray-700 mb-1">
    //       Sentence
    //     </label>
    //     <textarea
    //       id="sentenceInput"
    //       className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
    //       placeholder="Type the sentence here..."
    //       value={sentence}
    //       onChange={handleSentenceChange}
    //     ></textarea>
    //     <button
    //       className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none"
    //       onClick={handleUnderlineSelection}
    //     >
    //       Underline Selected Word
    //     </button>
    //   </div>

    //   {/* Options */}
    //   <div className="mb-4">
    //     <label className="block text-sm font-medium text-gray-700 mb-1">
    //       Options
    //     </label>
    //     <div className="flex flex-wrap gap-2">
    //       {options.map((opt, index) => (
    //         <label key={index} className="inline-flex items-center">
    //           <input

    //             type="checkbox"
    //             className="form-checkbox h-4 w-4 text-blue-600"
    //             checked={opt.checked}
    //             onChange={() => toggleOption(opt.word)}
    //           />
    //           <span className="ml-2 text-sm">{opt.word}</span>
    //         </label>
    //       ))}
    //     </div>
    //   </div>

    //   {/* Points */}
    //   <div>
    //     <label className="block text-sm font-medium text-gray-700 mb-1">
    //       Points
    //     </label>
    //     <input
    //       type="number"
    //       className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
    //       placeholder="Enter points"
    //     />
    //   </div>
    // </div>

    <div className="p-6 mx-auto bg-white shadow-md rounded-md">
  {/* Header Section */}
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold">Cloze Question</h2>
    {/* Image Upload Section */}
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
        <ImageIcon className="mr-2" size={16} />
        Upload Image
      </label>
      {uploadedImage && (
        <button
          onClick={handleRemoveImage}
          className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
        >
          Remove
        </button>
      )}
    </div>
  </div>

  {/* Image Preview */}
  {uploadedImage &&  (
    <div className="mb-4">
      <img
        src={uploadedImage.preview}
        alt="Preview"
        className="max-w-full h-auto max-h-48 object-contain rounded-md"
      />
    </div>
  )}
 

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

// Existing Draggable and Droppable components remain unchanged
const DraggableOption = ({ word }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "OPTION",
    item: { word },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {word}
    </div>
  );
};

const DroppableBlank = ({ index, word, onDrop, onRemove }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "OPTION",
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`w-16 h-10 border-2 rounded-md flex items-center justify-center ${
        isOver ? "border-blue-600 bg-blue-100" : "border-gray-300 bg-gray-100"
      }`}
    >
      {word ? (
        <div
          className="cursor-pointer"
          onClick={onRemove}
        >
          {word}
        </div>
      ) : (
        "____"
      )}
    </div>
  );
};

export default ClozeQuestion;