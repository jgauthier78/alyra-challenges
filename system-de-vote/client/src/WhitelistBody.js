import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";

class VotingBody extends Component {
  state = { web3: null, accounts: null, contract: null, Voting: null };

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

  Voting = async() => {
    const { accounts, contract } = this.state;
    const address = this.address.value;
    
    // Interaction avec le smart contract pour ajouter un compte 
    try {
      await contract.methods.Voting(address).send({from: accounts[0]});
    }
    catch (err) {
      alert('An error occurred:\n' + err, 'Incorrect Adress?');
    }

    // Récupérer la liste des comptes autorisés
    this.runInit();
  }
 
  runInit = async() => {
    const { contract } = this.state;
  
    // récupérer la liste des comptes autorisés
    const Proposals = await contract.methods.proposals.call();

    // Mettre à jour le state 
    this.setState({ Proposals: Proposals });
  }; 

  render() {
    const { Proposals, contract, accounts } = this.state;

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div>
        <h3 className="text-center">Système d'une liste blanche</h3>
        <hr></hr>
        <br></br>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Card style={{ width: '50rem' }}>
            <Card.Header><strong>Autoriser un nouveau compte</strong></Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Control type="text" id="address"
                ref={(input) => { this.address = input }}
                />
              </Form.Group>
              <Button onClick={ this.Proposals } variant="dark" > Autoriser </Button>
            </Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Liste des comptes autorisés</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Proposals !== null && 
                      Proposals.map((a) => <tr key={a.toString()}><td>{a}</td></tr>)
                    }
                  </tbody>
                </Table>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </div>
      </div>
    )
  }
}

export default VotingBody;
