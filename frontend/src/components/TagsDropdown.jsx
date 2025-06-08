import React, { useState, useRef, useEffect } from "react";

const TagsDropdown = ({
  availableTags,
  selectedTags,
  onTagsChange,
  disabled = false,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const selectTag = (tag) => {
    // Only add the tag if it's not already selected
    if (!selectedTags.some((t) => t.objectID === tag.objectID)) {
      const updatedTags = [...selectedTags, tag];
      onTagsChange(updatedTags);
    }
  };

  const removeTag = (tagId) => {
    const updatedTags = selectedTags.filter((tag) => tag.objectID !== tagId);
    onTagsChange(updatedTags);
  };

  return (
    <div
      className={`flex flex-col items-center relative ${
        disabled ? "opacity-50" : ""
      }`}
      ref={dropdownRef}
    >
      <div className="w-full">
        <div className="p-1 flex border border-indigo-300/30 bg-white rounded-lg">
          <div className="flex flex-auto flex-wrap">
            {selectedTags.map((tag) => (
              <div
                key={tag.objectID}
                className="flex justify-center items-center m-1 font-medium py-1 px-2 rounded-full text-white bg-[#d580e5] border-purple-400 shadow-sm"
              >
                <div className="text-xs font-normal leading-none max-w-full flex-initial">
                  {tag.title}
                </div>
                <div className="flex flex-auto flex-row-reverse">
                  <div onClick={() => removeTag(tag.objectID)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="100%"
                      height="100%"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-x cursor-pointer hover:text-indigo-100 rounded-full w-4 h-4 ml-2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex-1">
              <input
                placeholder="Select tags"
                className="bg-transparent p-1 px-2 appearance-none outline-none h-full w-full text-white placeholder-indigo-200"
                onClick={toggleDropdown}
                readOnly
                disabled={disabled}
              />
            </div>
          </div>

          <div className="text-white w-8 py-1 pl-2 pr-1 border-l flex items-center border-indigo-300/30">
            <button
              className={`cursor-pointer w-6 h-6 text-white outline-none focus:outline-none ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={toggleDropdown}
              disabled={disabled}
              type="button"
              aria-label="Toggle tags dropdown"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`feather ${
                  isDropdownOpen ? "feather-chevron-up" : "feather-chevron-down"
                } w-4 h-4`}
              >
                <polyline
                  points={isDropdownOpen ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}
                ></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isDropdownOpen && !disabled && (
        <div
          className="absolute shadow-lg top-100 bg-white z-50 w-full left-0 rounded-lg max-h-select overflow-y-auto border border-indigo-300/30"
          style={{ top: "100%", maxHeight: "300px" }}
        >
          <div className="flex flex-col w-full">
            {availableTags.length > 0 ? (
              availableTags.map((tag) => (
                <div
                  key={tag.objectID}
                  className="cursor-pointer w-full border-[#A7E629] border-b hover:bg-blue-200 transition-colors duration-150"
                  onClick={() => selectTag(tag)}
                >
                  <div
                    className={`flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative ${
                      selectedTags.some((t) => t.objectID === tag.objectID)
                        ? "border-purple-500"
                        : "hover:border-purple-300"
                    }`}
                  >
                    <div className="w-full items-center flex">
                      <div className="mx-2 leading-6 text-black">
                        {tag.title}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-2 text-indigo-200">
                No tags available for this category
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsDropdown;
