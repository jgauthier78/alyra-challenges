// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.1.0/contracts/access/Ownable.sol";

contract Voting is Ownable {

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }
    mapping(address => Voter) voters;
    uint numberOfVoters;

    struct Proposal {
        string description;
        uint voteCount;
    }
    mapping(uint => Proposal) public proposals; // we will use votedProposalId as key 
    uint numberOfProposals;
    
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }
    
    WorkflowStatus currentWorkflowStatus = WorkflowStatus.RegisteringVoters;

    // Tout le monde peut vérifier les derniers détails de la proposition gagnante.    
    Proposal public winningProposal;
    
    event ProposalsRegistrationStarted(); // ok used in startProposalsRegistration function
    event ProposalsRegistrationEnded(); // ok used in stopProposalsRegistration function
    event ProposalRegistered(uint proposalId); // ok used in registerProposal function 
    event VotingSessionStarted(); // ok used in startVotingSession function
    event VotingSessionEnded(); // ok used in stopVotingSession function
    event Voted (address voter, uint proposalId); // ok used in voteForProposal function
    event VotesTallied(); // ok used in countVotes function
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus); // ok used in setNewWorkflowStatus function

    function setNewWorkflowStatus (WorkflowStatus newWorkflowStatus) private {
        WorkflowStatus previousWorkflowStatus = currentWorkflowStatus;
        currentWorkflowStatus = newWorkflowStatus;
        emit WorkflowStatusChange(previousWorkflowStatus, newWorkflowStatus);
    }
    
    function resetVote () public onlyOwner {
        currentWorkflowStatus = WorkflowStatus.RegisteringVoters;
        numberOfVoters = 0;
        numberOfProposals = 0;
        delete winningProposal;
    }
    
    // L'administrateur du vote enregistre une liste blanche d'électeurs identifiés par leur adresse Ethereum.
    function registerVoters(address _address) public onlyOwner {
        require(!voters[_address].isRegistered, "The address is already registered!");
        require(currentWorkflowStatus == WorkflowStatus.RegisteringVoters, "Too late to register voters");
        voters[_address] = Voter(true, false, 0);
        numberOfVoters++;
    }

    // L'administrateur du vote commence la session d'enregistrement de la proposition.
    function startProposalsRegistration() public onlyOwner {
        require(currentWorkflowStatus == WorkflowStatus.RegisteringVoters, "You can only start Proposals Registration once");
        require(numberOfVoters > 2, "You should register some voters first (at least 3 otherwise it will be difficult to get more than 50%)");
        setNewWorkflowStatus(WorkflowStatus.ProposalsRegistrationStarted);
        emit ProposalsRegistrationStarted();
    }

    // Les électeurs inscrits sont autorisés à enregistrer leurs propositions pendant que la session d'enregistrement est active.
    function registerProposal(string memory proposalDescription) public {
        require(voters[msg.sender].isRegistered, "Sorry you can't participate to this vote");
        require(currentWorkflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "Proposals Registration has not started or is ended");
        numberOfProposals++; // increment the proposalId to get a unique id for each proposition
        proposals[numberOfProposals] = Proposal(proposalDescription, 0);
        emit ProposalRegistered(numberOfProposals);
    }

    // L'administrateur de vote met fin à la session d'enregistrement des propositions.
    function stopProposalsRegistration() public onlyOwner {
        require(currentWorkflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "You can only stop Proposals Registration once");
        setNewWorkflowStatus(WorkflowStatus.ProposalsRegistrationEnded);
        emit ProposalsRegistrationEnded();
    }
    
    // L'administrateur du vote commence la session de vote.
    function startVotingSession() public onlyOwner {
        require(currentWorkflowStatus == WorkflowStatus.ProposalsRegistrationEnded, "You can only start Voting Session once Proposals Registration has been stopped");
        setNewWorkflowStatus(WorkflowStatus.VotingSessionStarted);
        emit VotingSessionStarted();
    }

    // Les électeurs inscrits votent pour leurs propositions préférées.
    function voteForProposal(uint _proposalId) public {
        require(voters[msg.sender].isRegistered, "Sorry you can't participate to this vote");
        require(!voters[msg.sender].hasVoted, "Sorry you cannot vote more than once");
        require(currentWorkflowStatus == WorkflowStatus.VotingSessionStarted, "Voting Session has not started or is ended");
        voters[msg.sender].votedProposalId = _proposalId;
        proposals[numberOfProposals].voteCount++; // increment the vote count for this proposal id
        emit Voted(msg.sender, _proposalId);
    }

    // L'administrateur du vote met fin à la session de vote.
    function stopVotingSession() public onlyOwner {
        require(currentWorkflowStatus == WorkflowStatus.VotingSessionStarted, "You can only stop Voting Session once");
        setNewWorkflowStatus(WorkflowStatus.VotingSessionEnded);
        emit VotingSessionEnded();
    }

    // L'administrateur du vote comptabilise les votes.
    function countVotes() public onlyOwner returns (string memory) {
        require(currentWorkflowStatus == WorkflowStatus.VotingSessionEnded, "You should stop Voting Session first");
        uint winningProposalId;
        for (uint currentProposalId = 1; currentProposalId <= numberOfProposals; currentProposalId++) {
            if (proposals[currentProposalId].voteCount > winningProposalId) {
                winningProposalId = currentProposalId;
            }
        }        
        winningProposal = proposals[winningProposalId];
        setNewWorkflowStatus(WorkflowStatus.VotesTallied);
        emit VotesTallied();
    }
    
    // Le vote n'est pas secret ; chaque électeur peut voir les votes des autres.
    function getVote(address voterAddress) public view returns (uint) {
        require(voters[msg.sender].isRegistered, "Sorry you're not a voter'");
        require(voters[voterAddress].votedProposalId > 0, "This voter has not already voted");
        return  voters[msg.sender].votedProposalId;
    }

}