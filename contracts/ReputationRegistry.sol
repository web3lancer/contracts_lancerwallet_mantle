// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract ReputationRegistry {
    struct Review {
        address reviewer;
        uint8 score; // 0-5
        string comment;
        bool disputed;
    }

    mapping(address => Review[]) internal reviews;
    mapping(address => bool) public registered;

    event Registered(address indexed user);
    event ReviewSubmitted(address indexed subject, address indexed reviewer, uint8 score);
    event ReviewDisputed(address indexed subject, uint index);

    function register() external {
        require(!registered[msg.sender], "already registered");
        registered[msg.sender] = true;
        emit Registered(msg.sender);
    }

    function submitReview(address subject, uint8 score, string calldata comment) external {
        require(registered[msg.sender], "reviewer not registered");
        require(subject != address(0), "invalid subject");
        require(score <= 5, "score out of range");

        reviews[subject].push(Review({reviewer: msg.sender, score: score, comment: comment, disputed: false}));
        emit ReviewSubmitted(subject, msg.sender, score);
    }

    function disputeReview(address subject, uint index) external {
        require(index < reviews[subject].length, "invalid index");
        Review storage r = reviews[subject][index];
        require(r.reviewer == msg.sender || subject == msg.sender, "only involved parties can dispute");
        r.disputed = true;
        emit ReviewDisputed(subject, index);
    }

    function getReviews(address subject) external view returns (Review[] memory) {
        return reviews[subject];
    }

    function getReputation(address subject) external view returns (uint256) {
        Review[] storage rs = reviews[subject];
        if (rs.length == 0) return 0;
        uint256 sum = 0;
        uint256 count = 0;
        for (uint i = 0; i < rs.length; i++) {
            if (!rs[i].disputed) {
                sum += rs[i].score;
                count++;
            }
        }
        if (count == 0) return 0;
        // scale to 0-5 with integer division
        return sum / count;
    }
}
