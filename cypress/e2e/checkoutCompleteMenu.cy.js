/// <reference types ="Cypress"/>

import burgerMenuItems from "../fixtures/burgerMenu.json";
import { myClassTestDescAndDate } from "./myClassTestDescAndDate";

let loginy = Cypress.env("swagTesting");
let checkoutDetails = Cypress.env("checkoutInfo");

describe(
    "\n6.1 'CHECKOUT: COMPLETE' PAGE - BURGER MENU TEST\n",
    { testIsolation: false },
    () => {
        before("Login - Reset App State - Logout", () => {
            cy.resetAppState(loginy.username, loginy.password);
        });

        it.each(burgerMenuItems)(
            (z, l, t) =>
                myClassTestDescAndDate.testDescription(
                    z,
                    l,
                    t,
                    "testingBurgerMenu"
                ),
            (menu) => {
                if (menu.menuItem == "All Items") {
                    cy.myLoginSwagStore(loginy.username, loginy.password); //loguj
                }
                if (menu.menuItem == "Reset App State") {
                    // po poprzednim kroku 'Logout'
                    cy.myLoginSwagStore(loginy.username, loginy.password); //loguj
                    cy.checkIfAddToCartButtonReset("Add to cart", 0); //!!! tu w zaleznosci od parametrow 0 lub 6!
                    //albo albo tylko sprawdzic cyfre w koszyku na /inventory.html'
                }
                if (menu.menuItem == "Logout") {
                    cy.visit("/inventory.html");
                } //tylko opja 'Logout' tego wymaga

                cy.get(".shopping_cart_link").should("be.visible").click(); //przejdz do koszyka
                cy.url().should("contain", "/cart.html");
                cy.get("#checkout").should("be.visible").click(); //przejdz do checkout-step-one.html
                cy.fillInCheckoutForm(
                    //zrob checkout i przejdz do checkout:Overview
                    checkoutDetails.firstName,
                    checkoutDetails.lastName,
                    checkoutDetails.postCode
                );
                cy.url().should("contain", "/checkout-step-two.html"); //zrobic tu funcjke checkCurrentMenuOption(option)
                cy.get("#finish").should("be.visible").click();
                cy.url().should("contain", "/checkout-complete.html"); //przejdz do 'checkout: Complete!'

                cy.checkCurrentMenuOption(menu.menuItem); //czy aktualna opcja w petli zgodna z opisem

                if (menu.menuItem != "About") {
                    //z wyjatkiem 'About' bo 'https://saucelabs.com/' sie dlugo laduje i wywala test

                    if (menu.menuItem == "Reset App State") {
                        cy.get(".shopping_cart_link").should("be.empty");
                        cy.get(".bm-item-list")
                            .contains("Reset App State")
                            .click(); //resetuje Apke
                        //cy.checkPageReload('Reset App State') // tak zamiast powyzszej ale wiem, ze nie odswieza
                        //cy.get('#react-burger-menu-btn').should('be.visible').click() //burger menu button widoczny
                        cy.get(".bm-cross-button").should("be.visible").click();
                        cy.get(".bm-item-list").should("not.be.visible"); //sprawdzenie czy dziala button 'X' zamykajacy menu

                        //DEFEKT - nie odswieza strony po 'Reset App State'.
                        //cy.reload(); //wymusza odswiezenie strony
                        //Po odkomentowaniu powyzszej instrukcji przechodzi test
                    } else {
                        cy.checkMenuOptionActionResult(
                            "Complete",
                            menu.menuItem,
                            menu.action
                        );
                    }
                } else {
                    cy.ifMenuOptionAbout("Complete");
                }
            }
        );
    }
);
