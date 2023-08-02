/// <reference types ="Cypress"/>

import articles from "../fixtures/storeArticles.json";
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
