import React, { useRef, useState, useEffect } from "react";
import { CapitalizeWords } from "../../utils/CapitalizeWords";

function useOutsideClick(ref, setOpen) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, setOpen]);
}

const SelectDropdown = ({
  data = [],
  labelKey = "artist_name", // field to show
  valueKey = "_id", // field to return
  placeholder = "Select an option",
  onChange,
  className = "",
}) => {
  const wrapperRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useOutsideClick(wrapperRef, setOpen);

  const handleSelect = (item) => {
    setSelected(item);
    setOpen(false);
    if (onChange) onChange(item[valueKey]); // return only the value (_id)
  };

  return (
    <div ref={wrapperRef} className={`relative w-64 ${className}`}>
      {/* Trigger */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="border rounded-md px-4 py-2 bg-white cursor-pointer flex justify-between items-center"
      >
        <span>
          {selected ? CapitalizeWords(selected[labelKey]) : placeholder}
        </span>
        <span className="ml-2">▾</span>
      </div>

      {/* Dropdown */}
      {open && (
        <ul className="absolute mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
          {data.length > 0 ? (
            data.map((item) => (
              <li
                key={item[valueKey]}
                onClick={() => handleSelect(item)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {CapitalizeWords(item[labelKey])}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">No options available</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SelectDropdown;
