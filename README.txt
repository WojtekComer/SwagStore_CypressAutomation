1. GENERAL INFO

SwagStore_CypressAutomation is a test automation project created in Cypress.

Purpose of this end-to-end test automation was to learn, develope and present my basic JS and Cypress automation skills to whom it may concern.

The subject of test is a simple training web application 'SwagStore' located at http://172.16.2.153:8080/SwagLabs/#/.

'SwagStore' emulates a basic online shop with 'login', 'add to / remove from  cart' and 'checkout' functionalities.

There is also 'burger menu' and 'sorting' options available for testing.


2. TESTING APPROACH

This automation project is mainly focused on key functionalities as typical features of this type of applications 

rather than exploiting every single aspect of testing. Usability defects and busisness logic are not considered unless affecting main functionalities.

Main focus was to design and create scenarios covering the majority of available features and items in order to learn and improve my programming skills.


3. TEST SCENARIOS

There is a 'SwagStore_TestScenarios.pdf' file included in this repo covering test scenarios for each tested page.

In some cases more detailed steps are described for better understending on what's going on in particular tests.

However, please note those are not formal test cases with all required elements such as preconditions, steps and expected result.

My only intention was to clearly explain the testing logic and give better reference to the code itself.


4. DEFECTS

As 'SwagStore' is just a training aplication, there are some intentional defects introduced by the authors.

This test automation detects those defects and it fails, therefore execution may be interrupted on some accasions.

In most cases there is a work around to make the test pass. Reason for that is to make the test run untill the end to see its

execution throughout all planned items and functionalities.


E.g. 

DEFECT: 

After selecting 'Reset App State' option in 'burger menu' on 'Inventory' page, the page is not refreshered/reloaded.

That results in 'ADD TO CART/REMOVE' button not being reset.


WORK AROUND:

Uncomment below instruction in code to force page reload:

//cy.reload()


All cases like this one are clearly indicated in the code in comments.

You may apply workarounds one by one to make all tests pass and run till their end. 


5. ANALYSIS

Best way to analize this end-to-end automation seems to be going through all consecutive assertions in test runner

after tests execution and follow their results. 


 
  



  