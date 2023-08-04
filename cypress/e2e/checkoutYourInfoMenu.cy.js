/// <reference types ="Cypress"/>

import burgerMenuItems from "../fixtures/burgerMenu.json";
import { myClassTestDescAndDate } from "./myClassTestDescAndDate";

let loginy = Cypress.env("swagTesting");

describe(
    "\n4.1 'CHECKOUT: YOUR INFORMATION' PAGE - BURGER MENU TEST\n",
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
                    "checkoutYourInfo",
                    menu.menuItem,
                    loginy.username,
                    loginy.password
                );

                cy.get(".shopping_cart_link").should("be.visible").click(); //przejdz do koszyka
                cy.url().should("contain", "/cart.html");
                cy.get("#checkout").should("be.visible").click(); //przejdz do checkout-step-one.html
                cy.url().should("contain", "/checkout-step-one.html");

                cy.checkCurrentMenuOption(menu.menuItem); //czy aktualna opcja w petli zgodna z opisem

                if (menu.menuItem != "About") {
                    //z wyjatkiem 'About' bo 'https://saucelabs.com/' sie dlugo laduje i wywala test

                    if (menu.menuItem == "Reset App State") {
                        //czy pamieta stan koszyka w '/checkout-step-one.html' po ponownym zalogowaniu (poprzedni krok 'Logout')
                        cy.checkAfterMenuLogout("checkoutYourInfo");

                        cy.get(".bm-item-list")
                            .contains("Reset App State")
                            .click(); //resetuje Apke
                        //cy.checkPageReload('Reset App State') // tak zamiast powyzszej ale wiem, ze nie odswieza

                        cy.closeMenu();
                        cy.get(".shopping_cart_link").should("be.empty"); //spawdza koszyk w '/checkout-step-one.html'
                        cy.get("#cancel").should("be.visible").click(); //powrot do '/cart.html'

                        cy.get(".shopping_cart_link").should("be.empty"); //spawdza koszyk w '/cart.html'
                        cy.get(".cart_list")
                            .children()
                            .should("have.length", 2); //spawdza '.cart_list' czy elemety usuniete koszyka

                        cy.get("#continue-shopping")
                            .should("be.visible")
                            .click(); //powrot do inventory
                        cy.checkIfAddToCartButtonReset("Add to cart", 0); //czy buttony 'Add to cart' w zresetowane w '/inventory.html'
                    } else {
                        cy.checkMenuOptionActionResult(
                            "checkoutYourInfo",
                            menu.menuItem,
                            menu.action
                        );
                    }
                } else {
                    cy.ifMenuOptionAbout("checkoutYourInfo");
                }
            }
        );
    }
);
