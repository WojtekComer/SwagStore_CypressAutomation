export const myClassTestDescAndDate = {
    testDate: new Date(), //aktualny czas

    testTimeAndDate() {
        //funkcja tworzaca aktualny czas i date testu
        return `Test executed - Time:  ${this.testDate.getHours()} : ${this.testDate.getMinutes()} ,  Date:  ${this.testDate.getDate()} -${
            this.testDate.getMonth() + 1
        } -${this.testDate.getFullYear()}`;
    },

    testDescription(tabElement, counter, tab, version) {
        //funkcja tworzaca opisy testow

        switch (version) {
            case "testingBurgerMenu":
                return `Test ${counter + 1} / ${
                    tab.length
                } - Testing burger menu option: ${tabElement.menuItem}
                ${this.testTimeAndDate()}`;
                break;
            case "testingArticles":
                return `Test ${counter + 1} / ${tab.length} - Testing: ${
                    tabElement.article
                }
                ${this.testTimeAndDate()}`;
                break;
            case "testingLogging":
                return `Test ${counter + 1} / ${tab.length} - ${
                    tabElement.testDescription
                }
                ${this.testTimeAndDate()}`;
                break;
            case "testingSortMenu":
                return `Test ${counter + 1} / ${
                    tab.length
                } - Testing sorting option: ${tabElement.option}
                ${this.testTimeAndDate()}`;
                break;
            case "testingCart":
                return `Test ${counter + 1} / ${
                    tab.length
                } - Add to / Remove from cart: 
                ${tabElement.article}
                ${this.testTimeAndDate()}`;
                break;
            case "testingCheckoutForm":
                return `Test ${counter + 1} / ${tab.length} - 'CHECKOUT' with ${
                    tabElement.testDescription
                }
                ${this.testTimeAndDate()}`;
                break;

            default:
                cy.log("Wrong parameter in 'Switch'");
        }
    }
};
