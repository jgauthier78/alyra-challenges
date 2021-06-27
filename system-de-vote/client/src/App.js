import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import getWeb3 from "./getWeb3";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
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
      alert(
        `Non-Ethereum browser detected. Can you please try to install MetaMask before starting.`,
      );
      console.error(error);
    }
  };

  runInit = async() => {
    const { accounts, contract } = this.state;
    const contractOwner = await contract.methods.owner().call();
    const isOwner = accounts !== null && contractOwner == accounts[0] ? true : false;
    this.setState({ contractOwner: contractOwner, isOwner: isOwner });
  }; 

  render() {
    const { contract, accounts, contractOwner, isOwner } = this.state;

    let divOwner;
    if (isOwner) {
      divOwner = <div>Vous êtes le propriétaire du contrat, en conséquence l'administrateur du vote</div>;
    } else {
      divOwner = <div>Ici nous indiquerons le statut/avancement du vote et si l'utilisateur peut voter</div>;
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
                  <span>{contractOwner}</span></div>
                <div>
                  <span>Compte connecté : </span>
                  {accounts !== null && 
                    accounts.map((accountRecord) => <span>{accountRecord}</span>)
                  }
                </div>
                <br></br>
                {divOwner}
              </Card>
            </div>
          </Tab>
          <Tab eventKey="whitelistTab" title="Liste blanche">
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
