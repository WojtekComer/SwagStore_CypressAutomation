/// <reference types ="Cypress"/>

import burgerMenuItems from "../fixtures/burgerMenu.json";
import { myClassTestDescAndDate } from "./myClassTestDescAndDate";

let loginy = Cypress.env("swagTesting");

describe(
    "\n3.1 'YOUR CART' PAGE - BURGER MENU TEST\n",
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
                    "Cart",
                    menu.menuItem,
                    loginy.username,
                    loginy.password
                );

                cy.get(".shopping_cart_link").should("be.visible").click(); //przejdz do koszyka
                cy.url().should("contain", "/cart.html");

                cy.checkCurrentMenuOption(menu.menuItem); //czy aktualna opcja w petli zgodna z opisem

                if (menu.menuItem != "About") {
                    //z wyjatkiem 'About' bo 'https://saucelabs.com/' sie dlugo laduje i wywala test

                    if (menu.menuItem == "Reset App State") {
                        //czy pamieta stan koszyka - '/cart.html' po ponownym zalogowaniu (poprzedni krok 'Logout')
                        cy.checkAfterMenuLogout("Cart");

                        cy.get(".bm-item-list")
                            .contains("Reset App State")
                            .click(); //resetuje Apke
                        //cy.checkPageReload('Reset App State') // tak zamiast powyzszej ale wiem ze nie odswieza

                        cy.closeMenu();
                        cy.get(".shopping_cart_link").should("be.empty");

                        //DEFEKT - nie odswieza strony po 'Reset App State'.
                        //cy.reload(); //wymusza odswiezenie strony
                        //Po odkomentowaniu powyzszej instrukcji przechodzi test

                        cy.get(".cart_list")
                            .children()
                            .should("have.length", 2); //czy usunal products z koszyka

                        cy.get("#continue-shopping")
                            .should("be.visible")
                            .click(); //powrot do inventory
                        cy.checkIfAddToCartButtonReset("Add to cart", 0);
                    } else {
                        cy.checkMenuOptionActionResult(
                            "Cart",
                            menu.menuItem,
                            menu.action
                        );
                    }
                } else {
                    //jesli opcja: 'About'
                    cy.ifMenuOptionAbout("Cart");
                }
            }
        );
    }
);
