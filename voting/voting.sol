// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.1.0/contracts/access/Ownable.sol";

/// @title Formation Alyra "Développeur Blockchain" - Défi - Système de vote
/// @author Jérôme Gauthier
/// @notice Mise en oeuvre d'un système de vote simple
/// @dev Par rapport à l'énoncé initial j'ai simplement ajouté la fonction resetVote()
/// accessible par le owner du contract seulement
contract Voting is Ownable {

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
    Proposal public winningProposal; // Tout le monde peut vérifier la proposition gagnante
    Proposal[] public proposals; // we will use votedProposalId as key 
    mapping(address => Voter) voters;
    uint numberOfVoters;
    
    event ProposalsRegistrationStarted(); // ok used in startProposalsRegistration function
    event ProposalsRegistrationEnded(); // ok used in stopProposalsRegistration function
    event ProposalRegistered(uint proposalId); // ok used in registerProposal function 
    event VotingSessionStarted(); // ok used in startVotingSession function
    event VotingSessionEnded(); // ok used in stopVotingSession function
    event Voted (address voter, uint proposalId); // ok used in voteForProposal function
    event VotesTallied(); // ok used in countVotes function
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);// used in setNewWorkflowStatus

    function resetVote () public onlyOwner {
        currentWorkflowStatus = WorkflowStatus.RegisteringVoters;
        numberOfVoters = 0;
        delete winningProposal;
    }
    
    /// @notice L'administrateur du vote enregistre une liste blanche d'électeurs identifiés par leur adresse Ethereum.
    /// @dev onlyOwner pour que seul le owner du contract puisse enregistrer des électeurs
    /// @param _address l'adresse de l'électeur
    function registerVoters(address _address) public onlyOwner {
        require(!voters[_address].isRegistered, "The address is already registered!");
        require(currentWorkflowStatus == WorkflowStatus.RegisteringVoters, "Too late to register voters");
        voters[_address] = Voter(true, false, 0);
        numberOfVoters++;
    }

    /// @notice L'administrateur du vote commence la session d'enregistrement de la proposition.
    function startProposalsRegistration() public onlyOwner {
        require(currentWorkflowStatus == WorkflowStatus.RegisteringVoters,
                "You can only start Proposals Registration once");
        require(numberOfVoters > 2, "You should register some voters first (at least 3)");
        setNewWorkflowStatus(WorkflowStatus.ProposalsRegistrationStarted);
        emit ProposalsRegistrationStarted();
    }

    /// @notice Les électeurs inscrits sont autorisés à enregistrer leurs propositions
    /// pendant que la session d'enregistrement est active.
    function registerProposal(string memory proposalDescription) public {
        require(proposals.length<100, "Sorry we cannot accept more than 100 proposals");
        require(voters[msg.sender].isRegistered, "Sorry you can't participate to this vote");
        require(currentWorkflowStatus == WorkflowStatus.ProposalsRegistrationStarted,
                "Proposals Registration has not started or is ended");
        proposals.push(Proposal(proposalDescription, 0));
        emit ProposalRegistered(proposals.length);
    }

    /// @notice L'administrateur de vote met fin à la session d'enregistrement des propositions.
    function stopProposalsRegistration() public onlyOwner {
        require(currentWorkflowStatus == WorkflowStatus.ProposalsRegistrationStarted,
                "You can only stop Proposals Registration once");
        setNewWorkflowStatus(WorkflowStatus.ProposalsRegistrationEnded);
        emit ProposalsRegistrationEnded();
    }
    
    /// @notice L'administrateur du vote commence la session de vote.
    function startVotingSession() public onlyOwner {
        require(currentWorkflowStatus == WorkflowStatus.ProposalsRegistrationEnded,
                "You can only start Voting Session once Proposals Registration has been stopped");
        setNewWorkflowStatus(WorkflowStatus.VotingSessionStarted);
        emit VotingSessionStarted();
    }

    /// @notice Les électeurs inscrits votent pour leurs propositions préférées.
    function voteForProposal(uint _proposalId) public {
        require(voters[msg.sender].isRegistered, "Sorry you can't participate to this vote");
        require(!voters[msg.sender].hasVoted, "Sorry you cannot vote more than once");
        require(currentWorkflowStatus == WorkflowStatus.VotingSessionStarted,
                "Voting Session has not started or is ended");
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = _proposalId;
        proposals[_proposalId].voteCount++; // increment the vote count for this proposal id
        emit Voted(msg.sender, _proposalId);
    }

    /// @notice L'administrateur du vote met fin à la session de vote.
    function stopVotingSession() public onlyOwner {
        require(currentWorkflowStatus == WorkflowStatus.VotingSessionStarted, "You can only stop Voting Session once");
        setNewWorkflowStatus(WorkflowStatus.VotingSessionEnded);
        emit VotingSessionEnded();
    }

    /// @notice L'administrateur du vote comptabilise les votes.
    function countVotes() public onlyOwner returns (string memory) {
        require(currentWorkflowStatus == WorkflowStatus.VotingSessionEnded, "You should stop Voting Session first");
        uint winningProposalId;
        for (uint currentProposalId = 0; currentProposalId < proposals.length; currentProposalId++) {
            if (proposals[currentProposalId].voteCount > winningProposalId) {
                winningProposalId = currentProposalId;
            }
        }        
        winningProposal = proposals[winningProposalId];
        setNewWorkflowStatus(WorkflowStatus.VotesTallied);
        emit VotesTallied();
    }
    
    /// @notice Le vote n'est pas secret ; chaque électeur peut voir les votes des autres.
    function getVote(address voterAddress) public view returns (uint) {
        require(voters[msg.sender].isRegistered, "Sorry you're not a voter'");
        require(voters[voterAddress].votedProposalId > 0, "This voter has not already voted");
        return  voters[msg.sender].votedProposalId;
    }

    /// @notice passage d'un statut à l'autre
    function setNewWorkflowStatus (WorkflowStatus newWorkflowStatus) private {
        WorkflowStatus previousWorkflowStatus = currentWorkflowStatus;
        currentWorkflowStatus = newWorkflowStatus;
        emit WorkflowStatusChange(previousWorkflowStatus, newWorkflowStatus);
    }
    
}