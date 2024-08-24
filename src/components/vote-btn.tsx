"use client";

import { useState, useEffect } from "react";

type VoteType = boolean; // true for upvote, false for downvote
type VoteStatus = "none" | "upvoted" | "downvoted";

interface VoteBtnProps {
  postId?: string;
  commentId?: string;
  userId: string;
}

const VoteBtn: React.FC<VoteBtnProps> = ({ postId, commentId, userId }) => {
  const [voteStatus, setVoteStatus] = useState<VoteStatus>("none");
  const [voteCount, setVoteCount] = useState<number>(0);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch vote status and vote count
        const statusRes = await fetch(
          `/api/vote/vote-status?${
            postId ? `postId=${postId}` : `commentId=${commentId}`
          }&userId=${userId}`
        );

        const { voteType } = await statusRes.json();

        setVoteStatus(
          voteType === "upvote"
            ? "upvoted"
            : voteType === "downvote"
            ? "downvoted"
            : "none"
        );

        const countRes = await fetch(
          `/api/${postId ? `post/${postId}` : `comments/${commentId}`}`
        );
        const { voteCount } = await countRes.json();

        setVoteCount(voteCount);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    fetchInitialData();
  }, [postId, commentId, userId]);

  const handleVote = async (type: VoteType) => {
    try {
      const res = await fetch("/api/vote/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          commentId,
          userId,
          voteType: type,
        }),
      });
  
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
  
      // Toggle the vote status
      setVoteStatus(
        voteStatus === (type ? "upvoted" : "downvoted")
          ? "none"
          : type
          ? "upvoted"
          : "downvoted"
      );
  
      // Fetch updated vote count
      const updatedCountRes = await fetch(
        `/api/${commentId ? "comments" : "post"}/${commentId || postId}`
      );
      if (!updatedCountRes.ok) {
        throw new Error(`HTTP error! status: ${updatedCountRes.status}`);
      }
  
      const updatedItem = await updatedCountRes.json();
      setVoteCount(updatedItem.voteCount);
    } catch (error) {
      console.error("Failed to process vote:", error);
    }
  };

  return (
    <>
      <div>
        <button
          onClick={() => handleVote(true)} // true for upvote
          style={{ color: voteStatus === "upvoted" ? "red" : "black" }}
        >
          Upvote
        </button>
        <button
          onClick={() => handleVote(false)} // false for downvote
          style={{ color: voteStatus === "downvoted" ? "red" : "black" }}
        >
          Downvote
        </button>
      </div>
      <div>Vote Count: {voteCount}</div>
    </>
  );
};

export default VoteBtn;
