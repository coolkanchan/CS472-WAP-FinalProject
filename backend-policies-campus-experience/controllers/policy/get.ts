import { RequestHandler } from "express";

import { fetchPolicies } from "../../utils";

import { IPolicy } from "../../types/IPolicy";

const get: RequestHandler<
  {},
  IPolicy[] | { error: string },
  {},
  { year?: string }
> = async (req, res) => {
  try {
    const { year } = req.query;

    const policies = await fetchPolicies();

    const filteredPolicies = policies.filter((policy) =>
      year ? new Date(policy.date).getFullYear() === parseInt(year, 10) : true
    );

    const sortedPolicies = filteredPolicies.sort(
      (a, b) => b.votes.length - a.votes.length
    );

    res.status(200).json(sortedPolicies);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export default get;
