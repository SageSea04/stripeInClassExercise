## Stripe In-Class Exercise

This is a simple Express + Stripe project used for an in-class activity.  
Students will install dependencies, run a local server, and make a test payment using Stripe.

## Prerequisites
- Node.js installed
- Stripe test API keys (from https://dashboard.stripe.com/test/apikeys)

## 1) Clone this repository
git clone https://github.com/SageSea04/stripeInClassExercise

## 2) Open the folder in VS Code

## 3) Instal dependencies
npm install

## 4) Create your environment file
cp .env.example .env

Edit `.env` and add your actual secret key:

STRIPE_SECRET_KEY=sk_test_##############

## 5) Start the server
npm start

Server runs at:

http://localhost:3000

## Usage
- Use sidebar to navigate: **Welcome → Select Plan → Make Payment**  
- Choose a plan ($5, $10, $20 or input custom amount) 
- Test cards: `4242 4242 4242 4242`
              `4000 0566 5566 5556`
              `5555 5555 5555 4444`
              `2223 00312 2003 222`
              `6011 0009 9013 9424`
            (any future expiry & 3-digit CVC & ZIP)  
- Any combination of numbers, dates, CVC, & ZIP codes can be used to test failed payments.
- Payment success triggers confetti animation + sound + gif
- Payment failed triggers only sound 

## Optional VS Code Extensions
- ESLint
- Prettier
- Node.js Extension Pack