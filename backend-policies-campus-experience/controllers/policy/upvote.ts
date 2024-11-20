import { RequestHandler } from "express";

import { fetchPolicies, updatePolicy } from "../../utils";

const upvote: RequestHandler<
  { id: string },
  { message: string } | { error: string }
> = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    if (!userId) {
      res.status(401).json({ error: "Unauthorized: User not logged in" });
      return;
    }

    const policyId = parseInt(id, 10);
    if (isNaN(policyId)) {
      res.status(400).json({ error: "Invalid policy ID format" });
      return;
    }

    const policies = await fetchPolicies();

    const policy = policies.find((policy) => policy.id === policyId);

    if (!policy) {
      res.status(404).json({ error: "Policy not found" });
      return;
    }

    if (policy.votes?.includes(userId)) {
      res.status(400).json({ error: "You have already voted for this policy" });
      return;
    }

    const updatedPolicy = await updatePolicy(policy.id, {
      votes: [...(policy.votes || []), userId],
    });

    if (!updatedPolicy) {
      res.status(500).json({ error: "Failed to update policy" });
      return;
    }

    res.status(200).json({ message: "Vote counted successfully" });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export default upvote;
