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
                if (menu.menuItem == "All Items") {
                    cy.myLoginSwagStore(loginy.username, loginy.password); //loguj
                }
                if (menu.menuItem == "Reset App State") {
                    // po poprzednim kroku 'Logout'
                    cy.myLoginSwagStore(loginy.username, loginy.password); //loguj
                    cy.checkIfAddToCartButtonReset("Remove", 6); //czy pamieta stan koszyka i buttonow po poprzednim kroku 'Logout'
                }
                if (menu.menuItem == "Logout") {
                    cy.visit("/inventory.html");
                } //tylko opja 'Logout' tego wymaga

                cy.get(".shopping_cart_link").should("be.visible").click(); //przejdz do koszyka
                cy.url().should("contain", "/cart.html");

                cy.checkCurrentMenuOption(menu.menuItem); //czy aktualna opcja w petli zgodna z opisem

                if (menu.menuItem != "About") {
                    //z wyjatkiem 'About' bo 'https://saucelabs.com/' sie dlugo laduje i wywala test

                    if (menu.menuItem == "Reset App State") {
                        //sprawdzenie dzialania opcji 'Reset App state'

                        //czy pamieta stan koszyka - '/cart.html' po ponownym zalogowaniu (poprzedni krok 'Logout')
                        cy.get(".shopping_cart_link")
                            .should("not.be.empty")
                            .children()
                            .should("have.text", 6);
                        cy.get(".cart_list")
                            .children()
                            .should("have.length", 8);
                        cy.fixture("storeArticles").then((products) => {
                            products.forEach((product) => {
                                cy.checkCartProductDesc(product);
                            });
                        });

                        cy.get(".bm-item-list")
                            .contains("Reset App State")
                            .click(); //resetuje Apke
                        //cy.checkPageReload('Reset App State') // tak zamiast powyzszej ale wiem ze nie odswieza
                        //cy.get('#react-burger-menu-btn').should('be.visible').click() //burger menu button widoczny
                        cy.get(".bm-cross-button").should("be.visible").click();
                        cy.get(".bm-item-list").should("not.be.visible"); //sprawdzenie czy dziala button 'X' zamykajacy menu

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
                        cy.get(".bm-item-list").contains(menu.menuItem).click(); //klika w aktualna opcje zeby sprawdzic przekierowanie
                        cy.url().should("contain", menu.action); //czy dziala przekierowanie ?
                        if (menu.menuItem == "All Items") {
                            cy.addEachProductToCart(); //w pierwszym kroku dodaj wszystkie products do koszyka
                        }
                    }
                } else {
                    //jesli opcja: 'About'
                    cy.ifMenuOptionAbout("Cart");
                }
            }
        );
    }
);
