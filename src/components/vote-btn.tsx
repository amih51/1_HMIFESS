"use client";

import { useState, useEffect } from "react";

type VoteType = boolean; // true for upvote, false for downvote
type VoteStatus = "none" | "upvoted" | "downvoted";

interface VoteBtnProps {
    postId: string;
    userId: string;
}

const VoteBtn: React.FC<VoteBtnProps> = ({ postId, userId }) => {
    const [voteStatus, setVoteStatus] = useState<VoteStatus>("none");
    const [voteCount, setVoteCount] = useState<number>(0);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch vote status and vote count in parallel
                const [statusRes, countRes] = await Promise.all([
                    fetch(`/api/vote/vote-status?postId=${postId}&userId=${userId}`),
                    fetch(`/api/post/${postId}`)
                ]);

                const { voteType } = await statusRes.json();
                const { voteCount } = await countRes.json();

                // Update state
                setVoteStatus(voteType === true ? "upvoted" : voteType === false ? "downvoted" : "none");
                setVoteCount(voteCount);
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
            }
        };

        fetchInitialData();
    }, [postId, userId]);

    const handleVote = async (type: VoteType) => {
        try {
            const res = await fetch("/api/vote/vote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    postId,
                    userId,
                    voteType: type,
                }),
            });

            if (res.ok) {
                // Toggle the vote status
                setVoteStatus(voteStatus === (type ? "upvoted" : "downvoted") ? "none" : (type ? "upvoted" : "downvoted"));
                
                // Update vote count
                const updatedCountRes = await fetch(`/api/post/${postId}`);
                const { voteCount } = await updatedCountRes.json();
                setVoteCount(voteCount);
            }
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
            <div>
                Vote Count: {voteCount}
            </div>
        </>
    );
};

export default VoteBtn;
