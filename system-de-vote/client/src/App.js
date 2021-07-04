import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import getWeb3 from "./getWeb3";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Jsonify from 'jsonify';
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import Table from 'react-bootstrap/Table';
import Tabs from 'react-bootstrap/Tabs';
import VotingContract from "./contracts/Voting.json";
import "./App.css";

class App extends Component {

  state = { web3: null, accounts: null, contract: null };
  
  componentWillMount = async () => {
    const titreAppli = "Défi - Système de vote";
    try {

      // Récupérer le provider web3
      const web3 = await getWeb3();
  
      // Utiliser web3 pour récupérer les comptes de l’utilisateur (MetaMask dans notre cas) 
      const accounts = await web3.eth.getAccounts();

      // Récupérer l’instance du smart contract “Voting” avec web3 et les informations du déploiement du fichier (client/src/contracts/Voting.json)
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VotingContract.networks[networkId];
  
      const instance = new web3.eth.Contract(
        VotingContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, titreAppli }, this.runInit);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert('Non-Ethereum browser detected. Can you please try to install MetaMask before starting.', titreAppli);
      console.error(error);
    }
  };
  
  registerVoters = async() => {
    const { accounts, contract, titreAppli } = this.state;
    const address = this.address.value;
    
    // Interaction avec le smart contract pour ajouter un compte 
    try {
      await contract.methods.registerVoters(address).send({from: accounts[0]});
    }
    catch (err) {
      alert('Une erreur est survenue lors de l\'enregistrement des votants :\n' + err.reason, 'Incorrect Adress?', titreAppli);
    }

    this.runInit();
  }
 
  startProposalsRegistration = async() => {
    const { accounts, contract, titreAppli } = this.state;
    try {
      await contract.methods.startProposalsRegistration().send({from: accounts[0]})
        .then(function(res){
          alert('Enregistrement des propositions démarré.\n'+Jsonify.stringify(res), titreAppli);
        }).catch(function(err) {
          alert('Erreur au démarrage des propositions :\n' + Jsonify.stringify(err), titreAppli);
        });
    }
    catch (err) {
      alert('Une erreur s\'est produite au démarrage des propositions :\n' + Jsonify.stringify(err), titreAppli);
    }

    this.runInit();
  }

  stopProposalsRegistration = async() => {
    const { accounts, contract, titreAppli } = this.state;
    try {
      await contract.methods.stopProposalsRegistration().send({from: accounts[0]})
        .then(function(res){
          alert('Enregistrement des propositions terminé', titreAppli);
        }).catch(function(err) {
          alert('Erreur à l\'arrêt des propositions :\n' + err, titreAppli);
        });
    }
    catch (err) {
      alert('Une erreur s\'est produite à l\'arrêt des propositions :\n' + Jsonify.stringify(err), titreAppli);
    }

    this.runInit();
  }

  registerProposal = async() => {
    const { accounts, contract, titreAppli } = this.state;
    const proposalDescription = this.proposalDescription.value;
    
    try {
      await contract.methods.registerProposal(proposalDescription).send({from: accounts[0]});
    }
    catch (err) {
      alert('Une erreur est survenue lors de l\'ajout de la proposition :\n' + err.reason, titreAppli);
    }

    this.runInit();
  }
 
  startVotingSession = async() => {
    const { accounts, contract, titreAppli } = this.state;
    try {
      await contract.methods.startVotingSession().send({from: accounts[0]})
        .then(function(res){
          alert('Session de votes démarrée.\n'+Jsonify.stringify(res));
        }).catch(function(err) {
          alert('Erreur au démarrage de la session de votes :\n' + Jsonify.stringify(err), titreAppli);
        });
    }
    catch (err) {
      alert('Une erreur s\'est produite au démarrage de la session de votes :\n' + Jsonify.stringify(err), titreAppli);
    }

    this.runInit();
  }
  
  stopVotingSession = async() => {
    const { accounts, contract, titreAppli } = this.state;
    try {
      await contract.methods.stopVotingSession().send({from: accounts[0]})
        .then(function(res){
          alert('Session de votes terminée.\n'+Jsonify.stringify(res), titreAppli);
        }).catch(function(err) {
          alert('Erreur à l\'arrêt de la session de votes :\n' + Jsonify.stringify(err), titreAppli);
        });
    }
    catch (err) {
      alert('Une erreur s\'est produite à l\'arrêt de la session de votes :\n' + Jsonify.stringify(err), titreAppli);
    }

    this.runInit();
  }
  
  voteForProposal = async() => {
    const { accounts, contract, titreAppli } = this.state;
    const voteNumber = this.voteNumber.value;
    
    try {
      await contract.methods.voteForProposal(voteNumber).send({from: accounts[0]});
    }
    catch (err) {
      alert('Une erreur est survenue lors du vote :\n' + err.reason, titreAppli);
    }

    this.runInit();
  }

  countVotes = async() => {
    const { accounts, contract, titreAppli } = this.state;
    
    try {
      await contract.methods.countVotes().send({from: accounts[0]});
    }
    catch (err) {
      alert('Une erreur est survenue lors du décompte des votes :\n' + err.reason, titreAppli);
    }
  
    this.runInit();
}

  resetVote = async() => {
    const { accounts, contract, titreAppli } = this.state;
    
    try {
      await contract.methods.resetVote().send({from: accounts[0]});
    }
    catch (err) {
      alert('Une erreur est survenue lors de la remise à zéro des votes :\n' + err.reason, titreAppli);
    }
  
    this.runInit();
}

  runInit = async() => {
    const { accounts, contract, titreAppli } = this.state;
    const connectedAccount = accounts[0];
    const contractOwner = await contract.methods.owner().call();
    const isOwner = accounts !== null && contractOwner === connectedAccount ? true : false;
    
    // récupérer la liste des comptes autorisés
    let votersAdresses = null;
    await contract.methods.getVotersAdresses().call()
      .then(function(res){
        votersAdresses = res; // alert('Récupération des votants : ' + Jsonify.stringify(res));
      }).catch(function(err) {
        alert('Erreur lors de la récupération des votants :\n' + err, titreAppli);
      });

    // récupérer les informations du compte connecté si il est voteur
    let voterInformation = null;
    await contract.methods.getVoter().call()
      .then(function(res){
        voterInformation = res; // alert('Récupération des votants : ' + Jsonify.stringify(res));
      }).catch(function(err) {
        alert('Erreur lors de la récupération des information de vote du compte connecté :\n' + err, titreAppli);
      });

    // le compte connecté est-il dans la liste blanche des votants et peut-iol encore voter ?
    let connectedAccountCanVote = voterInformation && voterInformation.isRegistered && !voterInformation.hasVoted;
    
    // le compte a-t-il déjà voté ?
    let connectedAccountAlreadyVoted = voterInformation && voterInformation.hasVoted;
    
    const currentWorkflowStatus = await contract.methods.getCurrentWorkflowStatus().call();
    let pageInformation = {
      currentWorkflowStatus: currentWorkflowStatus,
      title: '',
      explanation: '',
      displayRegisterVoters: false,
      displayStartProposal: false,
      displayStopProposal: false,
      displayRegisterProposal: false,
      displaystartVotingSession: false,
      displayStopVotingSession: false,
      displayVoteForProposal: false,
      displayAlreadyVoted: false,
      displayCountVotes: false,
      displayWinningProposal: false,
      winningProposal: null,
      displayResetVote: isOwner
    };    
    switch (currentWorkflowStatus) {
      case '0':
        pageInformation.title = 'Enregistrement des votants en cours';
        if (isOwner) {
          pageInformation.explanation = 'Veuillez saisir les adresses qui pourront participer au vote (onglet "Informations")';
        }
        else {
          pageInformation.explanation = 'Veuillez patienter, l\'administrateur doit lister les adresses qui participeront au vote';
        }
        pageInformation.displayRegisterVoters = isOwner;
        pageInformation.displayStartProposal = isOwner;
        break;
      case '1':
        pageInformation.title = 'Enregistrement des propositions commencé';
        pageInformation.explanation = 'Vous pouvez saisir une proposition';
        pageInformation.displayStopProposal = isOwner;
        pageInformation.displayRegisterProposal = connectedAccountCanVote;
        break;
      case '2':
        pageInformation.title = 'Enregistrement des propositions terminé';
        pageInformation.explanation = 'La session de vote n\'a pas encore démarré';
        pageInformation.displaystartVotingSession = isOwner;
        break;
      case '3':
        pageInformation.title = 'Session de votes démarrée';
        pageInformation.explanation = 'Vous pouvez désormais voter pour votre choix';
        pageInformation.displayStopVotingSession = isOwner;
        pageInformation.displayVoteForProposal = connectedAccountCanVote;
        pageInformation.displayAlreadyVoted = connectedAccountAlreadyVoted;
        break;
      case '4':
        pageInformation.title = 'Session de votes terminée';
        pageInformation.explanation = 'Veuillez attendre que l\'administrateur ait décompté les votes';
        pageInformation.displayCountVotes = isOwner;
        break;
      case '5':
        pageInformation.title = 'Votes comptés';
        pageInformation.explanation = 'Les résultats sont disponibles dans le tableau des propositions';
        pageInformation.displayWinningProposal = true;
        break;
      default:
        alert('currentWorkflowStatus avec valeur inconnue (' + currentWorkflowStatus + ')', titreAppli);
        break;
    }
    
    // récupération des propositions
    let proposals = null;
    await contract.methods.getProposals().call()
      .then(function(res){
        if (res !== 'undefined' && typeof(res.length) !== 'undefined') {
          proposals = res;
        }
      }).catch(function(err) {
        alert('Erreur lors de la récupération des propositions :\n' + err, titreAppli);
      });
    
    pageInformation.winningProposal = await contract.methods.winningProposal().call();
    
    ////////////////////////////////////
    // enregistrements des événements //
    ////////////////////////////////////
    
    // ProposalsRegistrationStarted - L'enregistrement des propositions a démarré
    contract.events.ProposalsRegistrationStarted(function(error, result) {
       if (error) {
         alert('Une erreur est survenue au démarrage de l\'enregistrement des propositions.\n' +
               'Détail de l\'erreur : ' + Jsonify.stringify(error), titreAppli);
       }
       else {
         alert('L\'enregistrement des propositions a démarré' + Jsonify.stringify(result), titreAppli);
         window.location.reload();;
       }
    });
    
    // ProposalsRegistrationEnded
    contract.events.ProposalsRegistrationEnded(function(error, result) {
       if (error) {
         alert('Une erreur est survenue à l\'arrêt de l\'enregistrement des propositions\n' +
               'Détail de l\'erreur : ' + Jsonify.stringify(error), titreAppli);
       }
       else {
         alert('L\'enregistrement des propositions vient de terminer.\n' +
               'Informations complémentaires : ' + Jsonify.stringify(result), alert);
         window.location.reload();
       }
    });
    
    // ProposalRegistered(uint proposalId)
    
    // VotingSessionStarted
    contract.events.VotingSessionStarted(function(error, result) {
       if (error) {
         alert('Une erreur est survenue à l\'arrêt de la session de vote.\n' +
               'Détail de l\'erreur : ' + Jsonify.stringify(error), titreAppli);
       }
       else {
         alert('La session de vote vient de terminer.\n' +
               'Informations complémentaires : ' + Jsonify.stringify(result), alert);
         window.location.reload();
       }
    });
    
    // VotingSessionEnded
    contract.events.VotingSessionEnded(function(error, result) {
       if (error) {
         alert('Une erreur est survenue au démarrage de la session de vote\n' +
               'Détail de l\'erreur : ' + Jsonify.stringify(error), titreAppli);
       }
       else {
         alert('La session de vote a démarré.\n' +
               'Informations complémentaires : ' + Jsonify.stringify(result), alert);
         window.location.reload();
       }
    });

    // Voted (address voter, uint proposalId)

    // VotesTallied
    contract.events.VotesTallied(function(error, result) {
       if (error) {
         alert('Une erreur est survenue au décompte des votes.\n' +
               'Détail de l\'erreur : ' + Jsonify.stringify(error), titreAppli);
       }
       else {
         alert('Décompte des votes terminé.\n' +
               'Informations complémentaires : ' + Jsonify.stringify(result), alert);
         window.location.reload();
       }
    });

    // WorkflowStatusChange - Changement de statut du workflow
    contract.events.WorkflowStatusChange(function(error, result) {
       if (error) {
         console.log('Une erreur est survenue lors du changement de statut du workflow.\n' +
                     'Détail de l\'erreur : ' + Jsonify.stringify(error));
       }
       else {
         console.log('Changement de statut du workflow. Nouveau statut : ' + Jsonify.stringify(result));
         window.location.reload();
       }
    });
    
    await window.ethereum.on('accountsChanged', (accounts) => {
       alert('Compte changé, l\'application va être rechergée');
       window.location.reload();;
    });

    this.setState({ contractOwner, pageInformation, isOwner, proposals, votersAdresses });
  }

  render() {
    const { accounts, contractOwner, pageInformation, isOwner, proposals, votersAdresses } = this.state;

    let divInformations;
    if (isOwner) {
      divInformations = <div>Vous êtes le propriétaire du contrat, en conséquence l'administrateur du vote</div>;
    } else {
      divInformations = <div>Ici nous indiquerons le statut/avancement du vote et si l'utilisateur peut voter</div>;
    }
    
    let divRegisterVoters;
    let divOwnerProposals;
    if (isOwner) {
      if (pageInformation.displayRegisterVoters) {
          divRegisterVoters = <div>
                                <br/>
                                <Form.Group>
                                  <Form.Control type="text" id="address"
                                  ref={(input) => { this.address = input }}
                                  />
                                </Form.Group>
                                <Button onClick={ this.registerVoters } variant="dark" >Aojuter un compte</Button>
                              </div>;
      }

      let divStartProposal;
      if (pageInformation.displayStartProposal) {
        divStartProposal = <div>
                             <br/>
                             <Button onClick={ this.startProposalsRegistration } variant="dark" >Démarrer l'enregistrement des propositions</Button>
                           </div>;
      }
      let divStopProposal;
      if (pageInformation.displayStopProposal) {
        divStartProposal = <div>
                             <br/>
                             <Button onClick={ this.stopProposalsRegistration } variant="dark" >Arrêter l'enregistrement des propositions</Button>
                           </div>;
      }
      
      divOwnerProposals = <div>
                            {divStartProposal}
                            {divStopProposal}
                            <br/>
                          </div>;
    }
    
    let divAjouterProposition;
    if (pageInformation && pageInformation.displayRegisterProposal) {
      divAjouterProposition = <>
                                <Card.Body>
                                  <Form.Group>
                                    <Form.Control type="text" id="proposalDescription"
                                    ref={(input) => { this.proposalDescription = input }}
                                    />
                                  </Form.Group>
                                  <Button onClick={ this.registerProposal } variant="dark" >Ajouter la proposition</Button>
                                </Card.Body>
                              </>;
    }
    
    let divVoting;
    if (pageInformation && (pageInformation.displaystartVotingSession ||
                            pageInformation.displayStopVotingSession ||
                            pageInformation.displayVoteForProposal)) {
      let divstartVotingSession;
      if (pageInformation.displaystartVotingSession) {
        divstartVotingSession = <>
                                  <div>
                                    <Button onClick={ this.startVotingSession } variant="dark" >Démarrer les votes </Button>
                                    <br/>
                                  </div>
                                </>;
      }
      let divStopVotingSession;
      if (pageInformation.displayStopVotingSession) {
        divStopVotingSession = <>
                                 <div>
                                   <Button onClick={ this.stopVotingSession } variant="dark" >Arrêter les votes </Button>
                                   <br/>
                                 </div>
                               </>;
      }
      let divVoteForProposal;
      if (pageInformation.displayVoteForProposal) {
        divVoteForProposal = <>
                               <br/>
                               <Form.Group>
                                 <Form.Control type="number" id="voteNumber" min="0" max="{ this.proposals && this.proposals.length }"
                                 ref={(input) => { this.voteNumber = input }}
                                 />
                               </Form.Group>
                               <Button onClick={ this.voteForProposal } variant="dark" >Voter pour un numéro de proposition</Button>
                             </>;
      } else if (pageInformation.displayAlreadyVoted) {
        divVoteForProposal = <>
                               <br/>
                               Vous avez déjà voté !
                             </>;
      }
      
      divVoting = <>
                  <br></br>
                  <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Card style={{ width: '50rem' }}>
                      <Card.Header><strong>Votes</strong></Card.Header>
                      <Card.Body>
                        {divstartVotingSession}
                        {divStopVotingSession}
                        {divVoteForProposal}
                      </Card.Body>
                    </Card>
                  </div>
                </>;

    }

    let divCountVotes;
    if (pageInformation && pageInformation.displayCountVotes) {
      divCountVotes = <>
                        <Card.Body>
                          <Button onClick={ this.countVotes } variant="dark" >Décompte des votes</Button>
                        </Card.Body>
                      </>;
    }
    
    let divWinningProposal;
    if (pageInformation && pageInformation.displayWinningProposal) {
      divWinningProposal = <div>
                             Proposition remportant le vote : "{pageInformation != null && pageInformation.winningProposal.description}"
                             &nbsp;avec {pageInformation != null && pageInformation.winningProposal.voteCount} vote(s).
                           </div>;
    }
    
    let divResetVote; // always available as soon as the connectted account is the owner, so that we can proceed with tests
    if (pageInformation && pageInformation.displayResetVote) {
      divResetVote = <div>
                       <Button onClick={ this.resetVote } variant="dark" >Reset complet</Button>
                     </div>;
    }
    
    return (
      <div className="App">
        <Tabs defaultActiveKey="vote" id="defi-tabs">
          <Tab eventKey="vote" title="Vote">
            <div>
              <h3 className="text-center">Bienvenue sur le défi "Système de vote"</h3>
              <hr></hr>
              <br></br>
            </div>
            <br/>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Card style={{ width: '50rem' }}>
                <Card.Header><strong>{pageInformation != null && pageInformation.title}</strong></Card.Header>
                <Card.Body>
                  {pageInformation != null && pageInformation.explanation}
                </Card.Body>
              </Card>
            </div>
            {/* Propositions */}
            <br></br>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Card style={{ width: '50rem' }}>
                <Card.Header><strong>Liste des propositions et votes associés</strong></Card.Header>
                {divAjouterProposition}
                {divOwnerProposals}
                {/* Affichage de la proposition gagnante */}
                {divWinningProposal}
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Numéro</th>
                          <th>Proposition</th>
                          <th>Nombre de votes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {typeof(proposals) !== 'undefined' && proposals !== null && 
                          proposals.map((proposalRecord, index) =>
                            <tr key={index}>
                              <td>{index}</td>
                              <td>{proposalRecord.description}</td>
                              <td>{proposalRecord.voteCount}</td>
                            </tr>)
                        }
                      </tbody>
                    </Table>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </div>
            {/* Votes */}
            {divVoting}
            {/* Décompte des votes */}
            {divCountVotes}
          </Tab>
          <Tab eventKey="informations" title="Informations">
            <div>
              <h3 className="text-center">Informations</h3>
              <hr></hr>
              <br></br>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Card style={{ width: '50rem' }}>
                <Card.Header><strong>Informations sur le contrat</strong></Card.Header>
                <Card.Body>
                  <ul>
                    <li>Propriétaire du contrat : {contractOwner}</li>
                    <li>Compte connecté : {accounts !== null && 
                                           accounts.map((accountRecord) => <span key={accountRecord.toString()}>{accountRecord}</span>)
                                           }
                    </li>
                    <li>{divInformations}</li>
                  </ul>
                  {divResetVote}
                </Card.Body>
                {divRegisterVoters}
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Liste des comptes autorisés</th>
                        </tr>
                      </thead>
                      <tbody>
                        {typeof(votersAdresses) !== 'undefined' && votersAdresses !== null && 
                          votersAdresses.map((a) => <tr key={a.toString()}><td>{a}</td></tr>)
                        }
                      </tbody>
                    </Table>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </div>
          </Tab>
          <Tab eventKey="explications" title="Explications">
            <div>
              <h3 className="text-center">Explications</h3>
              <hr></hr>
              <br></br>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Card style={{ width: '50rem' }}>
                <Card.Header><strong>But du site</strong></Card.Header>
                <Card.Body>
                  <div>Bienvenue sur le site de vote réalisé dans le cadre de l&acute;exercice "Défi - Système de vote" de l&acute;école de la blockchain Alyra.</div>
                  <br></br>
                  <div>Rappel de l&acute;énoncé</div>
                  <br></br>
                  <div>Un smart contract de vote peut être simple ou complexe, selon les exigences des élections que vous souhaitez soutenir. Le vote peut porter sur un petit nombre de propositions (ou de candidats) présélectionnées, ou sur un nombre potentiellement important de propositions suggérées de manière dynamique par les électeurs eux-mêmes.</div>
                  <br></br>
                  <div>Dans ce cadres, vous allez écrire un smart contract de vote pour une petite organisation. Les électeurs, que l&acute;organisation connaît tous, sont inscrits sur une liste blanche (whitelist) grâce à leur adresse Ethereum, peuvent soumettre de nouvelles propositions lors d&acute;une session d&acute;enregistrement des propositions, et peuvent voter sur les propositions lors de la session de vote.</div>
                  <br></br>
                  <div>Le vote n&acute;est pas secret ; chaque électeur peut voir les votes des autres.</div>
                  <br></br>
                  <div>Le gagnant est déterminé à la majorité simple ; la proposition qui obtient le plus de voix l&acute;emporte.</div>
                  <br></br>
                  <br></br>
                  <div>Le processus de vote : </div>
                  <br></br>
                  <div>Voici le déroulement de l&acute;ensemble du processus de vote :</div>
                  <ul>
                    <li>L&acute;administrateur du vote enregistre une liste blanche d&acute;électeurs identifiés par leur adresse Ethereum.</li>
                    <li>L&acute;administrateur du vote commence la session d&acute;enregistrement de la proposition.</li>
                    <li>Les électeurs inscrits sont autorisés à enregistrer leurs propositions pendant que la session d&acute;enregistrement est active.</li>
                    <li>L&acute;administrateur de vote met fin à la session d&acute;enregistrement des propositions.</li>
                    <li>L&acute;administrateur du vote commence la session de vote.</li>
                    <li>Les électeurs inscrits votent pour leurs propositions préférées.</li>
                    <li>L&acute;administrateur du vote met fin à la session de vote.</li>
                    <li>L&acute;administrateur du vote comptabilise les votes.</li>
                    <li>Tout le monde peut vérifier les derniers détails de la proposition gagnante.</li>
                  </ul>
                </Card.Body>
              </Card>
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default App;
