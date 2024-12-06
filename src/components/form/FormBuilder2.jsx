// import React, { useState, useRef } from "react";
// import { PlusIcon, ImageIcon, TrashIcon } from "lucide-react";
// import CategorizeQuestion from "../questionTypes/CategorizeQuestion"; // Import the CategorizeQuestion component

// function FormBuilder() {
//   const [formName, setFormName] = useState("");
//   const [headerImage, setHeaderImage] = useState(null);
//   const [questions, setQuestions] = useState([]);

//   const fileInputRef = useRef(null);

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setHeaderImage({ file, preview: reader.result });
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const removeHeaderImage = () => {
//     setHeaderImage(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   // Add a new question
//   const addQuestion = (type) => {
//     const newQuestion = { id: Date.now(), type }; // Unique ID for each question
//     setQuestions([...questions, newQuestion]);
//   };

//   const renderQuestion = (question) => {
//     switch (question.type) {
//       case "categorize":
//         return <CategorizeQuestion key={question.id} />;
//       case "cloze":
//         return <div key={question.id} className="bg-gray-100 p-4 rounded-md">Cloze Question Component</div>;
//       case "comprehension":
//         return <div key={question.id} className="bg-gray-100 p-4 rounded-md">Comprehension Question Component</div>;
//       default:
//         return null;
//     }
//   };

//   const saveForm = () => {
//     const formData = {
//       name: formName,
//       headerImage: headerImage?.file,
//       questions,
//     };
//     console.log("Saving form:", formData);
//     // Implement save logic (e.g., API call)
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="bg-white shadow-xl rounded-lg p-6">
//         <div className="mb-6">
//           <input
//             type="text"
//             placeholder="Enter Form Name"
//             value={formName}
//             onChange={(e) => setFormName(e.target.value)}
//             className="w-full text-2xl font-bold border-b-2 border-blue-500 focus:outline-none focus:border-blue-700 transition-colors duration-300"
//           />
//         </div>

//         <div className="mb-6">
//           <div className="flex items-center space-x-4">
//             <input
//               type="file"
//               ref={fileInputRef}
//               accept="image/*"
//               onChange={handleImageUpload}
//               className="hidden"
//               id="headerImageUpload"
//             />
//             <label
//               htmlFor="headerImageUpload"
//               className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer transition-colors"
//             >
//               <ImageIcon className="mr-2" />
//               Add Header Image
//             </label>
//             {headerImage && (
//               <div className="relative">
//                 <img
//                   src={headerImage.preview}
//                   alt="Header"
//                   className="h-24 w-48 object-cover rounded-md"
//                 />
//                 <button
//                   onClick={removeHeaderImage}
//                   className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
//                 >
//                   <TrashIcon size={16} />
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="mb-6">
//           <h3 className="text-xl font-semibold mb-4">Add Question Types</h3>
//           <div className="flex space-x-4">
//             {[
//               { type: "categorize", label: "Categorize" },
//               { type: "cloze", label: "Cloze" },
//               { type: "comprehension", label: "Comprehension" },
//             ].map((questionType) => (
//               <button
//                 key={questionType.type}
//                 onClick={() => addQuestion(questionType.type)}
//                 className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
//               >
//                 <PlusIcon className="mr-2" />
//                 {questionType.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="space-y-4">
//           <h3 className="text-xl font-semibold">Questions</h3>
//           {questions.map(renderQuestion)}
//         </div>

//         <div className="mt-6 flex justify-end">
//           <button
//             onClick={saveForm}
//             disabled={!formName}
//             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Save Form
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FormBuilder;




















import React, { useState, useRef } from "react";
import { PlusIcon, ImageIcon, TrashIcon } from "lucide-react";
import CategorizeQuestion from "../questionTypes/CategorizeQuestion2"; // Import the CategorizeQuestion component

function FormBuilder() {
  const [formName, setFormName] = useState("");
  const [headerImage, setHeaderImage] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isPreview, setIsPreview] = useState(false); // Global preview state

  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeaderImage({ file, preview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeHeaderImage = () => {
    setHeaderImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Add a new question
  const addQuestion = (type) => {
    const newQuestion = { id: Date.now(), type }; // Unique ID for each question
    setQuestions([...questions, newQuestion]);
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case "Categorize":
        return <CategorizeQuestion key={question.id} isPreview={isPreview} />;
      case "Cloze":
        return (
          <div key={question.id} className="bg-gray-100 p-4 rounded-md">
            {isPreview ? "Cloze Question Preview" : "Cloze Question Component"}
          </div>
        );
      case "Comprehension":
        return (
          <div key={question.id} className="bg-gray-100 p-4 rounded-md">
            {isPreview
              ? "Comprehension Question Preview"
              : "Comprehension Question Component"}
          </div>
        );
      default:
        return null;
    }
  };

  // const saveForm = () => {
  //   const formData = {
  //     name: formName,
  //     headerImage: headerImage?.file,
  //     questions,
  //   };
  //   console.log("Saving form:", formData);
  //   // Implement save logic (e.g., API call)
  // };

  const saveForm = async () => {
    if (!formName) {
      alert("Form name is required!");
      return;
    }
  
    const formData = new FormData();
    formData.append("title", formName);
  
    if (headerImage?.file) {
      formData.append("headerImage", headerImage.file);
    }
  
    const formattedQuestions = questions.map((question) => ({
      type: question.type,
      content: question, // Add the actual question data here
      image: question.image || null, // You can handle question-specific images if required
    }));
  
    formData.append("questions", JSON.stringify(formattedQuestions));
  
    try {
      const response = await fetch("http://localhost:8000/api/v1/forms", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        alert("Form saved successfully!");
        console.log("Form data:", data);
      } else {
        const error = await response.json();
        alert(`Failed to save form: ${error.message}`);
      }
    } catch (err) {
      console.error("Error saving form:", err);
      alert("An unexpected error occurred while saving the form.");
    }
  };
  

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-xl rounded-lg p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Enter Form Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="w-full text-2xl font-bold border-b-2 border-blue-500 focus:outline-none focus:border-blue-700 transition-colors duration-300"
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="headerImageUpload"
            />
            <label
              htmlFor="headerImageUpload"
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer transition-colors"
            >
              <ImageIcon className="mr-2" />
              Add Header Image
            </label>
            {headerImage && (
              <div className="relative">
                <img
                  src={headerImage.preview}
                  alt="Header"
                  className="h-24 w-48 object-cover rounded-md"
                />
                <button
                  onClick={removeHeaderImage}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-xl font-semibold">Add Question Types</h3>
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`px-4 py-2 ${
              isPreview
                ? "bg-gray-500 hover:bg-gray-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white rounded-md transition-colors`}
          >
            {isPreview ? "Back to Edit" : "Preview Form"}
          </button>
        </div>

        {!isPreview && (
          <div className="flex space-x-4 mb-6">
            {[{ type: "Categorize", label: "Categorize" }, { type: "Cloze", label: "Cloze" }, { type: "Comprehension", label: "Comprehension" }].map(
              (questionType) => (
                <button
                  key={questionType.type}
                  onClick={() => addQuestion(questionType.type)}
                  className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                  <PlusIcon className="mr-2" />
                  {questionType.label}
                </button>
              )
            )}
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            {isPreview ? "Form Preview" : "Questions"}
          </h3>
          {questions.map(renderQuestion)}
        </div>

        {!isPreview && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={saveForm}
              disabled={!formName}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Form
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FormBuilder;
