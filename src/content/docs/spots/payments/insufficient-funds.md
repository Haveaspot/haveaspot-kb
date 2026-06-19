---
title: "What Happens If My Stripe Account Has Insufficient Funds for a Refund?"
description: "What occurs when a required refund exceeds the balance in your Stripe account."
sidebar:
  order: 5
---

There are situations where a refund must be issued to a Booker — for example, following a cancellation — but your Stripe Connect Account may not have enough funds to cover it. Understanding what happens in this scenario can help you avoid complications.

## Why might my balance be insufficient?

Your Stripe balance reflects the funds that have been received but not yet paid out to your bank account. If a refund is due but your Stripe balance is lower than the refund amount, Stripe cannot automatically process the refund from your balance alone.

This can happen when:

- A booking is cancelled shortly after payment, before a payout has been processed
- A chargeback is raised for an amount greater than your current balance
- You have issued multiple refunds in a short period

## What happens next

If your Stripe account does not have sufficient funds to cover a required refund or chargeback:

- **Stripe may debit your linked bank account** directly to cover the shortfall. This depends on your Stripe account configuration.
- **Haveaspot's right of set-off** applies — if you owe funds related to a refund or chargeback, Haveaspot can deduct those amounts from **future payouts** made to your account.

This means that even if an immediate refund cannot be processed from your Stripe balance, you remain liable for the full amount owed. It will not simply be written off.

## How to minimise the risk

- Keep an eye on your Stripe balance, particularly if you have upcoming bookings that could be cancelled
- Ensure your Stripe account is linked to an active bank account that can cover potential shortfalls
- Familiarise yourself with the [Cancellation Policy](/spots/cancellations/cancellation-policy/) so you can anticipate when refunds may be due

## Need help?

If you are facing a situation where a refund cannot be processed, contact Stripe support for guidance on your account balance, and reach out to Haveaspot at support@haveaspot.com if the issue relates to your obligations under a booking.
