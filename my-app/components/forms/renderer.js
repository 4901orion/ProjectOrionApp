import React, { useState } from 'react';

const GeneratedForm = () => {
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === 'checkbox'
          ? e.target.checked
          : e.target.type === 'file'
          ? e.target.files?.[0] ?? null
          : e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center justify-center py-12 gap-3 text-center">
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#0E8388' }}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-800">Thank you! Your response has been submitted.</p>
        <button onClick={() => setSubmitted(false)} className="text-xs underline underline-offset-2 mt-1" style={{ color: '#0E8388' }}>
          Submit another response
        </button>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      
        <div key={0} className="grid gap-4 mb-4 grid-cols-1">
          
          {/* Show "Text Field" only when condition is met */}
          {formData.i_agree === "true" && (
            <div key={0} className="flex flex-col">
              <div className="flex flex-col text-left">
              <label className="text-gray-700 text-sm font-medium mr-4">Text Field</label>
              <input
                type="text"
                name="text_field"
                placeholder=""
                defaultValue=""
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                onChange={handleChange}
              />
            </div>
            </div>
          )}
          <div key={1} className="flex flex-col">
            <div className="flex flex-col text-left">
              
              <div className="flex flex-row gap-3 items-start">
                <input
                  type="checkbox"
                  name="i_agree"
                  className="mt-1"
                  onChange={handleChange}
                />
                <label className="text-gray-700 text-sm font-medium text-left">I Agree</label>
              </div>
            </div>
          </div>
        </div>
      <div className="flex mt-4 justify-end">
        <button type="submit" className="text-white py-2 px-5 rounded-lg font-semibold transition" style={{ background: '#0E8388' }}>
          Submit
        </button>
      </div>
    </form>
  );
};

export default GeneratedForm;
