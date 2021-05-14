// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.1.0/contracts/access/Ownable.sol";

contract Voting is Ownable {

    mapping(address=> bool) whitelist;
    
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }
    
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }
    
    WorkflowStatus currentWorkflowStatus = WorkflowStatus.RegisteringVoters;

    uint winningProposalId;
    
    event ProposalsRegistrationStarted();
    event ProposalsRegistrationEnded();
    event ProposalRegistered(uint proposalId);
    event VotingSessionStarted();
    event VotingSessionEnded();
    event Voted (address voter, uint proposalId);
    event VotesTallied();
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);

    event Whitelisted(address _address); // Event

    function registerVoters(address _address) public onlyOwner {
        require(!whitelist[_address], "The address is already whitelisted!");
        require(currentWorkflowStatus == WorkflowStatus.RegisteringVoters, "Too late to register voters");
        whitelist[_address] = true;
        emit Whitelisted(_address); // Triggering event
    }

    function startProposalsRegistration() public onlyOwner {
        require(currentWorkflowStatus == WorkflowStatus.RegisteringVoters, "You can only start Proposals Registration once");
        currentWorkflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit ProposalsRegistrationStarted();
    }

    function stopProposalsRegistration() public onlyOwner {
        require(currentWorkflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "You can only stop Proposals Registration once");
        currentWorkflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit ProposalsRegistrationEnded();
    }

}
