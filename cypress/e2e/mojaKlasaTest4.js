export const mojaKlasaTest4 = {

    dataTestu: new Date(), //aktualny czas

    czasTestu () {  //funkcja tworzaca aktualny czas i date testu
        return `Test executed - Time:  ${this.dataTestu.getHours()} : ${this.dataTestu.getMinutes()} ,  Date:  ${this.dataTestu.getDate()} -${this.dataTestu.getMonth() + 1} -${this.dataTestu.getFullYear()}`
    },

    testDescription (zmienna, licznik, tablica, wersja) {  //funkcja tworzaca opisy testow

        switch(wersja){
    
            case 'testyBurgerMenu':
                return `Test ${licznik+1} / ${tablica.length} - Testing burger menu option: ${zmienna.menuItem}
                ${this.czasTestu()}`;
                break;
            case 'testyArtukulow':
                return `Test ${licznik+1} / ${tablica.length} - Testing: ${zmienna.artykul}
                ${this.czasTestu()}`;
                break;
            case 'testyLogowania':
                return `Test ${licznik+1} / ${tablica.length} - ${zmienna.opisTestu}
                ${this.czasTestu()}`;
                break;
            case 'sortMenu':
                return `Test ${licznik+1} / ${tablica.length} - Testing sorting option: ${zmienna.option}
                ${this.czasTestu()}`;
                break;
            case 'testyCartPojedynczo':
                return `Test ${licznik+1} / ${tablica.length} - Add to / Remove from cart: 
                ${zmienna.artykul}
                ${this.czasTestu()}`;
                break;
            case 'checkoutFormTest':
                return `Test ${licznik+1} / ${tablica.length} - 'CHECKOUT' with ${zmienna.opisTestu}
                ${this.czasTestu()}`;
                break;

            default: cy.log("Niepoprawny parametr w funcji 'Switch'")

        }
    }

}