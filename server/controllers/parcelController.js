// ... existing code ...
// Create payment record
const payment = await Payment.create({
  parcel: savedParcel._id,
  user: req.user._id,
  amount: savedParcel.cost,
  method: paymentMethod || "cash_on_delivery",
  status: "pending",
  collectedBy: null,
});

// Add payment reference to parcel
savedParcel.payment = payment._id;
await savedParcel.save();
// ... existing code ...
