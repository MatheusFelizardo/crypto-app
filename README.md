# Crypto app
This app was created to display the cryptocurrency status using the alphavantage API.

![](/public/crypto-app-gif.gif)
Deploy: https://crypto-app-delta-six.vercel.app/

### Techs
- Next/React
- Typescript
- Tailwind
- CharJS

### Development idea
1. I started understanding the API data. I'm more used to manipulate array than the objects directly. So I created a parser for the data to transform the object in an array. I also created a python script to easily convert the csv available in alphavantage with the currencies to a JSON.
2. Then I started to think the app idea. For the time I had, I decided to create a most popular currency, a converter and a chart.
3. For most popular currencies section, I created a hard code "POPULAR_CURRENCIES" with some cryptocurrencies information that could be replaced for a database data the future.
4. For the converter, I used a double check because for some currencies the API doesn't give the convertion, for example, getting the rate from USD to BTC. So I created a double check, to when the app doesn't receive the values, it can try the reverse call, like from BTC to USD and to the reverse operation.
5. For the chart, in the begginning I tried to use a candlestick chart but I couldn't find a easy solution to implement, so I realized that a line chart would be good too. I tried to implement a zoom for the daily chart but I faced some bugs that I couldn't fix quickly.

### What I would improve if I had more time
1. Input validations. For the search, currency convertes and the list
2. Tests. I would implement some tests to simulate the responses and inputs and as I have some response mocks that I used because of the API limit (25 requests) it would be easier.
3. Layout. It's not my strenght draw the UI from skretch but maybe if I had more time I would think more about this.


### Running
1. npm install or yarn install
2. npm run dev or yarn dev

