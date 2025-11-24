## Stripe In-Class Exercise

This is a simple Express + Stripe project used for an in-class activity.  
Students will install dependencies, run a local server, and make a test payment using Stripe.

## Prerequisites
- Node.js installed
- Stripe test API keys (from https://dashboard.stripe.com/test/apikeys)

## 1) Clone this repository
git clone <your-repo-url>

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
- Choose a plan ($5, $10, $20) 
- Test cards: `4242 4242 4242 4242` (any future expiry & 3-digit CVC & ZIP)  
- Payment success triggers confetti animation + optional sound/gif

