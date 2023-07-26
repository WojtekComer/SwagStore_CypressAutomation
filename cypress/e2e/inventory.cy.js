/// <reference types ="Cypress"/>

import articles from "../fixtures/storeArticles.json";
import burgerMenuItems from "../fixtures/burgerMenu.json";
import selectOptions from "../fixtures/sortMenu.json";
import { myClassTestDescAndDate } from "./myClassTestDescAndDate";

let loginy = Cypress.env("swagTesting");

describe("\n2. INVENTORY (PRODUCTS) PAGE TEST\n", () => {
    it.each(articles)(
        (z, l, t) =>
            myClassTestDescAndDate.testDescription(z, l, t, "testingArticles"),
        (singleArticle) => {
            //test wyswietlania info o produktach na stornie '/inventory.html'
            cy.createSession(loginy.username, loginy.password);
            cy.visit("/inventory.html");

            //sprawdzenie opisow i cen:
            cy.checkInventoryProductDesc(singleArticle);

            //testowanie buttona 'Add to cart' / 'Remove':
            cy.get(".shopping_cart_link").should("be.empty"); //czy koszyk jest pusty na starcie ?
            cy.addOneProductToCart(singleArticle.article, 1); //parametry: co dodac, ile ma byc w koszyku po
            cy.removeOneProductFromCart(singleArticle.article, 0); //parametry:co usunac, ile ma byc w koszyku po
            cy.addOneProductToCart(singleArticle.article, 1); //po usunieciu ponownie dodaje i sprawdzam ilosc w koszyku
        }
    );

    it.each(burgerMenuItems)( (z, l, t) =>
            myClassTestDescAndDate.testDescription(z,l,
                t,
                "testingBurgerMenu"
            ),
        (menu) => {
            cy.createSession(loginy.username, loginy.password);
            cy.visit("/inventory.html");

            cy.get("#react-burger-menu-btn").should("be.visible").click(); //burger menu button widoczny
            cy.get(".bm-item-list").should("be.visible"); //menu musi byc widoczne
            cy.get(".bm-item-list")
                .contains(menu.menuItem)
                .should("have.text", menu.menuItem); //czy zgodne z opisem

            if (menu.menuItem != "About") {
                //z wyjatkiem 'About' bo 'https://saucelabs.com/' sie dlugo laduje i wywala test

                if (menu.menuItem == "All Items") {
                    cy.checkPageReload("All Items");
                } // jak sie sprawdza czy strona sie odswieza ?
                if (menu.menuItem == "Reset App State") {
                    //sprawdzenie dzialania opcji 'Reset App state'

                    cy.addEachProductToCart();
                    cy.checkIfAddToCartButtonReset("Remove", 6);
                    cy.get(".bm-item-list").contains("Reset App State").click(); //resetuje Apke
                    //cy.checkPageReload('Reset App State') //to by bylo zamiast powyzszej instukcji ale wiem, ze nie odswieza
                    cy.get(".bm-cross-button").should("be.visible").click();
                    cy.get(".bm-item-list").should("not.be.visible"); //sprawdzenie czy dziala button 'X' zamykajacy menu
                    //cy.reload() //dla testu funkcji checkIfAddToCartButtonReset() bo jest defekt i nie odswieza strony po 'Reset App State'
                    cy.checkIfAddToCartButtonReset("Add to cart", 0);
                } else {
                    cy.get(".bm-item-list").contains(menu.menuItem).click(); //klika w aktualna opcje zeby sprawdzic przekierowanie
                    cy.url().should("contain", menu.action); //czy dziala przekierowanie ?
                }
            } else {
                cy.get(".bm-item-list")
                    .contains(menu.menuItem)
                    .should("have.attr", "href");
                cy.get(".bm-item-list")
                    .contains(menu.menuItem)
                    .invoke("attr", "href")
                    .should("contain", "https://saucelabs.com/");
            }
        }
    );

    it.each(selectOptions)(
        (z, l, t) =>
            myClassTestDescAndDate.testDescription(z, l, t, "testingSortMenu"),
        (select) => {
            cy.createSession(loginy.username, loginy.password);
            cy.visit("/inventory.html");

            cy.get(".select_container")
                .children()
                .eq(1)
                .select(select.sortType); //wybierz ktore sortowanie
            cy.get(".select_container")
                .should("be.visible")
                .children()
                .eq(0)
                .should("have.text", select.option);
            //sprawdz czy w menu poprwanie wyswietlany typ sortowania np.'Name (A to Z)'

            switch (
                select.sortType //sprawdz poprawne posortowaie artkulow na stronie '/inventory.html'
            ) {
                case "za":
                    cy.checkProductsNamesSorting(select.result);
                    break;
                case "az":
                    cy.checkProductsNamesSorting(select.result);
                    break;
                case "lohi":
                    cy.checkProductsPricesSorting(select.result);
                    break;
                case "hilo":
                    cy.checkProductsPricesSorting(select.result);
                    break;
                default:
                    cy.log("Wrong parameter in 'Switch'");
            }
        }
    );

    it(`Test 1/1 - Check Inventory (Products) page appearance\n${myClassTestDescAndDate.testTimeAndDate()}`, () => {
        cy.createSession(loginy.username, loginy.password);
        cy.visit("/inventory.html");

        cy.checkHeader("Products");
        cy.get(".header_secondary_container")
            .find(".title")
            .siblings()
            .eq(0)
            .should("be.visible"); //sprawdz logo robot w header

        cy.checkFooter();
    });
});
