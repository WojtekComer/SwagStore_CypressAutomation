/// <reference types ="Cypress"/>
import allLoginData from "../fixtures/loginData.json";
import articles from "../fixtures/storeArticles.json";
import burgerMenuItems from "../fixtures/burgerMenu.json";
import selectOptions from "../fixtures/sortMenu.json";
import checkoutForm from "../fixtures/checkoutForm.json";
import { myClassTestDescAndDate } from "./myClassTestDescAndDate";

let loginy = Cypress.env("swagTesting");

describe("\n1. LOGIN PAGE TEST\n", () => {
    it("\n----LOGIN PAGE APPEARANCE TEST----\nNumber of tests: 1\n", () => {});

    it(`Test 1/1 - Check login page appearance.\n${myClassTestDescAndDate.testTimeAndDate()}`, () => {
        //sprawdzenie poprawnosci stony logowania

        cy.visit("/");
        cy.url().should("include", "SwagLabs"); //sprawdzenie url
        cy.location("href").should("contain", "172.16.2.153:8080"); //sprawdzenie location
        cy.get(".login_logo").should("be.visible"); //logo
        cy.get(".bot_column").should("be.visible"); //bot logo

        cy.checkPlaceholder(".login-box", "#user-name", "Username"); //sprawdzenie placeholdera 'Username'
        cy.checkPlaceholder(".login-box", "#password", "Password"); //sprawdzenie placeholdera 'Password'
        cy.get(".form_group").siblings().eq(2).should("exist"); //sprawdzenie istnienia 'error-message-container error'
        cy.get(".login-box")
            .find("#login-button")
            .should("be.visible")
            .should("have.value", "Login"); //login button
    });

    it("\n---LOGIN FUNCTIONALITY TEST---\nNumber of tests: 8\n", () => {});

    it.each(allLoginData)(
        (z, l, t) =>
            myClassTestDescAndDate.testDescription(z, l, t, "testingLogging"),
        (login) => {
            //testy logowania z roznymi opcjami

            cy.myLoginSwagStore(login.user, login.pass);

            if (login.itemcheck == '[data-test="error"]') {
                //w przypadku podania niepoprawnych danych
                cy.get(".error-message-container").should("not.be.empty"); //'error-message-container' dostaje zawartosc obsugujaca blad
                cy.get(login.itemcheck).should("contain", login.expectedResult);
                cy.get(login.itemcheck).children().click(); //po zamknieciu 'error-message-container'
                cy.get(".error-message-container").should("be.empty"); //po zamknieciu 'error-message-container' powinien byc pusty
                //cy.get(login.itemcheck).contains(login.expectedResult).should('be.visible') // wiec to juz nie bedzie widoczne
            }
            if (login.itemcheck == ".inventory_item") {
                // w przypadku poprawnego zalogowania
                cy.url().should("include", "inventory.html"); //sprawdzienie przekierowania do /inventory.html
                cy.get(login.itemcheck)
                    .should("have.length", login.expectedResult)
                    .should("not.be.empty");
            }
            if (login.user == "problem_user") {
                //sprawdzenie obrazka / jpg  dla loginu 'problem_user'
                cy.get(login.itemcheck)
                    .should("be.visible")
                    .should("have.length", 6)
                    .should("have.attr", "src");
            }
        }
    );
});

describe("\n2. INVENTORY (PRODUCTS) PAGE TEST\n", () => {
    it("\n---PRODUCT DESC. & 'ADD TO CART' TEST---\nNumber of tests: 6\n", () => {});

    it.each(articles)(
        (z, l, t) =>
            myClassTestDescAndDate.testDescription(z, l, t, "testingArticles"),
        (singleArticle) => {
            //test wyswietlania info o articleach na stornie /inventory.html
            cy.createSession(loginy.username, loginy.password);
            cy.visit("/inventory.html");

            //sprawdzenie descriptionow i cen:
            cy.checkInventoryProductDesc(singleArticle);

            //testowanie buttona 'Add to cart' / 'Remove':
            cy.get(".shopping_cart_link").should("be.empty"); //czy koszyk jest pusty na starcie ?
            cy.addOneProductToCart(singleArticle.article, 1); //parametry: co dodac, ile ma byc w koszyku po
            cy.removeOneProductFromCart(singleArticle.article, 0); //parametry: skad usunac, co usunac, ile ma byc w koszyku po
            cy.addOneProductToCart(singleArticle.article, 1); //po usunieciu ponownie dodaje i sprawdzam ilosc w koszyku
        }
    );

    it("\n---BURGER MENU TEST---\nNumber of tests: 4\n", () => {});

    it.each(burgerMenuItems)(
        (z, l, t) =>
            myClassTestDescAndDate.testDescription(
                z,
                l,
                t,
                "testingBurgerMenu"
            ),
        (menu) => {
            cy.createSession(loginy.username, loginy.password);
            cy.visit("/inventory.html");

            cy.get("#react-burger-menu-btn").should("be.visible").click(); //burger menu button widoczny
            cy.get(".bm-item-list").should("be.visible"); //menu musi byc widoczne (lub .bm-menu-wrap, aria-hidden = 'true' or 'false')
            cy.get(".bm-item-list")
                .contains(menu.menuItem)
                .should("have.text", menu.menuItem); //czy zgodne z descriptionem

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
                    //cy.get('#react-burger-menu-btn').should('be.visible').click() //burger menu button widoczny
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

    it("\n---PRODUCT SORTING TEST---\nNumber of tests: 4\n", () => {});

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
                select.sortType //sprawdz poprawne posortowaie artukulow na stronie '/inventory.html'
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
                    cy.log("Niepoprawny parametr w 'Switch'");
            }
        }
    );

    it("\n---INVENTORY (PRODUCTS) PAGE APPEARANCE TEST---\nNumber of tests: 1\n", () => {});

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

describe("\n3. 'YOUR CART' PAGE TEST\n", () => {
    it("\n---EMPTY CART TEST---\nNumber of tests: 1\n", () => {});

    it(`Test 1/1 - Checking empty cart.\n${myClassTestDescAndDate.testTimeAndDate()}`, () => {
        cy.createSession(loginy.username, loginy.password);
        cy.visit("/inventory.html");

        cy.url().should("contain", "/inventory.html");
        cy.get(".shopping_cart_link").should("be.empty").click(); // czy koszyk jest pusty na starcie ?

        cy.url().should("contain", "/cart.html");
        cy.get(".shopping_cart_link").should("be.empty");
        cy.checkHeader("Your Cart");
        cy.checkFooter();
        cy.get(".cart_quantity_label").should("have.text", "QTY");
        cy.get(".cart_desc_label").should("have.text", "DESCRIPTION");

        cy.get(".cart_list").children().should("have.length", 2); //brak productow ('.cart_item') w koszyku

        cy.get("#checkout").should("be.visible");
        cy.get("#continue-shopping").should("be.visible").click();
        cy.url().should("contain", "/inventory.html");
    });

    it("\n---'YOUR CART' TEST - ADD / REMOVE ONE BY ONE---\nNumber of tests: 6\n", () => {});

    it.each(articles)(
        (z, l, t) =>
            myClassTestDescAndDate.testDescription(z, l, t, "testingCart"),
        (singleArticle) => {
            cy.createSession(loginy.username, loginy.password);
            cy.visit("/inventory.html");

            cy.get(".shopping_cart_link").should("be.empty"); //koszyk ma byc pusty
            cy.addOneProductToCart(singleArticle.article, 1); //dodaj product
            cy.get(".shopping_cart_link").should("be.visible").click(); //przejdz do koszyka

            cy.url().should("contain", "/cart.html");
            cy.get(".shopping_cart_link")
                .should("not.be.empty")
                .children()
                .should("have.text", 1);
            cy.get(".cart_list").children().should("have.length", 3); // -> (2 zawsze) + 1 = jest 1 product '.cart_item' w koszyku

            cy.checkCartProductDesc(singleArticle); //testowanie descriptionow, ilosci i cen w koszyku

            cy.get(".cart_list")
                .contains("div", singleArticle.article)
                .parent()
                .siblings()
                .eq(1)
                .children()
                .eq(1)
                .should("contain", "Remove")
                .click(); //usun z koszyka
            cy.get(".cart_list")
                .children()
                .should("have.length", 3)
                .eq(2)
                .should("have.class", "removed_cart_item");
            cy.get(".shopping_cart_link").should("be.empty"); //koszyk ma byc pusty
            cy.get("#continue-shopping").should("be.visible").click(); //powrot do inventory

            cy.url().should("contain", "/inventory.html");
            cy.get(".shopping_cart_link").should("be.empty"); //koszyk ma byc pusty
            cy.get(".inventory_list")
                .contains(singleArticle.article)
                .parent()
                .siblings()
                .children()
                .eq(1)
                .should("contain", "Add to cart"); //button add to cart ma byc zresetowany
        }
    );

    it("\n---'YOUR CART' TEST - ADD/REMOVE ALL PRODUCTS---\nNumber of tests: 1\n", () => {});

    it(`Test 1/1 - Add / Remove all produts in cart.\n${myClassTestDescAndDate.testTimeAndDate()}`, () => {
        cy.createSession(loginy.username, loginy.password);
        cy.visit("/inventory.html");

        cy.addEachProductToCart(); //dodaj wszystkie
        cy.get(".shopping_cart_link").should("be.visible").click(); //przejdz do koszyka

        cy.url().should("contain", "/cart.html");
        cy.get(".shopping_cart_link")
            .should("not.be.empty")
            .children()
            .should("have.text", 6);
        cy.get(".cart_list").children().should("have.length", 8); // -> (2 zawsze) + 6 = jest 6 productow '.cart_item' w koszyku

        let counter = 0;
        cy.fixture("storeArticles").then((products) => {
            products.forEach((product) => {
                cy.checkCartProductDesc(product); //testowanie descriptionow ilosci i cen w koszyku
                cy.get(".cart_list")
                    .contains("div", product.article)
                    .parent()
                    .siblings()
                    .eq(1)
                    .children()
                    .eq(1)
                    .should("contain", "Remove")
                    .click(); //usun z koszyka
                cy.get(".cart_list")
                    .children()
                    .should("have.length", 8)
                    .eq(2 + counter)
                    .should("have.class", "removed_cart_item");
                counter = counter + 1;
                if (counter == 6) {
                    cy.get(".shopping_cart_link").should("be.empty");
                } else {
                    cy.get(".shopping_cart_link")
                        .should("not.be.empty")
                        .children()
                        .should("have.text", 6 - counter);
                }
            });
        });

        cy.get("#continue-shopping").should("be.visible").click(); //powrot do inventory
        cy.checkIfAddToCartButtonReset("Add to cart", 0); //czy 'usun z koszyka' (linia 238 ) ma efekt na buttony w '/inventory.html'
    });
});

describe(
    "\n3.1 'YOUR CART' PAGE - BURGER MENU TEST\n",
    { testIsolation: false },
    () => {
        it("\n---'YOUR CART' TEST - BURGER MENU---\nNumber of tests: 4\n", () => {
            cy.myLoginSwagStore(loginy.username, loginy.password);
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
                cy.get("#react-burger-menu-btn").should("be.visible").click(); //burger menu button widoczny
                cy.get(".bm-item-list").should("be.visible"); //menu musi byc widoczne (lub .bm-menu-wrap, aria-hidden = 'true' or 'false')
                cy.get(".bm-item-list")
                    .contains(menu.menuItem)
                    .should("have.text", menu.menuItem); //czy zgodne z descriptionem

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
                        //cy.reload() //dla testu czy usuwa products z koszyka bo jest defekt i nie odswieza strony po 'Reset App State'
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
                    cy.get(".shopping_cart_link")
                        .should("not.be.empty")
                        .children()
                        .should("have.text", 6); //spawdza stan koszyka na '/cart.html'
                    cy.get(".cart_list").children().should("have.length", 8);
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

describe("\n4. 'CHECKOUT: YOUR INFORMATION' PAGE TEST\n", () => {
    it("\n---'CHECKOUT: YOUR INFORMATION' PAGE APPEARANCE TEST---\nNumber of tests: 1\n", () => {});

    it(`Test 1/1 - \'CHECKOUT: YOUR INFORMATION\' appearance test.\n${myClassTestDescAndDate.testTimeAndDate()}`, () => {
        cy.createSession(loginy.username, loginy.password);
        cy.visit("/inventory.html");

        cy.get(".shopping_cart_link").should("be.visible").click(); //przejdz do koszyka
        cy.url().should("contain", "/cart.html");
        cy.get("#checkout").should("be.visible").click(); //przejdz do checkout-step-one.html

        cy.url().should("contain", "/checkout-step-one.html");
        cy.get(".shopping_cart_link").should("be.empty");
        cy.checkHeader("Checkout: Your Information");
        cy.checkFooter();

        cy.checkPlaceholder(".checkout_info", "#first-name", "First Name");
        cy.checkPlaceholder(".checkout_info", "#last-name", "Last Name");
        cy.checkPlaceholder(
            ".checkout_info",
            "#postal-code",
            "Zip/Postal Code"
        );
        cy.get(".checkout_info").children().eq(3).should("exist"); // '.error-message-container'
        cy.get(".error-message-container").should("be.empty"); // '.error-message-container'
        cy.get("#continue").should("be.visible");
        cy.get("#cancel").should("be.visible").click();
        cy.url().should("contain", "/cart.html");
    });

    it("\n---'CHECKOUT: YOUR INFORMATION' FORM TEST---\nNumber of tests: 4\n", () => {});

    it.each(checkoutForm)(
        (z, l, t) =>
            myClassTestDescAndDate.testDescription(
                z,
                l,
                t,
                "testingCheckoutForm"
            ),
        (formularz) => {
            //testy logowania z roznymi opcjami

            cy.createSession(loginy.username, loginy.password);
            cy.visit("/inventory.html");

            cy.get(".shopping_cart_link").should("be.visible").click(); //przejdz do koszyka
            cy.url().should("contain", "/cart.html");
            cy.get("#checkout").should("be.visible").click(); //przejdz do checkout-step-one.html
            cy.url().should("contain", "/checkout-step-one.html");
            //cy.get('.shopping_cart_link').should('be.empty')

            cy.get(".checkout_info").find("#first-name").type(formularz.name);
            cy.get(".checkout_info").find("#last-name").type(formularz.surname);
            cy.get(".checkout_info")
                .find("#postal-code")
                .type(formularz.postalCode);
            cy.get("#continue").should("be.visible").click();

            if (formularz.itemcheck == '[data-test="error"]') {
                //w przypadku podania niepoprawnych danych
                cy.get(".error-message-container").should("not.be.empty"); //'error-message-container' dostaje zawartosc obsugujaca blad
                cy.get(formularz.itemcheck).should("contain", formularz.result);
                cy.get(formularz.itemcheck).children().click(); //po zamknieciu 'error-message-container'
                cy.get(".error-message-container").should("be.empty"); //po zamknieciu 'error-message-container' powinien byc pusty
                //cy.get(login.itemcheck).contains(login.expectedResult).should('be.visible') // wiec to juz nie bedzie widoczne
            } else {
                cy.url().should("contain", "/checkout-step-two.html");
            }
        }
    );
});

describe(
    "\n4.1 'CHECKOUT: YOUR INFORMATION' PAGE - BURGER MENU TEST\n",
    { testIsolation: false },
    () => {
        it("\n---'CHECKOUT: YOUR INFORMATION' TEST - BURGER MENU---\nNumber of tests: 4\n", () => {
            cy.myLoginSwagStore(loginy.username, loginy.password);
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
                cy.url().should("contain", "/checkout-step-one.html");

                cy.get("#react-burger-menu-btn").should("be.visible").click(); //burger menu button widoczny
                cy.get(".bm-item-list").should("be.visible"); //menu musi byc widoczne (lub .bm-menu-wrap, aria-hidden = 'true' or 'false')
                cy.get(".bm-item-list")
                    .contains(menu.menuItem)
                    .should("have.text", menu.menuItem); //czy zgodne z descriptionem

                if (menu.menuItem != "About") {
                    //z wyjatkiem 'About' bo 'https://saucelabs.com/' sie dlugo laduje i wywala test

                    if (menu.menuItem == "Reset App State") {
                        //sprawdzenie dzialania opcji 'Reset App state'

                        //czy pamieta stan koszyka w '/checkout-step-one.html' po ponownym zalogowaniu (poprzedni krok 'Logout')
                        cy.get(".shopping_cart_link")
                            .should("not.be.empty")
                            .children()
                            .should("have.text", 6);

                        cy.get(".bm-item-list")
                            .contains("Reset App State")
                            .click(); //resetuje Apke
                        //cy.checkPageReload('Reset App State') // tak zamiast powyzszej ale wiem, ze nie odswieza
                        //cy.get('#react-burger-menu-btn').should('be.visible').click() //burger menu button widoczny
                        cy.get(".bm-cross-button").should("be.visible").click();
                        cy.get(".bm-item-list").should("not.be.visible"); //sprawdzenie czy dziala button 'X' zamykajacy menu

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
                        cy.get(".bm-item-list").contains(menu.menuItem).click(); //klika w aktualna opcje zeby sprawdzic przekierowanie
                        cy.url().should("contain", menu.action); //czy dziala przekierowanie ?
                        if (menu.menuItem == "All Items") {
                            cy.addEachProductToCart(); //w pierwszym kroku dodaj wszystkie products do koszyka
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
