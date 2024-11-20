import { FC, useEffect, useState } from "react";

import List from "../Components/List";

import { IPolicy } from "../Types/IPolicy";

const Main: FC = () => {
  const [policies, setPolicies] = useState<IPolicy[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API + "/policies");
        if (!response.ok) {
          throw new Error("Failed to fetch policies");
        }
        const data = await response.json();
        setPolicies(
          data.filter(
            (policy: IPolicy) =>
              new Date(policy.date).getFullYear() === new Date().getFullYear()
          )
        );
      } catch (err) {
        if (err instanceof Error) {
          setError(`Failed to load policies: ${err.message}`);
        } else {
          setError("Failed to load policies: Unknown error");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  return (
    <div className="p-6">
      {isLoading && <p>Loading policies...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && policies.length > 0 && (
        <List policies={policies} />
      )}
      {!isLoading && !error && policies.length === 0 && (
        <p>No policies available.</p>
      )}
    </div>
  );
};

export default Main;
