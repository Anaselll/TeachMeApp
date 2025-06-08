import Stripe from "stripe";
import Offer from "../models/offer.model.js";

const stripe = new Stripe(
 process.env.STRIPE
);

export const showCheckoutSession = async (req, res) => {
  const { offer_id, payer } = req.body;

  try {
    const offer = await Offer.findById(offer_id);
    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: offer.price * 100, 
            product_data: {
              name: offer.subject,
            },
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
