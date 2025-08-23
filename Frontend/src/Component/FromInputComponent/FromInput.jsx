import React from "react";

const FormInput = ({ label, type = "text", name, value, onChange, placeholder }) => {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
};

export default FormInput;
