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
            cy.myLoginSwagStore(loginy.username, loginy.password); //loguj
            cy.get("#react-burger-menu-btn").should("be.visible").click();
            cy.get(".bm-item-list").contains("Reset App State").click();
            cy.get(".bm-item-list").contains("Logout").click();
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
                cy.get("#checkout").should("be.visible").click(); //przejdz do checkout-step-one.html
                cy.fillInCheckoutForm(
                    //zrob checkout i przejdz do checkout:Overview
                    checkoutDetails.firstName,
                    checkoutDetails.lastName,
                    checkoutDetails.postCode
                );
                cy.url().should("contain", "/checkout-step-two.html");
                cy.get("#react-burger-menu-btn").should("be.visible").click(); //burger menu button widoczny
                cy.get(".bm-item-list").should("be.visible"); //menu musi byc widoczne
                cy.get(".bm-item-list")
                    .contains(menu.menuItem)
                    .should("have.text", menu.menuItem); //czy zgodne z opisem

                if (menu.menuItem != "About") {
                    //z wyjatkiem 'About' bo 'https://saucelabs.com/' sie dlugo laduje i wywala test

                    if (menu.menuItem == "Reset App State") {
                        //czy pamieta stan koszyka w '/checkout-step-two.html' po ponownym zalogowaniu (poprzedni krok 'Logout')
                        cy.get(".shopping_cart_link")
                            .should("not.be.empty")
                            .children()
                            .should("have.text", 6); //cyfra z iloscia w ikonie koszyka
                        cy.get(".cart_list")
                            .children()
                            .should("have.length", 8); //ilosc w koszyku
                        cy.fixture("storeArticles").then((products) => {
                            //opisy produktow
                            products.forEach((product) => {
                                cy.checkCartProductDesc(product);
                            });
                        });

                        cy.get(".bm-item-list")
                            .contains("Reset App State")
                            .click(); //resetuje Apke
                        //cy.checkPageReload('Reset App State') // tak zamiast powyzszej ale wiem, ze nie odswieza
                        //cy.get('#react-burger-menu-btn').should('be.visible').click() //burger menu button widoczny
                        cy.get(".bm-cross-button").should("be.visible").click();
                        cy.get(".bm-item-list").should("not.be.visible"); //sprawdzenie czy dziala button 'X' zamykajacy menu

                        cy.get(".shopping_cart_link").should("be.empty"); //spawdza koszyk w '/checkout-step-two.html'

                        //DEFEKT - nie odswieza strony po 'Reset App State'.
                        //cy.reload(); //wymusza odswiezenie strony
                        //Po odkomentowaniu powyzszej instrukcji przechodzi test

                        cy.get(".cart_list")
                            .children()
                            .should("have.length", 2); //spawdza '.cart_list' czy elemety usuniete koszyka

                        cy.get("#cancel").should("be.visible").click(); //powrot do inventory

                        //DEFEKT - powyzsze powinno przekierowac do /cart.html i dopiero pozniej
                        //cy.get("#continue-shopping").should("be.visible").click(); //powrot do inventory

                        cy.checkIfAddToCartButtonReset("Add to cart", 0); //czy buttony 'Add to cart' w zresetowane w '/inventory.html'
                    } else {
                        cy.get(".bm-item-list").contains(menu.menuItem).click(); //klika w aktualna opcje zeby sprawdzic przekierowanie
                        cy.url().should("contain", menu.action); //czy dziala przekierowanie ?
                        if (menu.menuItem == "All Items") {
                            cy.addEachProductToCart(); //w pierwszym kroku dodaj wszystkie produkty do koszyka
                        }
                    }
                } else {
                    //jesli opcja: 'About'
                    cy.get(".shopping_cart_link")
                        .should("not.be.empty")
                        .children()
                        .should("have.text", 6); //spawdza koszyk w '/checkout-step-one.html'
                    cy.get(".bm-item-list")
                        .contains(menu.menuItem)
                        .should("have.attr", "href"); //sprawdza link dla opcji 'About'
                    cy.get(".bm-item-list")
                        .contains(menu.menuItem)
                        .invoke("attr", "href")
                        .should("contain", "https://saucelabs.com/");
                }
            }
        );
    }
);
