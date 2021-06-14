import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import WhitelistContract from "./contracts/Whitelist.json";
import getWeb3 from "./getWeb3";

class WhitelistBody extends Component {
  state = { web3: null, accounts: null, contract: null, whitelist: null };

  componentWillMount = async () => {
    try {
      // Récupérer le provider web3
      const web3 = await getWeb3();
  
      // Utiliser web3 pour récupérer les comptes de l’utilisateur (MetaMask dans notre cas) 
      const accounts = await web3.eth.getAccounts();

      // Récupérer l’instance du smart contract “Whitelist” avec web3 et les informations du déploiement du fichier (client/src/contracts/Whitelist.json)
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = WhitelistContract.networks[networkId];
  
      const instance = new web3.eth.Contract(
        WhitelistContract.abi,
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

  whitelist = async() => {
    const { accounts, contract } = this.state;
    const address = this.address.value;
    
    // Interaction avec le smart contract pour ajouter un compte 
    try {
      await contract.methods.whitelist(address).send({from: accounts[0]});
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
    const whitelist = await contract.methods.getAddresses().call();

    // Mettre à jour le state 
    this.setState({ whitelist: whitelist });
  }; 

  render() {
    const { whitelist, contract, accounts } = this.state;

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
              <Button onClick={ this.whitelist } variant="dark" > Autoriser </Button>
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
                    {whitelist !== null && 
                      whitelist.map((a) => <tr key={a.toString()}><td>{a}</td></tr>)
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

export default WhitelistBody;
