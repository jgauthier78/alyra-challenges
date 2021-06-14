import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import WhitelistContract from "./contracts/Whitelist.json";
import getWeb3 from "./getWeb3";
import WhitelistBody from "./WhitelistBody.js";
import "./App.css";

class App extends Component {

  render() {
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
              </Card>
            </div>
          </Tab>
          <Tab eventKey="whitelistTab" title="Liste blanche">
            <WhitelistBody/>
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
