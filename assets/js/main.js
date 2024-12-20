


let profile = document.querySelector('.header .profile');

document.querySelector('#user-btn').onclick = () => {
   profile.classList.toggle('active');
   search.classList.remove('active');
}

let toggleBtn = document.getElementById('toggle-btn');
let body = document.body;
let darkMode = localStorage.getItem('dark-mode');

const enableDarkMode = () => {
   toggleBtn.classList.replace('fa-sun', 'fa-moon');
   body.classList.add('dark');
   localStorage.setItem('dark-mode', 'enabled');
}

const disableDarkMode = () => {
   toggleBtn.classList.replace('fa-moon', 'fa-sun');
   body.classList.remove('dark');
   localStorage.setItem('dark-mode', 'disabled');
}

if (darkMode === 'enabled') {
   enableDarkMode();
}

toggleBtn.onclick = (e) => {
   darkMode = localStorage.getItem('dark-mode');
   if (darkMode === 'disabled') {
      enableDarkMode();
   } else {
      disableDarkMode();
   }
}

const URL_DE_BASE = 'http://localhost:3000';
let DB = {};

const recuperersessions = async () => {
  try {
    const reponse = await fetch(`${URL_DE_BASE}/sessions`);
    if (!reponse.ok) {
      throw new Error(`Erreur HTTP ! statut : ${reponse.status}`);
    }

    const sessions = await reponse.json();

    DB.sessions = sessions;

    console.log('Sessions récupérées et ajoutées à DB :', DB);

    return DB;
  } catch (erreur) {
    console.error('Erreur lors de la récupération des sessions :', erreur);
    throw erreur;
  }
};
const afficherSessions = () => {
   console.log("Affichage des sessions en cours :", DB.sessions);
  
 
   // Sélectionner le tbody pour insérer les éléments
   const tableauApprenants = document.querySelector("#tableau-apprenants tbody");
   tableauApprenants.innerHTML = ""; // Réinitialise le contenu du tableau
 
   DB.sessions.forEach((apprenant) => {
     console.log("Session ajoutée :", apprenant);
 
     // Créer une nouvelle ligne
     const nouvelleLigne = document.createElement("tr");
     nouvelleLigne.setAttribute("data-apprenant-id", apprenant.id_session);
 
     // Parcourir les propriétés à afficher dans le tableau
     ["date", "debut", "fin", "matière"].forEach((prop) => {
       const nouvelleCellule = document.createElement("td");
       nouvelleCellule.textContent = apprenant[prop];
       nouvelleLigne.appendChild(nouvelleCellule);
     });
 
     // Ajouter les cellules pour les actions
     const celluleActions = document.createElement("td");
     celluleActions.classList.add("bloc");
 
     // Ajouter une case à cocher
     const divActions = document.createElement("div");
     divActions.classList.add("col-haut");
     const checkbox = document.createElement("input");
     checkbox.type = "checkbox";
     checkbox.id = "my-checkbox-" + apprenant.id_session;
     checkbox.dataset.apprenantId = apprenant.id_session; // Associer à l'apprenant
     const labelCheckbox = document.createElement("label");
     labelCheckbox.setAttribute("for", checkbox.id);
 
     divActions.appendChild(checkbox);
     divActions.appendChild(labelCheckbox);
 
     // Ajouter un bouton "Modifier" avec une icône
     const boutonModifier = document.createElement("button");
     boutonModifier.classList.add("btn-modifier");
     boutonModifier.innerHTML = '<i class="fas fa-edit"></i>';
     boutonModifier.addEventListener("click", () => {
       window.location.href = "#popup";
       ouvrirModalModification(apprenant);
       isEditing = true;
     });
 
     divActions.appendChild(boutonModifier);
     celluleActions.appendChild(divActions);
     nouvelleLigne.appendChild(celluleActions);
 
     // Ajouter la nouvelle ligne au tableau
     tableauApprenants.appendChild(nouvelleLigne);
   });
 
   // Ajouter un événement click sur les images des apprenants
   const images = tableauApprenants.querySelectorAll("img");
   images.forEach((image) => {
     image.addEventListener("click", (event) => {
       const ligneCliquee = event.target.closest("tr");
       const apprenantId = ligneCliquee.getAttribute("data-apprenant-id");
       const apprenant = DB.sessions.find((apprenant) => apprenant.id_session === parseInt(apprenantId));
 
       // Afficher le modal avec la photo et le code QR de l'apprenant
       afficherModalApprenant(apprenant);
     });
   });
 
   // Ajouter la gestion de la pagination
   ajouterBoutonsPagination();
 };
 
 

(async () => {
  try {
    await recuperersessions();
    afficherSessions(); // Appeler l'affichage après récupération
  } catch (error) {
    console.error('Erreur lors de l’appel à la fonction recuperersessions :', error);
  }
})();



// Sélectionner le bouton "Créer nouvel apprenant"
const btnNouvelAp = document.getElementById("btnNouvelAp");
const debut = document.getElementById('debut');
const fin = document.getElementById('fin');
const matier = document.getElementById('matier');
const imageNaissance = document.getElementById('imageNaissance');
const cni = document.getElementById('cni');
const sexe = document.getElementById('sexe');
const email = document.getElementById('email');
const lieuNaissance = document.getElementById('lieuNaissance');
const referentiel = document.getElementById('id_referentiel');
const promo = document.getElementById('id_promo');
const image = document.querySelector('#image');
const imageEtudiant = document.getElementById("imageEtudiant");


// Fonction pour afficher un message d'erreur sous un champ
function afficherMessageErreur(champ, message) {
   const messageErreur = document.createElement("div");
   messageErreur.classList.add("erreur-message");
   messageErreur.textContent = message;
   messageErreur.style.color = "red";
   champ.parentNode.appendChild(messageErreur);
}

// Fonction pour valider le champ fin ou préfin
function validerfindebut(champ, finChamp) {
   const valeur = champ.value.trim();
   if (valeur === "") {
      afficherMessageErreur(champ, finChamp + " est obligatoire");
      return false;
   } else if (!/^[a-zA-Z]{5,20}$/.test(valeur)) {
      afficherMessageErreur(champ, finChamp + " doit contenir uniquement des lettres (minimum 5 caractères et maximum 20 caractères)");
      return false;
   }
   return true;
}

// Fonction pour valider le champ téléphone
function validermatier(champ) {
   const valeur = champ.value.trim();
   if (valeur === "") {
      afficherMessageErreur(champ, "Téléphone est obligatoire");
      return false;
   } else if (!/^\d{9}$/.test(valeur)) {
      afficherMessageErreur(champ, "Téléphone doit contenir exactement 9 chiffres");
      return false;
   }
   return true;
}

// Fonction pour valider le champ CNI
function validerCNI(champ) {
   const valeur = champ.value.trim();
   if (valeur === "") {
      afficherMessageErreur(champ, "N° CNI est obligatoire");
      return false;
   } else if (!/^\d{1,16}$/.test(valeur)) {
      afficherMessageErreur(champ, "N° CNI doit contenir uniquement des chiffres (maximum 16 chiffres)");
      return false;
   }
   return true;
}

// Fonction pour valider le champ lieu de naissance
function validerLieuNaissance(champ) {
   const valeur = champ.value.trim();
   if (valeur === "") {
      afficherMessageErreur(champ, "Lieu de Naissance est obligatoire");
      return false;
   } else if (!/^[a-zA-Z]+$/.test(valeur)) {
      afficherMessageErreur(champ, "Lieu de Naissance doit contenir uniquement des lettres");
      return false;
   }
   return true;
}

// Fonction pour valider l'adresse email
function validerEmail(champ) {
   const valeur = champ.value.trim();
   if (valeur === "") {
      afficherMessageErreur(champ, "Email est obligatoire");
      return false;
   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeur)) {
      afficherMessageErreur(champ, "Email n'est pas valide");
      return false;
   }
   return true;
}


image.addEventListener("input", () => {
   imageEtudiant.src = image.value;
});


// événemant click sur le bouton nouveau
btnNouvelAp.addEventListener('click', (e) => {
   e.preventDefault();

   // Supprimer les messages d'erreur précédents
   const messagesErreurs = document.querySelectorAll(".erreur-message");
   messagesErreurs.forEach(function (message) {
      message.remove();
   });




   // Valider chaque champ du formulaire
   // const id_session = document.getElementById("id_apprenant").value;
   const finValide = validerfindebut(document.getElementById("fin"), "fin");
   const debutValide = validerfindebut(document.getElementById("debut"), "Préfin");
   const matierValide = validermatier(document.getElementById("matier"));
   const cniValide = validerCNI(document.getElementById("cni"));
   const lieuNaissanceValide = validerLieuNaissance(document.getElementById("lieuNaissance"));
   const emailValide = validerEmail(document.getElementById("email"));


   // Si tous les champs sont valides, ajouter l'apprenant
   if (finValide && debutValide && matierValide && cniValide && lieuNaissanceValide && emailValide) {

      // imageEtudiant.src = image.value;
      const nouvelAp = {
         id_session: DB.sessions.length + 1,
         image: image.value,
         debut: debut.value,
         fin: fin.value,
         matier: matier.value,
         format: imageNaissance.value,
         numero_carte_identite: cni.value,
         sexe: sexe.value,
         email: email.value,
         lieuNaissance: lieuNaissance.value,
         referentiel: referentiel.value,
         promo: promo.value
      };
      DB.sessions.push(nouvelAp);
      // console.log(DB);
      afficherSessions();
   }

});









// recherche par fin ou par debut
const searchInput = document.getElementById("searchInput");
let tableauGlobalInitial = [...DB.sessions];
document.getElementById('searchInput').addEventListener('input', (e) => {
   let valeurSaisie = e.target.value.trim();
   let nouvelleTailleSaisie = valeurSaisie.length;

   if (nouvelleTailleSaisie > 2) {
      const tableFilter = DB.sessions.filter((item) => {
         return (


            item.fin.toLowerCase().includes(valeurSaisie.toLowerCase()) || item.debut.toLowerCase().includes(valeurSaisie.toLowerCase())
         );


      });

      DB.sessions = tableFilter;

      // console.log(DB.sessions);
      // console.log(nouvelleTailleSaisie);

      afficherSessions();
   } else if (nouvelleTailleSaisie < ancienneTailleSaisie) {

      DB.sessions = [...tableauGlobalInitial];

      // console.log(DB.sessions);
      // console.log(nouvelleTailleSaisie);

      afficherSessions();
   }


   ancienneTailleSaisie = nouvelleTailleSaisie;
});


// Sélectionner le tableau HTML
const tableauApprenants = document.querySelector(".line5 tbody");
let apprenantsParPage = 5;
let pageActuelle = 1;


let apprenantEnCours = null;
let isEditing = false;
// Fonction pour afficher les apprenants dans le tableau HTML
// function afficherSessions() {
//    const indiceDebut = (pageActuelle - 1) * apprenantsParPage;
//    const indiceFin = indiceDebut + apprenantsParPage;

//    tableauApprenants.innerHTML = "";


   

//    // Parcourir tous les apprenants dans DB.etudiants
//    DB.sessions.slice(indiceDebut, indiceFin).forEach(function (apprenant) {
//       const nouvelleLigne = document.createElement("tr");
//       nouvelleLigne.classList.add("line");

//       // Ajouter les cellules pour chaque propriété de l'apprenant
//       const cellules = ["image", "fin", "debut", "email", "sexe", "matier", "referentiel"];
//       cellules.forEach(function (prop) {
//          const nouvelleCellule = document.createElement("td");
//          nouvelleCellule.classList.add("bloc");
//          const nouvelleDiv = document.createElement("div");
//          nouvelleDiv.classList.add("col-bas");
//          if (prop === "image") { // Si c'est la propriété "image"
//             // Créer un élément img
//             const imgElement = document.createElement("img");
//             // Appliquer la classe "profile-image" pour la taille de l'image de profil
//             imgElement.classList.add("profile-image");
//             // Définir la source sur le lien de l'image
//             imgElement.src = apprenant[prop];
//             imgElement.alt = "Photo de l'apprenant"; // Ajouter une description alternative pour l'accessibilité
//             nouvelleDiv.appendChild(imgElement);
//          } else {
//             nouvelleDiv.textContent = apprenant[prop];
//          }
//          nouvelleCellule.appendChild(nouvelleDiv);
//          nouvelleLigne.appendChild(nouvelleCellule);
//       });

//       // Ajouter la case à cocher pour les actions
//       const celluleActions = document.createElement("td");
//       celluleActions.classList.add("bloc");
//       const divActions = document.createElement("div");
//       divActions.classList.add("col-haut");
//       const checkbox = document.createElement("input");
//       checkbox.setAttribute("type", "checkbox");
//       checkbox.dataset.apprenantId = apprenant.id_session; // associer l'apprenant à la case à cocher en utilisant l'attribut de données
//       checkbox.id = "my-checkbox-" + apprenant.id_session; // Assurez-vous que chaque ID de case à cocher est unique
//       const labelCheckbox = document.createElement("label");
//       labelCheckbox.setAttribute("for", "my-checkbox-" + apprenant.id_session);
//       divActions.appendChild(checkbox);
//       divActions.appendChild(labelCheckbox);
//       celluleActions.appendChild(divActions);
//       nouvelleLigne.appendChild(celluleActions);



      
      
//       // Créer le bouton "Modifier" avec une icône à la place du texte
//       const boutonModifier = document.createElement("button");
//       boutonModifier.classList.add("btn-modifier"); // Ajouter une classe pour le style CSS
//       // Utiliser une balise <i> avec la classe Font Awesome correspondant à l'icône de modification
//       boutonModifier.innerHTML = '<i class="fas fa-edit"></i>';
//       boutonModifier.onclick = function () {
//          window.location.href = '#popup'; // Rediriger vers l'ID du modal pour l'afficher
//          ouvrirModalModification(apprenant);
//          isEditing = true; // Définir isEditing sur true
//       };
//       divActions.appendChild(boutonModifier);

//       nouvelleLigne.setAttribute('data-apprenant-id', apprenant.id_session);
//       // Ajouter la nouvelle ligne au tableau
//       tableauApprenants.appendChild(nouvelleLigne);

//    });

//    // Ajouter un événement click sur chaque ligne du tableau
  

//    const lignes = tableauApprenants.querySelectorAll("img");
//    lignes.forEach(ligne => {
//       ligne.addEventListener("click", function (event) {
//          const ligneClique = event.target.parentNode;
//          const apprenantId = ligneClique.getAttribute("data-apprenant-id");
//          const apprenant = DB.sessions.find(apprenant => apprenant.id_session === parseInt(apprenantId));
   
//          // Afficher le modal avec la photo et le code QR de l'apprenant
//          afficherModalApprenant(apprenant);
//       });
   
      
//    });

//    ajouterBoutonsPagination();


// }




// Fonction pour afficher le modal avec la photo et le code QR de l'apprenant
function afficherModalApprenant(apprenant) {
   const modal = document.getElementById("modal-apprenant");
   modal.style.display = "block";

   const contenuModal = modal.querySelector(".modal-content");
   contenuModal.innerHTML = "";

   // Ajouter la photo de l'apprenant
   const imgElement = document.createElement("img");
   imgElement.src = apprenant.image;
   imgElement.alt = "Photo de l'apprenant";
   contenuModal.appendChild(imgElement);

   // Générer le code QR avec le numéro de téléphone de l'apprenant
   const qrCode = document.createElement("div");
   const telefoneUrl = `tel:${apprenant.matier.toString()}`;
   const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(telefoneUrl)}`;
   ;
   const qrCodeImg = document.createElement("img");
   qrCodeImg.src = qrCodeUrl;
   qrCodeImg.alt = "Code QR du numéro de téléphone de l'apprenant";
   qrCode.appendChild(qrCodeImg);
   qrCode.id = "qr-code"; // Ajoutez un ID pour référencer le code QR
   contenuModal.appendChild(qrCode);

   // Ajouter un écouteur d'événements pour fermer le modal lorsque l'utilisateur clique en dehors de celui-ci
   modal.addEventListener("click", function (event) {
      if (event.target === modal) {
         modal.style.display = "none";
      }
   });
}


// Fonction pour ouvrir le modal de modification avec les données de la ligne cliquée
function ouvrirModalModification(apprenant) {
   apprenantEnCours = apprenant;
   const boutonCreerModifier = document.querySelector('.modifier');
   document.getElementById("fin").value = apprenant.fin;
   document.getElementById("debut").value = apprenant.debut;
   document.getElementById("email").value = apprenant.email;
   document.getElementById("sexe").value = apprenant.sexe;
   document.getElementById("matier").value = apprenant.matier;
   document.getElementById("referentiel").value = apprenant.referentiel;
   document.getElementById("image").value = apprenant.image;
   document.getElementById('imageNaissance').value = apprenant.format;
   document.getElementById('cni').value = apprenant.numero_carte_identite;
   document.getElementById('lieuNaissance').value = apprenant.lieuNaissance;

   // Modifier le texte du bouton "Créer" en "Modifier"
   boutonCreerModifier.textContent = 'Modifier';

}

// Fonction pour modifier l'apprenant
// Fonction pour modifier l'apprenant
function modifierApprenant() {
   const apprenantId = apprenantEnCours.id_session;
   const apprenantRow = document.querySelector(`tr[data-apprenant-id="${apprenantId}"]`);

   const cellules = ["image", "fin", "debut", "email", "sexe", "matier", "referentiel"];
   apprenantEnCours.fin = document.getElementById("fin").value;
   apprenantEnCours.debut = document.getElementById("debut").value;
   apprenantEnCours.email = document.getElementById("email").value;
   apprenantEnCours.sexe = document.getElementById("sexe").value;
   apprenantEnCours.matier = document.getElementById("matier").value;
   apprenantEnCours.referentiel = document.getElementById("referentiel").value;
   apprenantEnCours.image = document.getElementById("image").value;
   apprenantEnCours.format = document.getElementById('imageNaissance').value;
   apprenantEnCours.numero_carte_identite = document.getElementById('cni').value;
   apprenantEnCours.lieuNaissance = document.getElementById('lieuNaissance').value;

   // Mettre à jour les informations de l'apprenant dans la ligne correspondante du tableau
   const cellulesRow = apprenantRow.querySelectorAll(".bloc");
   cellules.forEach(function (prop, index) {
      if (prop === "image") {
         cellulesRow[index].querySelector("img").src = apprenantEnCours[prop];
      } else {
         cellulesRow[index].textContent = apprenantEnCours[prop];
      }
   });

   // Réinitialiser le formulaire
   document.getElementById("fin").value = "";
   document.getElementById("debut").value = "";
   document.getElementById("email").value = "";
   document.getElementById("sexe").value = "";
   document.getElementById("matier").value = "";
   document.getElementById("referentiel").value = "";
   document.getElementById("image").value = "";
   document.getElementById('imageNaissance').value = "";
   document.getElementById('cni').value = "";
   document.getElementById('lieuNaissance').value = "";
};


const btnNouvelApText = document.getElementById('btnNouvelApText');

// Fonction pour changer le texte du bouton en alternance
function changerTexteBouton() {
   if (btnNouvelApText.textContent === '+ Créer nouvel apprenant') {
      btnNouvelApText.textContent = 'Modifier';
   } else {
      btnNouvelApText.textContent = '+ Créer nouvel apprenant';
   }
}

// Ajouter un écouteur d'événements pour changer le texte du bouton en alternance lorsqu'il est cliqué
document.getElementById('btnNouvelAp').addEventListener('click', changerTexteBouton);








// funtion pour pagination
function ajouterBoutonsPagination() {
   const totalApprenants = DB.sessions.length;
   const totalPages = Math.ceil(totalApprenants / apprenantsParPage);

   const paginationContainer = document.getElementById("pagination");
   paginationContainer.innerHTML = "";

   if (totalPages > 1) {
      if (pageActuelle > 1) {
         const boutonPrecedent = creerBoutonPagination("Précédent", pageActuelle - 1);
         paginationContainer.appendChild(boutonPrecedent);
      }

      for (let i = 1; i <= totalPages; i++) {
         const boutonPage = creerBoutonPagination(i, i);
         paginationContainer.appendChild(boutonPage);
      }

      if (pageActuelle < totalPages) {
         const boutonSuivant = creerBoutonPagination("Suivant", pageActuelle + 1);
         paginationContainer.appendChild(boutonSuivant);
      }
   }
}
function creerBoutonPagination(texte, numeroPage) {
   const bouton = document.createElement("a");
   bouton.href = "#";
   bouton.classList.add("page-link");
   bouton.textContent = texte;
   bouton.addEventListener("click", function () {
      pageActuelle = numeroPage;
      afficherSessions();
   });
   return bouton;
}
function changerfinbreItems(nouveaufinbre) {
   apprenantsParPage = nouveaufinbre;
   pageActuelle = 1; // Revenir à la première page lors du changement du finbre d'éléments par page
   afficherSessions();
}
afficherSessions();








// editer sur chaque cellule du tableau
tableauApprenants.addEventListener('dblclick', function (event) {
   const celluleCible = event.target.closest('td');
   if (celluleCible) {
      // Rendre la cellule éditable
      celluleCible.setAttribute('contenteditable', 'true');
      celluleCible.style.fontSize = '20px';
      celluleCible.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
      celluleCible.type = 'text';
      celluleCible.focus(); // Focus sur la cellule pour que l'utilisateur puisse commencer à éditer immédiatement

      celluleCible.addEventListener('keydown', function (event) {
         if (event.key === 'Enter') {
            celluleCible.removeAttribute('contenteditable');
            sauvegarderModification(celluleCible); // Appel de la fonction pour sauvegarder la modification
            celluleCible.style.backgroundColor = 'transparent';
         }
      });
   }
});



// Fonction pour sauvegarder les modifications apportées à une cellule
function sauvegarderModification(cellule) {
   const ligne = cellule.closest('tr'); // Obtenir la ligne parente de la cellule
   const indexApprenant = Array.from(ligne.parentNode.children).indexOf(ligne); // Obtenir l'index de l'apprenant dans le tableau
   const colonne = Array.from(cellule.parentNode.children).indexOf(cellule); // Obtenir l'index de la colonne de la cellule éditée

   // Mettre à jour les données de l'apprenant modifié
   const valeurModifiee = cellule.textContent.trim();
   if (colonne === 1) {
      DB.sessions[indexApprenant].fin = valeurModifiee;
   } else if (colonne === 2) {
      DB.sessions[indexApprenant].debut = valeurModifiee;
   } else if (colonne === 3) {
      DB.sessions[indexApprenant].email = valeurModifiee;
   } else if (colonne === 4) {
      DB.sessions[indexApprenant].sexe = valeurModifiee;
   } else if (colonne === 5) {
      DB.sessions[indexApprenant].matier = valeurModifiee;
   } else if (colonne === 6) {
      DB.sessions[indexApprenant].referentiel = valeurModifiee;
   }

   // Mettre à jour les données dans le stockage local
   localStorage.setItem("data", JSON.stringify(DB));
}





// Récupérer les en-têtes de colonne
const finHeader = document.getElementById('fin-header');
const debutHeader = document.getElementById('debut-header');

// Définir une variable pour suivre l'état du tri
let triCroissantfin = true;
let triCroissantdebut = true;

// Ajouter des écouteurs d'événements pour le tri croissant et décroissant
finHeader.addEventListener('click', () => {
   trierDonnees('fin', triCroissantfin);
   triCroissantfin = !triCroissantfin; // Inverser l'état du tri
});

debutHeader.addEventListener('click', () => {
   trierDonnees('debut', triCroissantdebut);
   triCroissantdebut = !triCroissantdebut; // Inverser l'état du tri
});

// Fonction de tri des données en fonction de la colonne spécifiée
function trierDonnees(colonne, croissant) {
   // Récupérer les données des étudiants
   const sessions = DB.sessions;

   // Trier les données en fonction de la colonne spécifiée
   switch (colonne) {
      case 'fin':
         sessions.sort((a, b) => {
            if (croissant) {
               return a.fin.localeCompare(b.fin); // Tri croissant par fin
            } else {
               return b.fin.localeCompare(a.fin); // Tri décroissant par fin
            }
         });
         break;
      case 'debut':
         sessions.sort((a, b) => {
            if (croissant) {
               return a.debut.localeCompare(b.debut); // Tri croissant par préfin
            } else {
               return b.debut.localeCompare(a.debut); // Tri décroissant par préfin
            }
         });
         break;
      default:
         break;
   }

   // Afficher les données triées
   afficherSessions();
}


// *****************************transférer********************************

// récupérer le bouton de transfert
const boutonTransfert = document.querySelector(".dropdown-btn");

// ajouter un événement click sur le bouton de transfert
boutonTransfert.addEventListener("click", function () {
  // récupérer toutes les cases à cocher sélectionnées
  const checkboxesSelectionnees = document.querySelectorAll("input[type=checkbox]:checked");

  // récupérer les apprenants sélectionnés à partir des cases à cocher
  const apprenantsSelectionnes = checkboxesSelectionnees.map(function (checkbox) {
    const apprenantId = parseInt(checkbox.dataset.apprenantId);
    return DB.sessions.find(function (apprenant) {
      return apprenant.id_session === apprenantId;
    });
  });

  // récupérer le référentiel actuellement sélectionné
  const referentielActuel = apprenantsSelectionnes[0].referentiel;

  // récupérer tous les référentiels disponibles pour le transfert
  const referentielsDisponibles = DB.referentiels.filter(function (referentiel) {
    return referentiel.id_referentiel !== referentielActuel;
  });

  // afficher la liste des référentiels disponibles pour le transfert
  const dropdownContent = document.querySelector(".dropdown-content");
  dropdownContent.innerHTML = "";
  referentielsDisponibles.forEach(function (referentiel) {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.setAttribute("type", "radio");
    input.name = "referentiel";
    input.value = referentiel.id_referentiel;
    label.textContent = referentiel.fin;
    label.appendChild(input);
    dropdownContent.appendChild(label);
  });

  // ajouter un événement click sur chaque référentiel disponible pour effectuer le transfert
  const inputsReferentiel = document.querySelectorAll("input");
  inputsReferentiel.forEach(function (input) {
    input.addEventListener("click", function () {
      // effectuer le transfert des apprenants sélectionnés vers le référentiel sélectionné
      const referentielSelectionne = parseInt(input.value);
      apprenantsSelectionnes.forEach(function (apprenant) {
        apprenant.referentiel = referentielSelectionne;
      });

      // mettre à jour l'affichage du tableau pour refléter le transfert
      afficherSessions();

      // fermer le menu déroulant
      dropdownContent.classList.remove("show");
    });
  });
});











// *******************************************promotion**********************************************
// affichicher tableau promo
const promotions = document.querySelector('#promo');
const containerPromo = document.querySelector('.containerPromo');
const containerApprenant = document.querySelector('.container-table');
const btnNouvelle = document.querySelector('#nouvelle');
const popupPromo = document.querySelector('#popupPromo');
containerPromo.style.display = "none";

// Afficher la liste des promotions
promotions.addEventListener("click", () => {
   containerPromo.style.display = "block";
   containerApprenant.style.display = "none";
   btnNouveau.style.display = "none";
   btnNouvelle.style.display = "block";
   popupPromo.style.display = "none"
});

// afficher tableau apprenant
const apprenants = document.querySelector('#apprenants');
const btnNouveau = document.querySelector('#nouveau');

apprenants.addEventListener('click', () => {
   containerPromo.style.display = "none";
   containerApprenant.style.display = "block";
   btnNouvelle.style.display = "none";
   btnNouveau.style.display = "block";
   popupPromo.style.display = "none";

});


// modalajouter une promo
const closeModalBtn = document.getElementById("closeModal");
btnNouvelle.addEventListener('click', () => {
   popupPromo.style.display = "block";

   window.addEventListener("click", function (event) {
      if (event.target == popupPromo) {
         //   closeModal();
      }
   });



});
function closeModal() {
   popupPromo.style.display = "none";
}
//  empecher la fermuture en cliquant en dehors du modal
closeModalBtn.addEventListener("click", function (event) {
   event.stopPropagation();
   popupPromo.style.display = "none";
});



const tbodyPromo = document.querySelector("#tbody-promo");

document.querySelector("#promoForm").addEventListener('submit', (e) => {

   e.preventDefault();

   const libelle = document.querySelector('#libellePromo');
   const imageDebut = document.querySelector('#imageDebutPromo');
   const imageFin = document.querySelector('#imageFinPromo');

   const nouvellePromotion = {
      id_promo: DB.promotions.length + 1,
      fin: libelle.value,
      imageDebut: imageDebut.value,
      imageFin: imageFin.value,
      etat: false
   };
   DB.promotions.push(nouvellePromotion);
   console.log(DB.promotions);

   // Réinitialiser les champs du formulaire
   document.querySelector('#popupPromo form').reset();

   // Fermer le modal
   closeModal();

   // Mettre à jour le tableau HTML
   afficherPromotions();

});



function afficherPromotions() {
   const containerPromo = document.querySelector('.containerPromo table tbody');
   containerPromo.innerHTML = '';

   DB.promotions.forEach(promotion => {
      const tr = document.createElement('tr');
      tr.classList.add('line');
      tr.innerHTML = `
       <td class="bloc">
         <div class="col-bas" style="color: rgb(29, 109, 29)">
           ${promotion.fin}
         </div>
       </td>
       <td class="bloc">
         <div class="col-bas" style="color: rgb(29, 109, 29)">
           ${promotion.imageDebut}
         </div>
       </td>
       <td class="bloc">
         <div class="col-bas email">${promotion.imageFin}</div>
       </td>
       <td class="bloc action">
         <div class="col-haut"></div>
         <button class="btn-activer ${promotion.etat ? 'active' : ''}" data-id="${promotion.id_promo}">${promotion.etat ? 'Activer' : 'Desactiver'}</button>
       </td>
     `;
      containerPromo.appendChild(tr);
   });

   // ajouter un écouteur d'événement sur les boutons d'activation/désactivation
   const boutonsActiver = document.querySelectorAll('.btn-activer');
   boutonsActiver.forEach(bouton => {
      bouton.addEventListener('click', function () {
         const idPromotion = this.dataset.id;
         const promotion = DB.promotions.find(p => p.id_promo === parseInt(idPromotion));

         // désactiver toutes les promotions
         DB.promotions.forEach(p => {
            p.etat = false;
         });

         // activer la promotion sélectionnée
         promotion.etat = true;

         // mettre à jour l'affichage du tableau
         afficherPromotions();
      });
   });
}

afficherPromotions();

