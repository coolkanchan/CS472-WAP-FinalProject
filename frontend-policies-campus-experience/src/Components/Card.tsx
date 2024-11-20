import { FC } from "react";
import { Link } from "react-router-dom";

import { IPolicy } from "../Types/IPolicy";

const Card: FC<{ policy: IPolicy }> = ({ policy }) => {
  return (
    <div className="rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-1 shadow-md transition-transform hover:scale-105 mb-4">
      <div className="rounded-lg bg-white p-5">
        <h3 className="text-2xl font-semibold text-gray-800 hover:text-purple-600">
          {policy.title}
        </h3>
        <p className="mt-2 text-gray-700">
          {policy.description.slice(0, 150)}...
        </p>
        <p className="mt-4 text-sm font-medium text-gray-500">
          <span className="font-bold text-gray-800">Category:</span>{" "}
          {policy.category}
        </p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-gray-600">
            <span className="font-bold"></span> {policy.owner}
          </p>
          <p className="text-gray-600">
            {new Date(policy.date).toLocaleDateString()}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-gray-600">
            <span className="font-medium">{policy.votes.length}</span> votes
          </p>
        </div>
        <Link
          to={`/policies/${policy.id}`}
          className="mt-4 inline-block rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          More
        </Link>
      </div>
    </div>
  );
};

export default Card;
