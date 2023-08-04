/// <reference types ="Cypress"/>

import burgerMenuItems from "../fixtures/burgerMenu.json";
import { myClassTestDescAndDate } from "./myClassTestDescAndDate";

let loginy = Cypress.env("swagTesting");
let checkoutDetails = Cypress.env("checkoutInfo");

describe(
    "\n5.1 'CHECKOUT: OVERVIEW' PAGE - BURGER MENU TEST\n",
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
                cy.doIfMenuOptionIs(
                    "checkoutOverview",
                    menu.menuItem,
                    loginy.username,
                    loginy.password
                );

                cy.get(".shopping_cart_link").should("be.visible").click(); //przejdz do koszyka
                cy.url().should("contain", "/cart.html");
                cy.get("#checkout").should("be.visible").click(); //przejdz do checkout-step-one.html
                cy.fillInCheckoutForm(
                    //zrob checkout i przejdz do checkout:Overview
                    checkoutDetails.firstName,
                    checkoutDetails.lastName,
                    checkoutDetails.postCode
                );
                cy.url().should("contain", "/checkout-step-two.html");

                cy.checkCurrentMenuOption(menu.menuItem); //czy aktualna opcja w petli zgodna z opisem

                if (menu.menuItem != "About") {
                    //z wyjatkiem 'About' bo 'https://saucelabs.com/' sie dlugo laduje i wywala test

                    if (menu.menuItem == "Reset App State") {
                        //czy pamieta stan koszyka w '/checkout-step-two.html' po ponownym zalogowaniu (poprzedni krok 'Logout')
                        cy.checkAfterMenuLogout("checkoutOverview");

                        cy.get(".bm-item-list")
                            .contains("Reset App State")
                            .click(); //resetuje Apke
                        //cy.checkPageReload('Reset App State') // tak zamiast powyzszej ale wiem, ze nie odswieza

                        cy.closeMenu();

                        // //DEFEKT - nie odswieza strony po 'Reset App State'.
                        //cy.reload(); //wymusza odswiezenie strony
                        //Po odkomentowaniu powyzszej instrukcji przechodzi test

                        // cy.get("#cancel").should("be.visible").click(); //powrot do inventory
                        //DEFEKT - powyzsze powinno przekierowac do /cart.html i dopiero pozniej
                        //cy.get("#continue-shopping").should("be.visible").click(); //powrot do inventory

                        cy.checkAfterResetApp("checkoutOverview");
                    } else {
                        cy.checkMenuOptionActionResult(
                            "checkoutOverview",
                            menu.menuItem,
                            menu.action
                        );
                    }
                } else {
                    cy.ifMenuOptionAbout("checkoutOverview");
                }
            }
        );
    }
);
