// AUDIT : fixer le ppragma à une version précise + utiliser la dernière version disponible (0.8.4 à ce jour)
pragma solidity ^0.5.12;
 
contract Crowdsale {
   // AUDIT : manque l'import de la librairie
   using SafeMath for uint256;
 
   // AUDIT : remarques générales
   // 1) toutes les variables qui suivent n'ont pas besoin d'être publiques
   // 2) ajouter des events sur les fonctions pour une meilleure visibilité (log)
   


   // AUDIT : la variable owner ne sert pas réellement au contrat, devrait être supprimée
   address public owner; // the owner of the contract
   address public escrow; // wallet to collect raised ETH
   uint256 public savedBalance = 0; // Total amount raised in ETH
   mapping (address => uint256) public balances; // Balances in incoming Ether
 
   // Initialization
   // AUDIT : utiliser constructor au lieu de function + _escrow doit être payable
   function Crowdsale(address _escrow) public{
       // AUDIT : on devrait utiliser msg.sender au lieu de tx.origin sinon on risque de ne pas connaitre le réel owner du contrat appelant
       //         (cf https://docs.soliditylang.org/en/v0.5.12/security-considerations.html - section tx.origin)
       owner = tx.origin;
       // add address of the specific contract
       escrow = _escrow;
   }
  
   // function to receive ETH
   // AUDIT : la fonction fallback devrait être payable (Depuis la version Solidity 0.4.0, chaque fonction qui reçoit des Ethers
   //         doit utiliser le modifier payable. Sinon, si la transaction a msg.value > 0 elle échouera.)
   function() public {
       balances[msg.sender] = balances[msg.sender].add(msg.value);
       savedBalance = savedBalance.add(msg.value);
       // AUDIT : utiliser .transfer  au lieu de .send pour annuler en cas d'erreur
       escrow.send(msg.value);
   }
  
   // refund investisor
   function withdrawPayments() public{
       // AUDIT : payee doit être déclaré payable
       address payee = msg.sender;
       uint256 payment = balances[payee];
 
       // AUDIT : risque de réentrance, à mettre à la fin + utiliser .transfer
       payee.send(payment);
 
       savedBalance = savedBalance.sub(payment);
       balances[payee] = 0;
   }
}