import React, { useState, ChangeEvent, FormEvent } from "react";

interface FormState {
  title: string;
  description: string;
  category: string;
}

const PolicyAdd: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    category: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(import.meta.env.VITE_API + "/policies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the policy");
      }

      await response.json();
      setSuccess("Policy submitted successfully!");
      setForm({
        title: "",
        description: "",
        category: "",
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(
          err.message || "Failed to submit the policy. Please try again."
        );
      } else {
        setError("Failed to submit the policy. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="mx-auto max-w-3xl bg-white p-8 rounded-lg shadow-xl">
      <h2 className="mb-6 text-3xl font-semibold text-gray-800">
        Add a New Policy
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label htmlFor="title" className="text-lg font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter policy title"
            className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="description"
            className="text-lg font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter policy description"
            className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isLoading}
          ></textarea>
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="category"
            className="text-lg font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isLoading}
          >
            <option value="">Select a category</option>
            <option value="General">General</option>
            <option value="Food">Food</option>
            <option value="Library">Library</option>
            <option value="Meditation">Meditation</option>
            <option value="Education">Education</option>
            <option value="Visa & Travel">Visa & Travel</option>
            <option value="Students Lounge">Students Lounge</option>
          </select>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}

        <button
          type="submit"
          className={`w-full p-3 text-white rounded-md focus:outline-none ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </section>
  );
};

export default PolicyAdd;
