import React, { useState, useRef, useEffect } from "react";
import { PlusIcon, ImageIcon, TrashIcon } from "lucide-react";
import CategorizeQuestion from "../questionTypes/CategorizeQuestion"; // Import the CategorizeQuestion component
import ClozeQuestion from "../questionTypes/ClozeQuestion";
import ComprehensionQuestion from "../questionTypes/ComprehensionQuestion";
import SuccessScreen from "../SuccessScreen";

function FormBuilder() {
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [successType, setSuccessType] = useState(""); // 'form' or 'response'


  const [formName, setFormName] = useState("");
  const [headerImage, setHeaderImage] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isPreview, setIsPreview] = useState(false); // Global preview state

  const [categories, setCategories] = useState(["Country", "City"]);
  const [items, setItems] = useState([
    { id: 1, name: "Paris", category: "City" },
    { id: 2, name: "Japan", category: "Country" },
    { id: 3, name: "USA", category: "Country" },
    { id: 4, name: "Mad", category: "City" }]
  );
  const [questionImage, setQuestionImage] = useState(null); // State for question image

  const fileInputRef = useRef(null);


  const [preview, setPreview] = useState("");
  const [filledBlanks, setFilledBlanks] = useState({}); 
  const [uploadedImage, setUploadedImage] = useState(null);
  const [sentence, setSentence] = useState("");




  const [passage, setPassage] = useState("");
  const [comprehensionQuestion, setComprehensionQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [comprehensionUploadedImage, setComprehensionUploadedImage] = useState(null);

  useEffect(() => {
    console.log("questionImage updated:", questionImage);
  }, [questionImage, setQuestionImage]);

  const handleHeaderImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeaderImage({ file, preview: reader.result });
        console.log("Header image updated:", headerImage);
        
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

  const renderQuestion = (quest) => {
    switch (quest.type) {
      case "Categorize":
        return <CategorizeQuestion key={quest.id} isPreview={isPreview} categories={categories} items={items} setCategories={setCategories} setItems={setItems} questionImage={questionImage} setQuestionImage={setQuestionImage} />;
      case "Cloze":
        return (
          // <div key={question.id} className="bg-gray-100 p-4 rounded-md">
          //   {isPreview ? "Cloze Question Preview" : "Cloze Question Component"}
          // </div>
          <ClozeQuestion key={quest.id} isPreview={isPreview} preview={preview} setPreview={setPreview} filledBlanks={filledBlanks} setFilledBlanks={setFilledBlanks} uploadedImage={uploadedImage} setUploadedImage={setUploadedImage} sentence={sentence} setSentence={setSentence} />
        );
      case "Comprehension":
        return (
         <ComprehensionQuestion key={quest.id} isPreview={isPreview} passage={passage} setPassage={setPassage}  answer={answer} setAnswer={setAnswer} comprehensionUploadedImage={comprehensionUploadedImage} setComprehensionUploadedImage={setComprehensionUploadedImage} comprehensionQuestion={comprehensionQuestion} setComprehensionQuestion={setComprehensionQuestion}/>
        );
      default:
        return null;
    }
  };


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

    // console.log("Here is headerImage", headerImage);
    
    // console.log("Here is questiomImage",questionImage.file);
    const formattedQuestions = questions.map((question) => {
      if (question.type === "Categorize") {
        // For Categorize type, include categories and items
       
        return {
          type: question.type,
          content: {
            categories, // Add the categories array
            items: items.map((item) => ({
              id: item.id,
              name: item.name,
              category: item.category,
            })), // Add items with their details
          },
          
          // image: questionImage.file || null, // Add question-specific image if provided
        };
        
        
      }
      else if (question.type === "Cloze") {
        return {
          type: question.type,
          content: {
            text: preview,
            answer: sentence,
          },
          image: uploadedImage?.file || null, // Safely access file, use null if undefined
        };
      }

      else {
        return {
          type: question.type,
          content: {
            passage: passage,
            questions: [
             {
              question: comprehensionQuestion,
              answer: answer
             }
            ]
          },
          image: comprehensionUploadedImage?.file || null, // Safely access file, use null if undefined
        };
      }

      // return {
      //   type: question.type,
      //   content: question.content || {}, // Other question types can use their default content
      //   image: question.image || null, // Other question images
      // };
    });
  
    formData.append("questions", JSON.stringify(formattedQuestions));
    
    // console.log("Formateed questions:", JSON.stringify(formattedQuestions));
    // // Append questionImage separately
    if (questionImage?.file) {
      formData.append("questionImage", questionImage.file);
    }
    if (uploadedImage?.file) {
      formData.append("questionImage", uploadedImage.file);
    }
    if (comprehensionUploadedImage?.file) {
      formData.append("questionImage", comprehensionUploadedImage.file);
    }
  

    setIsSubmittingForm(true); 
  
    try {
      const response = await fetch("https://formbuilder-backend-9z5u.onrender.com/api/v1/forms", {
        method: "POST",
        body: formData,
      });
    // try {
    //   const response = await fetch("http://localhost:8000/api/v1/forms", {
    //     method: "POST",
    //     body: formData,
    //   });
     
      
  
      if (response.ok) {
        const data = await response.json();
        // alert("Form saved successfully!");
        console.log("Form data:", data);
        setSuccessType("form");
      setShowSuccessScreen(true);

      } else {
        const error = await response.json();
        alert(`Failed to save form: ${error.message}`);
      }
    } catch (err) {
      console.error("Error saving form:", err);
      alert("An unexpected error occurred while saving the form.");
    }
    
      finally {
        setIsSubmittingForm(false); // Hide loader
      }
    
  };

  const saveResponse = async () => {
    setIsSubmittingResponse(true); // Show loader
    try {
      const userResponses = questions.map((question) => {
        if (question.type === "Categorize") {
          // Collect responses for Categorize questions
          return {
            type: "Categorize",
            content: items.map((item) => ({
              item: item.name,
              category: item.category,
            })),
          };
        } else if (question.type === "Cloze") {
          // Collect responses for Cloze questions
          return {
            type: "Cloze",
            content: {
              text: preview,
              answer: sentence,
            },
          };
        } else if (question.type === "Comprehension") {
          // Collect responses for Comprehension questions
          return {
            type: "Comprehension",
            content: {
              passage: passage,
              questions: [
                {
                  question: comprehensionQuestion,
                  answer: answer,
                },
              ],
            },
          };
        }
        return null; // Ignore unsupported question types
      }).filter(Boolean); // Remove null values
  
      if (userResponses.length === 0) {
        alert("No responses to submit!");
        return;
      }
  
      const response = await fetch("https://formbuilder-backend-9z5u.onrender.com/api/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userResponses }),
      });
  
      if (response.ok) {
       
        const data = await response.json();
        // alert("Response submitted successfully!");
        console.log("Response data:", data);
        setSuccessType("response");
        setShowSuccessScreen(true);
       
      } else {
        const error = await response.json();
        alert(`Failed to submit response: ${error.message}`);
      }
    } catch (err) {
      console.error("Error submitting response:", err);
      alert("An unexpected error occurred while submitting the response.");
    }
    finally {
      setIsSubmittingResponse(false); // Hide loader
    }

  };
  
  if (showSuccessScreen) {
    return (
      <SuccessScreen
        title={
          successType === "form"
            ? "Form Saved Successfully!"
            : "Response Submitted Successfully!"
        }
        message={
          successType === "form"
            ? "Your form has been saved. You can now create more forms or edit this one."
            : "Your response has been submitted successfully. Thank you!"
        }
        onClose={() => setShowSuccessScreen(false)} // Close success screen
      />
    );
  }
  

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
          onChange={handleHeaderImageUpload}
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
        className={`px-4 py-2 ${isPreview ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-500 hover:bg-blue-600"} text-white rounded-md transition-colors`}
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
      <h3 className="text-xl font-semibold">{isPreview ? "Form Preview" : "Questions"}</h3>
      {questions.map(renderQuestion)}
    </div>

    {isPreview && (
      <div className="mt-6 flex justify-end">
        <button
          onClick={saveResponse}
          
          className={`px-6 py-2 ${
            isSubmittingResponse
              ? "bg-gray-500"
              : "bg-green-600 hover:bg-green-700"
          } text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
        >
          {isSubmittingResponse && (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
          Submit Response
        </button>
      </div>
    )}

    {!isPreview && (
      <div className="mt-6 flex justify-end">
        <button
          onClick={saveForm}
          disabled={!formName}
          // className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          className={`px-6 py-2 ${
            isSubmittingForm ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          } text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
        >
          {isSubmittingForm && (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
          Save Form
        </button>
      </div>
    )}
  </div>
</div>

//   );









  // <div className="container mx-auto px-4 py-8">
  //   <div className="bg-white shadow-lg rounded-lg p-8 space-y-6">
  //     {/* Form Title */}
  //     <div className="space-y-2">
  //       <input
  //         type="text"
  //         placeholder="Enter Form Name"
  //         value={formName}
  //         onChange={(e) => setFormName(e.target.value)}
  //         className="w-full text-2xl font-semibold border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 transition-all duration-300"
  //       />
  //     </div>

  //     {/* Header Image Upload */}
  //     <div className="space-y-4">
  //       <div className="flex items-center gap-4">
  //         <input
  //           type="file"
  //           ref={fileInputRef}
  //           accept="image/*"
  //           onChange={handleHeaderImageUpload}
  //           className="hidden"
  //           id="headerImageUpload"
  //         />
  //         <label
  //           htmlFor="headerImageUpload"
  //           className="flex items-center px-4 py-2 bg-blue-500 text-white text-sm rounded-lg shadow-md hover:bg-blue-600 cursor-pointer transition-all duration-200"
  //         >
  //           <ImageIcon className="mr-2" />
  //           Add Header Image
  //         </label>
  //         {headerImage && (
  //           <div className="relative">
  //             <img
  //               src={headerImage.preview}
  //               alt="Header"
  //               className="h-24 w-48 object-cover rounded-md shadow-sm"
  //             />
  //             <button
  //               onClick={removeHeaderImage}
  //               className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transition-all"
  //             >
  //               <TrashIcon size={16} />
  //             </button>
  //           </div>
  //         )}
  //       </div>
  //     </div>

  //     {/* Add Question Types */}
  //     <div className="flex justify-between items-center">
  //       <h3 className="text-lg font-medium">Add Question Types</h3>
  //       <button
  //         onClick={() => setIsPreview(!isPreview)}
  //         className={`px-4 py-2 text-sm rounded-lg shadow-md ${
  //           isPreview
  //             ? "bg-gray-500 hover:bg-gray-600 text-white"
  //             : "bg-blue-500 hover:bg-blue-600 text-white"
  //         } transition-all duration-200`}
  //       >
  //         {isPreview ? "Back to Edit" : "Preview Form"}
  //       </button>
  //     </div>

  //     {/* Question Type Buttons */}
  //     {!isPreview && (
  //       <div className="flex gap-4">
  //         {[
  //           { type: "Categorize", label: "Categorize" },
  //           { type: "Cloze", label: "Cloze" },
  //           { type: "Comprehension", label: "Comprehension" },
  //         ].map((questionType) => (
  //           <button
  //             key={questionType.type}
  //             onClick={() => addQuestion(questionType.type)}
  //             className="flex items-center px-4 py-2 bg-green-500 text-white text-sm rounded-lg shadow-md hover:bg-green-600 transition-all duration-200"
  //           >
  //             <PlusIcon className="mr-2" />
  //             {questionType.label}
  //           </button>
  //         ))}
  //       </div>
  //     )}

  //     {/* Questions Section */}
  //     <div className="space-y-4">
  //       <h3 className="text-lg font-medium">
  //         {isPreview ? "Form Preview" : "Questions"}
  //       </h3>
  //       {questions.map(renderQuestion)}
  //     </div>

  //     {/* Submit Buttons */}
  //     <div className="flex justify-end gap-4 mt-6">
  //       {isPreview ? (
  //         <button
  //           onClick={saveResponse}
  //           className={`flex items-center px-6 py-2 rounded-lg text-white shadow-md ${
  //             isSubmittingResponse
  //               ? "bg-gray-500 cursor-not-allowed"
  //               : "bg-green-600 hover:bg-green-700"
  //           } transition-all`}
  //         >
  //           {isSubmittingResponse && (
  //             <svg
  //               className="animate-spin h-5 w-5 mr-2"
  //               xmlns="http://www.w3.org/2000/svg"
  //               fill="none"
  //               viewBox="0 0 24 24"
  //             >
  //               <circle
  //                 className="opacity-25"
  //                 cx="12"
  //                 cy="12"
  //                 r="10"
  //                 stroke="currentColor"
  //                 strokeWidth="4"
  //               ></circle>
  //               <path
  //                 className="opacity-75"
  //                 fill="currentColor"
  //                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  //               ></path>
  //             </svg>
  //           )}
  //           Submit Response
  //         </button>
  //       ) : (
  //         <button
  //           onClick={saveForm}
  //           disabled={!formName}
  //           className={`flex items-center px-6 py-2 rounded-lg text-white shadow-md ${
  //             isSubmittingForm
  //               ? "bg-gray-500 cursor-not-allowed"
  //               : "bg-blue-600 hover:bg-blue-700"
  //           } transition-all`}
  //         >
  //           {isSubmittingForm && (
  //             <svg
  //               className="animate-spin h-5 w-5 mr-2"
  //               xmlns="http://www.w3.org/2000/svg"
  //               fill="none"
  //               viewBox="0 0 24 24"
  //             >
  //               <circle
  //                 className="opacity-25"
  //                 cx="12"
  //                 cy="12"
  //                 r="10"
  //                 stroke="currentColor"
  //                 strokeWidth="4"
  //               ></circle>
  //               <path
  //                 className="opacity-75"
  //                 fill="currentColor"
  //                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  //               ></path>
  //             </svg>
  //           )}
  //           Save Form
  //         </button>
  //       )}
  //     </div>
  //   </div>
  // </div>
);

}

export default FormBuilder;