// ==UserScript==
// @name         CercaCustCode
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Controlla il valore della casella e gestisce il tasto Invio
// @author       BySalvatoreMaurici
// @match        https://ttsweb.mipl5.vas.omnitel.it/arsys/apps/ttsno/TTM/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("Script aggiornato avviato");

    // Lista dei cust code speciali e i loro messaggi personalizzati
    const custCodeSpeciali = {
        "7.2535366": "Attenzione! Non chiamare il cliente ed inviare comunicazione ai seguenti indirizzi: spcwifibasilicata@webgenesys.it; a.visciglia@webgenesys.it; n.mastroianni@ecotectelecomunicazioni.it",
        "5.29609": "Attenzione! Se la VPN ID è 28208 NON mandare mail e NON chiamare il ref. Palaia",
        "7.2136337": "Attenzione! Non chiamare cliente. Inviare mail al seguente indirizzo: helpdesk@vigilfuoco.it",
        "4.3501": "In FOB non chiamare il ref.! mandare solo mail agli indirizzi gestore.reti@venis.it; fissa@venis.it; sistemisti@venis; c.manassero@venis.it;",
    };

    // Funzione per mostrare un messaggio di errore
    function mostraErroreNonNumerico(valore) {
        alert("Errore: Il valore \"" + valore + "\" non è un cust code valido! Inserisci un numero con il formato X.XXXXXX.");
    }

    // Funzione per mostrare un messaggio personalizzato
    function mostraMessaggioPersonalizzato(custCode) {
        alert(custCodeSpeciali[custCode]);
    }

    // Funzione per aggiungere il listener al campo
    function aggiungiListenerAlCampo(campo) {
        console.log("Aggiungo listener alla casella:", campo);
        campo.addEventListener("input", function() {
            // Rimuove spazi extra dal valore inserito
            const valoreInserito = campo.value.trim();

            // Controlla se il valore corrisponde al formato desiderato (numerico con punto decimale)
            const formatoValido = /^\d+\.\d+$/.test(valoreInserito);
            if (formatoValido) {
                console.log("Valore valido:", valoreInserito);

                // Controlla se è un cust code speciale
                if (custCodeSpeciali.hasOwnProperty(valoreInserito)) {
                    mostraMessaggioPersonalizzato(valoreInserito);
                }
            } else {
                if (valoreInserito !== "") {
                    console.warn("Valore non valido inserito:", valoreInserito);
                    mostraErroreNonNumerico(valoreInserito);
                }
            }
        });
    }

    // Funzione per osservare dinamicamente il DOM
    function osservaDOM() {
        const observer = new MutationObserver(() => {
            const custCodeField = document.getElementById("arid_WIN_0_600000027");
            if (custCodeField) {
                console.log("Casella trovata:", custCodeField);
                aggiungiListenerAlCampo(custCodeField);
                observer.disconnect(); // Stoppa l'osservazione
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Avvia l'osservatore
    osservaDOM();
})();
