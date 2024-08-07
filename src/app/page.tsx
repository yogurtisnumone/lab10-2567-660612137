"use client";

import UserCard from "@/components/UserCard";
import { UserCardProps } from "@/libs/types";
import { cleanUser } from "@/libs/cleanUser";
import axios from "axios";
import { useEffect, useState } from "react";

export default function RandomUserPage() {
  // annotate type for users state variable
  const [users, setUsers] = useState<UserCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [genAmount, setGenAmount] = useState(1);

  useEffect(() => {
    const savedGenAmount = localStorage.getItem("genAmount");
    if (savedGenAmount) {
      setGenAmount(Number(savedGenAmount));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("genAmount", genAmount.toString());
  }, [genAmount]);

  async function generateBtnOnClick() {
    setIsLoading(true);

    try {
      const resp = await axios.get(
        `https://randomuser.me/api/?results=${genAmount}`
      );
      const users = resp.data.results;
      const cleanedUsers = users.map((user: any) => cleanUser(user));
      setUsers(cleanedUsers);
    }
    catch (error) {
      console.error('Error fetching or processing data:', error);
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "700px" }} className="mx-auto">
      <p className="display-4 text-center fst-italic m-4">Users Generator</p>
      <div className="d-flex justify-content-center align-items-center fs-5 gap-2">
        Number of User(s)
        <input
          className="form-control text-center"
          style={{ maxWidth: "100px" }}
          type="number"
          onChange={(e) => setGenAmount(Number(e.target.value))}
          value={genAmount}
        />
        <button className="btn btn-dark" onClick={generateBtnOnClick}>
          Generate
        </button>
      </div>
      {isLoading && (
        <p className="display-6 text-center fst-italic my-4">Loading ...</p>
      )}
      {users.map((user) => (
        <UserCard
        key={user.email}
        name={user.name}
        email={user.email}
        imgUrl={user.imgUrl}
        address={user.address}
        />
      ))}
    </div>
  );
}
