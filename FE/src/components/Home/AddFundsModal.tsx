import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

interface AddFundsModalProps {
  onClose: () => void;
}

const AddFundsModal: React.FC<AddFundsModalProps> = ({ onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState<number | null>(null);
  const [formattedAmount, setFormattedAmount] = useState<string>("");

  const formatNumberWithCommas = (value: string) => {
    // Remove non-digit characters
    const numericValue = value.replace(/[^0-9]/g, "");
    const number = parseInt(numericValue, 10);
    return isNaN(number) ? "" : number.toLocaleString();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormattedAmount(formatNumberWithCommas(value));
    const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10);
    setAmount(isNaN(numericValue) ? null : numericValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || amount === null) return;

    const cardElement = elements.getElement(CardElement);

    if (cardElement) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (!error) {
        console.log("Payment successful!", paymentMethod);
        // Handle the transaction and update the wallet balance.

        onClose();
      } else {
        console.error("Payment error:", error.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75 z-50 transition-transform transform duration-300 scale-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Add Funds to Wallet</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Amount</label>
            <input
              type="text"
              className="border px-4 py-2 w-full"
              value={formattedAmount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Card Details</label>
            <CardElement className="border p-3 rounded-md" />
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="button"
              className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={!stripe}
            >
              Add Funds
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFundsModal;
