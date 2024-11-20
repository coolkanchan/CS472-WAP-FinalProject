import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../AuthContext";

import { IPolicy } from "../Types/IPolicy";

const SinglePolicy = () => {
  const { id: userId } = useAuth().state;
  const { id: policyId } = useParams<{ id: string }>();
  const [policy, setPolicy] = useState<IPolicy | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_API + `/policies/${policyId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch policy data");
        }
        const data = await response.json();
        setPolicy(data);
      } catch {
        setError("Failed to load policy. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPolicyData();
  }, [policyId]);

  const handleUpvote = async () => {
    if (!userId) {
      setError("You must be logged in to upvote.");
      return;
    }

    try {
      const response = await fetch(
        import.meta.env.VITE_API + `/policies/${policyId}/upvote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upvote the policy.");
      }

      setPolicy((prevPolicy) => {
        if (!prevPolicy) return prevPolicy;
        return {
          ...prevPolicy,
          votes: [...prevPolicy.votes, userId],
        };
      });
    } catch {
      setError("Failed to upvote the policy. Please try again later.");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!policy) return <p className="text-center">Policy not found.</p>;

  console.log(" policy.votes", policy.votes);
  console.log("userId", userId);

  const hasVoted = policy.votes.includes(userId);

  return (
    <div className="mx-auto max-w-7xl bg-white p-6 rounded-lg">
      <h2 className="text-3xl font-bold text-gray-900">{policy.title}</h2>
      <p className="mt-4 text-gray-700">{policy.description}</p>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Owner: {policy.owner}</p>
          <p className="text-sm text-gray-500">
            Date: {new Date(policy.date).toLocaleDateString()}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Votes: <span className="font-semibold">{policy.votes.length}</span>
          </p>
        </div>
      </div>

      {userId !== -1 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleUpvote}
            className={`rounded-lg px-4 py-2 text-white ${
              hasVoted
                ? "cursor-not-allowed bg-gray-400"
                : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={hasVoted}
          >
            {hasVoted ? "You Have Voted" : "Upvote"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SinglePolicy;
