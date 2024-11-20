import { RequestHandler } from "express";

import { IPolicy } from "../../types/IPolicy";

import { fetchPolicies } from "../../utils";

const getPolicy: RequestHandler<
  { id: string },
  IPolicy | { error: string }
> = async (req, res) => {
  try {
    const { id } = req.params;

    const policyId = parseInt(id, 10);
    if (isNaN(policyId)) {
      res.status(400).json({ error: "Invalid policy ID format" });
      return;
    }

    const policies = await fetchPolicies();

    const policy = policies.find((p) => p.id === policyId);

    if (!policy) {
      res.status(404).json({ error: "Policy not found" });
      return;
    }

    res.status(200).json(policy);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export default getPolicy;
