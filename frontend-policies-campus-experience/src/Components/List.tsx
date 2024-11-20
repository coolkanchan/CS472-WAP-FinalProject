import { FC } from "react";

import Card from "./Card";

import { IPolicy } from "../Types/IPolicy";

const List: FC<{ policies: IPolicy[] }> = ({ policies }) => {
  return (
    <>
      {policies
        .sort((a, b) => b.votes.length - a.votes.length)
        .map((policy) => (
          <Card key={policy.id} policy={policy} />
        ))}
    </>
  );
};

export default List;
