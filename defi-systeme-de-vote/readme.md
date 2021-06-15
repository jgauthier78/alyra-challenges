# Défi : Système de vote

## Spécifications

Votre Dapp doit permettre : 

* l’enregistrement d’une liste blanche d'électeurs. 
* à l'administrateur de commencer la session d'enregistrement de la proposition.
* aux électeurs inscrits d’enregistrer leurs propositions.
* à l'administrateur de mettre fin à la session d'enregistrement des propositions.
* à l'administrateur de commencer la session de vote.
* aux électeurs inscrits de voter pour leurs propositions préférées.
* à l'administrateur de mettre fin à la session de vote.
* à l'administrateur de comptabiliser les votes.
* à tout le monde de consulter le résultat.

Les recommandations et exigences :

* Votre code doit être optimal. 
* Votre Dapp doit être sécurisée. 
* Vous devez utiliser la box react de Truffle. 

À rendre :

* Vidéo démo des fonctionnalités de votre Front (hébergement youtube, Google Drive ou autre).
* Lien vers votre répertoire Github.

## Analyse fonctionnelle

De manière générale l'app sera présente sous forme d'onglets : chaque onglet permettra d'accéder
aux fonctionalités principales décrites ci-après.
En fonction du statut en cours (rien n'est démarré, enregistrement des votants, enregistrement des propositions...)

Concept d'administrateur (le seul à pouvoir faire certaines actions comme les dmérrages/fins de sessions) : c'est le propriétaire du contrat.

### l’enregistrement d’une liste blanche d'électeurs. 
Nous reprendrons la trame du TP "DApp Système d'une liste blanche"

### à l'administrateur de commencer la session d'enregistrement de la proposition.
Un onglet "Propositions" permettra à l'administrateur de démarrer et stopper la session d'enregistrement des propositions
(options accessibles par l'administrateur seulement)

### aux électeurs inscrits d’enregistrer leurs propositions.
Le même onglet propositions proposera une autre vue pour les utilisateurs non administrateur :
sur le même principe que la saisie de la liste blanche, les utilisateurs pourront ici saisir une nouvelle proposition ou voir leur proposition enregistrée. A voir = possibilité de lister toutes les propositions déjà effectuées.

### à l'administrateur de mettre fin à la session d'enregistrement des propositions.

### à l'administrateur de commencer la session de vote.

### aux électeurs inscrits de voter pour leurs propositions préférées.

### à l'administrateur de mettre fin à la session de vote.

### à l'administrateur de comptabiliser les votes.

### à tout le monde de consulter le résultat.
