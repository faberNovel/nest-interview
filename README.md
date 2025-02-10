# nest-interview

## Project overview

In this `nest-interview` repo, our team is using `NestJS` to build a simple server that allows its user to retrieve Pokemon data by providing a Pokemon name.

It was written by our latest trainee, `Jay Paltan`, and is expected to define one single route with the following specifications:
- Route: GET `/api/pokemon`
- Params: 
  - `name`: type `string`, exact English name of a Pokemon
- Response: 
  - ```json
      {
        "id": "string",      // pokemon entry id
        "name": "string",    // pokemon name
        "height": "number",  // pokemon height
        "weight": "number",  // pokemon weight
        "types": "[]string"  // pokemon types (array)
      }
    ```

This route is expected to have the following behaviour:
- `name` should be the exact name of a first-generation Pokemon (id from 1 to 151), and nothing else. If that is not the case, the API should return a 404 error.
- `name` should not be empty. If that is the case, the API should return a 400 error.
- Pokemon data should be retrieved from the [PokeAPI v2](https://pokeapi.co/docs/v2).

In addition, you might also be asked to look at the current authentication logic, but this will be specified by the inverviewer.
- ideally, we want to use a robust and standard authentication method and return a status 401 error if the user is not authenticated.

## Your mission - Part 1: Code review

Unfortunately, it seems that the current state of this repository does not meet our expectations and code quality standards. 

Your mission, should you accept it, will be to help us fix this repository and make it a robust and ready-to-use API:
- have a look at the different layers and try to detect code quality or security issues: controller, service, auth,
- make changes in the code to make E2E tests work, and also check that working E2E tests work as expected.

## Your mission - Part 2: Algorithmics 

Now that we have fixed our repository, let's add a new behaviour to our existing route.

We now want the API to return:
- our Pokemon's stats,
- the average stats for all Pokemons with the same type(s), i.e. which share at least one type with our Pokemon.

- Response: 
  - ```json
      {
        "id": "string",      // pokemon entry id
        "name": "string",    // pokemon name
        "height": "number",  // pokemon height
        "weight": "number",  // pokemon weight
        "types": "[]string", // pokemon types (array)
        "stats": {
          "hp": "string",
          "attack": "string",
          "defense": "string",
          "special_attack": "string",
          "special_defense": "string",
          "speed": "string",
        },
        "same_type_average_stats": {
          "hp": "string",
          "attack": "string",
          "defense": "string",
          "special_attack": "string",
          "special_defense": "string",
          "speed": "string",
        }
      }
    ```

The average stats of Pokemons of same type(s) should be calculated based on the following rules:
- any Pokemon having at least one common type with our Pokemon should be included in the calculation of the average,
- no Pokemon should be counted twice in the calculation of the average.

## Your mission - Part 3: Improvement recommendations

You have now reached the final stage of your mission. 

You now have a good understanding of this workspace's code, and we would like to ask for your guidance to improve it:
- How would you improve this code?
- What are its current weaknesses or vulnerabilities?
- What standards or good practices would you recommend to our team?


