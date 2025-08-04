import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ data }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : "");

  const onSearchHandler = (e) => {
    e.preventDefault();
    navigate("/course-list/" + input);
  };

  return (
    <form
      onSubmit={onSearchHandler}
      className="max-w-xl w-full md:h-12 h-12 flex items-center bg-white border border-gray-500/20 rounded-full"
    >
      <img
        src={assets.search_icon}
        alt="search_icon"
        className="md:w-auto w-10 px-3 "
      />
      <input
        onChange={(e) => setInput(e.target.value)}
        value={input}
        type="text"
        placeholder="Pesquisar por curso"
        className="w-full h-full outline-none bg-white text-gray-500/80 "
      />
      <button
        type="submit"
        className="px-8 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-[#60a5fa] to-[#3b82f6]
             shadow-md hover:from-[#4f8ae6] hover:to-[#2563eb] transition duration-200"
      >
        Pesquisar
      </button>
    </form>
  );
};

export default SearchBar;
