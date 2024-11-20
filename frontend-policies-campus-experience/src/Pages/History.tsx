import { FC, useState, useEffect } from "react";

import List from "../Components/List";

import { IPolicy } from "../Types/IPolicy";

const History: FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear() - 1
  );
  const [policies, setPolicies] = useState<IPolicy[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPolicies = async () => {
      setPolicies([]);
      try {
        const response = await fetch(
          import.meta.env.VITE_API + `/policies?year=${selectedYear}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch policies");
        }
        const data = await response.json();
        setPolicies(data);
      } catch {
        setError("Failed to load policies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolicies();
  }, [selectedYear]);

  return (
    <div className="p-6">
      <div className="mb-4 flex space-x-4">
        {[2023, 2022, 2021, 2020].map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`py-2 px-4 rounded-md text-sm font-semibold ${selectedYear === year ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
          >
            {year}
          </button>
        ))}
      </div>

      {isLoading && <p>Loading policies...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && policies.length > 0 && (
        <List policies={policies} />
      )}
    </div>
  );
};

export default History;
