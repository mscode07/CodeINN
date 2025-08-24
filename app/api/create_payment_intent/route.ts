import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
    apiVersion: "2025-07-30.basil",
    })

    export async function POST(req:NextRequest){        
      const {amount}= await req.json();
      try{
        console.log("Reaching here");
        if (!amount || isNaN(amount)) {
          return NextResponse.json(
            { error: "Invalid amount" },
            { status: 400 }
          );
        }
        console.log("Amount:-", amount);
        
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Number(amount)*100,
          currency: "usd",
          automatic_payment_methods: {
            enabled: true,
          },
        })
        console.log("Payment Intent:-", paymentIntent);
        return NextResponse.json({clientSecret: paymentIntent.client_secret}  , {status: 200})  
      }catch(error){
        console.error("Error creating payment intent:", error);
        return NextResponse.json({error: "Failed to create payment intent"}, {status: 400})
      }
    }