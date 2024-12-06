import React, { useState, useRef, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { GripVertical, ImageIcon, TrashIcon } from "lucide-react";

const ItemTypes = {
  CATEGORY: "CATEGORY",
  ITEM: "ITEM",
};

const CategorizeQuestion = ({isPreview, categories, items, setCategories, setItems, questionImage, setQuestionImage}) => {
 

  const inputRef = useRef(null);

  // Drag-and-drop handlers
  const moveCategory = (dragIndex, hoverIndex) => {
    const updatedCategories = [...categories];
    const [removed] = updatedCategories.splice(dragIndex, 1);
    updatedCategories.splice(hoverIndex, 0, removed);
    setCategories(updatedCategories);
  };

  const moveItem = (dragIndex, hoverIndex) => {
    const updatedItems = [...items];
    const [removed] = updatedItems.splice(dragIndex, 1);
    updatedItems.splice(hoverIndex, 0, removed);
    setItems(updatedItems);
  };

  const moveItemToCategory = (itemId, newCategory) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, category: newCategory } 
          : item
      )
    );
  };

  // Editable category/item names
  const updateCategoryName = (index, newName) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = newName;
    setCategories(updatedCategories);
  };

  const updateItemName = (index, newName) => {
    const updatedItems = [...items];
    updatedItems[index].name = newName;
    setItems(updatedItems);
  };


  const handleImageUpload = (event) => {
    console.log("Input change triggered:", event);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("File read successfully:", reader.result);
        setQuestionImage({
          file,
          preview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    } else {
      console.error("No file selected.");
    }
  };

  const removeImage = () => {
    setQuestionImage(null); // Reset questionImage state
    if (inputRef.current) {
      inputRef.current.value = ""; // Reset file input value
    }
  };

 
  
  // const hi = () => {
  //   console.log("hi");
  // };

  if (isPreview === true) {
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="w-full mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
          {/* Image display logic */}
          {questionImage && (
            <div className="flex justify-center mb-4">
              <img
                src={questionImage.preview}
                alt="Question"
                className="w-1/2 h-auto object-cover rounded-md shadow-md"
              />
            </div>
          )}

         

          <div className="flex space-x-4">
           

            {/* Categorized Sections */}
            {categories.map((category) => (
              <div
                key={category}
                className="flex-1 p-4 border rounded-lg bg-gray-50 shadow-sm"
              >
                <h3 className="text-sm font-bold mb-2 text-center">{category}</h3>
                <DndContainer
                  items={items.filter(item => item.category === category)}
                  category={category}
                  onItemsChange={(newItems) => {
                    // Update the order of items in this category
                    setItems(prevItems => [
                      ...prevItems.filter(item => item.category !== category),
                      ...newItems
                    ]);
                  }}
                  onItemDrop={(itemId, targetCategory) => {
                    // Move item to the target category
                    moveItemToCategory(itemId, targetCategory);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </DndProvider>
    )
  }
  

 

  
  return (
   
    <DndProvider backend={HTML5Backend}>
      <div className="w-full mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
        {/* Question Header Section */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-bold">Categorize Question</h2>
            
          </div>

          {/* Image Upload */}
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept="image/*"
              id="questionImageUpload"
              ref={inputRef}
              name="questionImage"
              className="hidden"
              onChange={handleImageUpload}
              // onChange={hi}
            />
            <label
              htmlFor="questionImageUpload"
              className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
              // onClick={() => console.log("Label clicked")}
            >
              <ImageIcon className="mr-2" />
              Upload Image
            </label>
            {questionImage && (
              <div className="relative">
                <img
                  src={questionImage.preview}
                  alt="Question"
                  className="h-16 w-16 object-cover rounded-md border border-gray-300"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Categories</h3>
          {categories.map((category, index) => (
            <CategoryRow
              key={index}
              index={index}
              category={category}
              onDelete={() =>
                setCategories(categories.filter((_, i) => i !== index))
              }
              onRename={(newName) => updateCategoryName(index, newName)}
              moveCategory={moveCategory}
            />
          ))}
          <button
            className="text-blue-500 text-sm mt-2"
            onClick={() =>
              setCategories([...categories, `Category ${categories.length + 1}`])
            }
          >
            + Add Category
          </button>
        </div>

        {/* Items Section */}
        <div>
          <div className="flex justify-between">
            <h3 className="text-sm font-medium mb-2">Items</h3>
            <div className="pr-20">
              <h3 className="text-sm font-medium mb-2">Belongs To</h3>
            </div>
          </div>
          {items.map((item, index) => (
            <ItemRow
              key={index}
              index={index}
              item={item}
              categories={categories}
              onCategoryChange={(category) =>
                setItems(
                  items.map((it, i) =>
                    i === index ? { ...it, category } : it
                  )
                )
              }
              onRename={(newName) => updateItemName(index, newName)}
              moveItem={moveItem}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

// Category Row Component
const CategoryRow = ({ index, category, onDelete, onRename, moveCategory }) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: ItemTypes.CATEGORY,
    hover: (item) => {
      if (item.index !== index) {
        moveCategory(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CATEGORY,
    item: { type: ItemTypes.CATEGORY, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`flex items-center mb-2 space-x-2 bg-white p-2 rounded shadow-sm ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <GripVertical className="cursor-grab text-gray-500" />
      <input
        type="text"
        value={category}
        onChange={(e) => onRename(e.target.value)}
        className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
      />
      <button
        className="text-red-500 hover:text-red-700"
        onClick={onDelete}
      >
        ✕
      </button>
    </div>
  );
};

// Item Row Component
const ItemRow = ({
  index,
  item,
  categories,
  onCategoryChange,
  onRename,
  moveItem,
}) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: ItemTypes.ITEM,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ITEM,
    item: { type: ItemTypes.ITEM, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`flex items-center space-x-4 mb-2 bg-white p-2 rounded shadow-sm ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <GripVertical className="cursor-grab text-gray-500" />
      <input
        type="text"
        value={item.name}
        onChange={(e) => onRename(e.target.value)}
        className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
      />
      <select
        value={item.category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="border border-gray-300 rounded px-2 py-1 text-sm"
      >
        <option value="">Choose Category</option>
        {categories.map((category, idx) => (
          <option key={idx} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};



// Reusable Drag and Drop Container
const DndContainer = ({ items, category, onItemsChange, onItemDrop }) => {
  const [, drop] = useDrop({
    accept: [ItemTypes.ITEM],
    drop: (draggedItem, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) return;

      // If dropped directly on the container and it's from a different category
      if (draggedItem.item.category !== category) {
        onItemDrop(draggedItem.item.id, category);
      }
    },
  });

  return (
    <div ref={drop} className="space-y-2 min-h-[100px]">
      {items.map((item, index) => (
        <DraggablePreviewItem
          key={item.id}
          item={item}
          index={index}
          items={items}
          category={category}
          onItemsChange={onItemsChange}
          onItemDrop={onItemDrop}
        />
      ))}
    </div>
  );
};

// Draggable Item Component
const DraggablePreviewItem = ({ 
  item, 
  index, 
  items, 
  category, 
  onItemsChange, 
  onItemDrop 
}) => {
  const ref = React.useRef(null);

  // Drag logic
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ITEM,
    item: { item },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Drop logic
  const [, drop] = useDrop({
    accept: ItemTypes.ITEM,
    hover: (draggedItem) => {
      if (draggedItem.item.id !== item.id) {
        const dragIndex = items.findIndex(i => i.id === draggedItem.item.id);
        const hoverIndex = items.findIndex(i => i.id === item.id);

        // Reorder within the same container
        if (dragIndex !== -1 && hoverIndex !== -1) {
          const newItems = moveItem(items, dragIndex, hoverIndex);
          onItemsChange(newItems);
        }
      }
    },
    drop: (draggedItem, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) return;

      // If item is from a different category, move it
      if (draggedItem.item.category !== category) {
        onItemDrop(draggedItem.item.id, category);
      }
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`p-2 bg-white rounded shadow-sm cursor-move ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <div>{item.name}</div>
    </div>
  );
};





export default CategorizeQuestion;

