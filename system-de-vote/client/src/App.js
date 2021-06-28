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
import VotingBody from "./VotingBody.js";
import VotingContract from "./contracts/Voting.json";
import "./App.css";

class App extends Component {

  state = { web3: null, accounts: null, contract: null };

  componentWillMount = async () => {
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
      this.setState({ web3, accounts, contract: instance }, this.runInit);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert('Non-Ethereum browser detected. Can you please try to install MetaMask before starting.',);
      console.error(error);
    }
  };
  
  startProposalsRegistration = async() => {
    const { accounts, contract } = this.state;
    try {
      await contract.methods.startProposalsRegistration().call({from: accounts[0]})
        .then(function(res){
          alert('Enregistrement des propositions démarré');
        }).catch(function(err) {
          alert('Erreur au démarrage des propositions :\n' + err);
        });
    }
    catch (err) {
      alert('Une erreur s\'est produite au démarrage des propositions :\n' + Jsonify.stringify(err),);
    }
  }

  stopProposalsRegistration = async() => {
    const { accounts, contract } = this.state;
    try {
      await contract.methods.stopProposalsRegistration().call({from: accounts[0]})
        .then(function(res){
          alert('Enregistrement des propositions démarré');
        }).catch(function(err) {
          alert('Erreur à l\{arrêt des propositions :\n' + err);
        });
    }
    catch (err) {
      alert('Une erreur s\'est produite à l\{arrêt des propositions :\n' + Jsonify.stringify(err),);
    }
  }

  registerProposal = async() => {
    const { accounts, contract } = this.state;
    const proposalDescription = this.proposalDescription.value;
    
    // Interaction avec le smart contract pour ajouter un compte 
    try {
      await contract.methods.registerProposal(proposalDescription).send({from: accounts[0]});
    }
    catch (err) {
      alert('Une erreur est survenue lors de l\'ajout de la proposition :\n' + err.reason,);
    }
  }
 
  runInit = async() => {
    const { accounts, contract } = this.state;
    const contractOwner = await contract.methods.owner().call();
    const isOwner = accounts !== null && contractOwner == accounts[0] ? true : false;
    
    const currentWorkflowStatus = await contract.methods.getCurrentWorkflowStatus().call();
    // possible workflow status values
    // 0: RegisteringVoters
    // 1: ProposalsRegistrationStarted
    // 2: ProposalsRegistrationEnded
    // 3: VotingSessionStarted
    // 4: VotingSessionEnded
    // 5: VotesTallied
    
    let proposals = null;
    await contract.methods.getProposals().call()
      .then(function(res){
        if (res !== 'undefined' && typeof(res.length) !== 'undefined') {
          proposals = res;
        }
      }).catch(function(err) {
        alert('Erreur lors de la récupération des propositions :\n' + err);
      });
    
    this.setState({ contractOwner, currentWorkflowStatus, isOwner, proposals });
  }; 

  render() {
    const { contract, accounts, contractOwner, currentWorkflowStatus, isOwner, proposals } = this.state;

    let divOwner;
    if (isOwner) {
      divOwner = <div>Vous êtes le propriétaire du contrat, en conséquence l'administrateur du vote</div>;
    } else {
      divOwner = <div>Ici nous indiquerons le statut/avancement du vote et si l'utilisateur peut voter</div>;
    }

    let divOwnerProposals;
    if (isOwner) {
      divOwnerProposals = <div>
                            <br></br>
                            <div>
                              <Button onClick={ this.startProposalsRegistration } variant="dark" > Démarrer l'enregistrement des propositions </Button>
                            </div>
                            <br></br>
                            <div>
                              <Button onClick={ this.stopProposalsRegistration } variant="dark" > Arrêter l'enregistrement des propositions </Button>
                            </div>
                            <br></br>
                          </div>;

    }

    return (
      <div className="App">
        <Tabs defaultActiveKey="home" id="defi-tabs">
          <Tab eventKey="home" title="Home">
            <div>
              <h3 className="text-center">Bienvenue sur le défi "Système de vote"</h3>
              <hr></hr>
              <br></br>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Card style={{ width: '50rem' }}>
                <Card.Header><strong>Explications</strong></Card.Header>
                <Card.Body>
                  Veuillez utiliser les onglets situés en haut de gauche à droite pour accéder aux différentes actions possibles
                </Card.Body>
                <div>
                  <span>Propriétaire du contrat : </span>
                  <span>{contractOwner}</span>
                </div>
                <br></br>
                <div>
                  <span>Statut du workflow en cours : </span>
                  <span>{currentWorkflowStatus}</span>
                </div>
                <div>
                  <span>Compte connecté : </span>
                  {accounts !== null && 
                    accounts.map((accountRecord) => <span key={accountRecord.toString()}>{accountRecord}</span>)
                  }
                </div>
                <br></br>
                {divOwner}
              </Card>
            </div>
          </Tab>
          <Tab eventKey="whitelistTab" title="Liste des votants">
            <VotingBody/>
          </Tab>
          <Tab eventKey="contact" title="Propositions">
            <div>
              <h3 className="text-center">Saisie des propositions</h3>
              <hr></hr>
              <br></br>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Card style={{ width: '50rem' }}>
                <Card.Header><strong>Explications</strong></Card.Header>
                <Card.Body>
                  Retrouvez ici les propositions et la possibilité d'en saisir de nouvelles
                  <br></br>
                  {divOwnerProposals}                  
                </Card.Body>
              </Card>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Card style={{ width: '50rem' }}>
                <Card.Header><strong>Ajouter une proposition</strong></Card.Header>
                <Card.Body>
                  <Form.Group>
                    <Form.Control type="text" id="proposalDescription"
                    ref={(input) => { this.proposalDescription = input }}
                    />
                  </Form.Group>
                  <Button onClick={ this.registerProposal } variant="dark" > Ajouter </Button>
                </Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Liste des propositions</th>
                        </tr>
                      </thead>
                      <tbody>
                        Display proposals here = same approach as for votersAdresses
                        {typeof(proposals) !== 'undefined' && proposals !== null && 
                          proposals.map((a) => <tr key={a.toString()}><td>{a}</td></tr>)
                        }
                      </tbody>
                    </Table>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default App;
