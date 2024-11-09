import React, { useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useStripePaymentMutation } from "../../apis/restfulApi";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useUpdateWalletBalanceMutation } from "../../apis/graphqlApi";
import { notification } from "antd";

interface AddFundsModalProps {
  onClose: () => void;
  refetch: () => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
    valid: {
      color: "#54ff24",
    },
  },
};

const AddFundsModal: React.FC<AddFundsModalProps> = ({ onClose, refetch }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [errors, setErrors] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });
  const [cardholderName, setCardholderName] = useState("");
  const processingFee: number = 0.99;
  const totalAmount = parseFloat(amount || "0") + processingFee;

  const [stripePayment] = useStripePaymentMutation();
  const [updateWalletBalance] = useUpdateWalletBalanceMutation();

  const userId = useSelector((state: RootState) => state.auth.userId);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardNumber = elements.getElement(CardNumberElement);
    const cardExpiry = elements.getElement(CardExpiryElement);
    const cardCvc = elements.getElement(CardCvcElement);

    if (!cardNumber || !cardExpiry || !cardCvc) return;

    try {
      // Step 1: Request PaymentIntent from the server with total amount
      const response = await stripePayment({
        amount: totalAmount,
        userId: Number(userId),
      }).unwrap();

      const { clientSecret } = await response;

      // Step 2: Confirm the PaymentIntent
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardNumber,
            billing_details: {
              name: cardholderName,
            },
          },
        }
      );

      if (error) {
        setErrors((prev) => ({
          ...prev,
          cardNumber: error.message || "An error occurred",
        }));
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("Payment successful!", paymentIntent);
        await updateWalletBalance({
          userId: Number(userId),
          amount: Number(amount),
        }).unwrap();
        refetch();

        notification.success({
          message: "Sucessfully add funds!!!",
        });

        onClose();
      }
    } catch (err) {
      console.error("Payment failed:", err);
      setErrors((prev) => ({
        ...prev,
        cardNumber: "An error occurred while processing your payment.",
      }));
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column - Payment Method Selection */}
          <div className="border-r pr-8">
            <h2 className="text-xl font-bold mb-6">Add Funds to Wallet</h2>

            <div className="space-y-6">
              {/* Card Payment Option */}
              <div>
                <label className="flex items-center space-x-3 mb-4">
                  <input
                    type="radio"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="font-medium">Debit or credit card</span>
                  <span className="text-gray-500 text-sm ml-auto">
                    All major cards accepted
                  </span>
                </label>

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-1">Card number:</label>
                      <div className="p-3 border rounded-md focus-within:ring-2 focus-within:ring-blue-500">
                        <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
                      </div>
                      {errors.cardNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.cardNumber}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1">
                          Expiry date:
                        </label>
                        <div className="p-3 border rounded-md focus-within:ring-2 focus-within:ring-blue-500">
                          <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
                        </div>
                        {errors.cardExpiry && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.cardExpiry}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm mb-1">
                          CVC/CVV:
                          <InfoCircleOutlined className="ml-1 text-gray-400" />
                        </label>
                        <div className="p-3 border rounded-md focus-within:ring-2 focus-within:ring-blue-500">
                          <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
                        </div>
                        {errors.cardCvc && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.cardCvc}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-1">
                        Cardholder name:
                      </label>
                      <input
                        type="text"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="Name as shown on card"
                      />
                    </div>

                    <div className="flex space-x-4">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Visa_2021.svg/1200px-Visa_2021.svg.png"
                        alt="Visa"
                        className="h-5"
                      />
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                        alt="Mastercard"
                        className="h-5"
                      />
                      <img
                        src="https://static-00.iconduck.com/assets.00/jcb-icon-2048x1537-sqmx1xp9.png"
                        alt="JCB"
                        className="h-5"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* PayPal Option */}
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={paymentMethod === "paypal"}
                    onChange={() => setPaymentMethod("paypal")}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="font-medium">PayPal</span>
                  <img
                    src="https://cdn.pixabay.com/photo/2015/05/26/09/37/paypal-784404_1280.png"
                    alt="PayPal"
                    className="h-8 ml-auto"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Amount Selection */}
          <div>
            <h2 className="text-xl font-bold mb-6">
              Select amount
              <span className="text-gray-500 text-base float-right">(USD)</span>
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm mb-2">Currency</label>
                <div className="relative">
                  <select className="w-full p-2 border rounded-md appearance-none bg-white">
                    <option value="USD">🇺🇸 US Dollar</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-2">$</span>
                  <input
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    className="w-full p-2 pl-8 border rounded-md text-right"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total due</span>
                  <span>${parseFloat(amount || "0").toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    Processing fee
                    <InfoCircleOutlined className="ml-1 text-gray-400" />
                  </span>
                  <span>${processingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Payment due</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Confirm and pay ${totalAmount.toFixed(2)} USD
              </button>

              <p className="text-sm text-gray-600">
                You agree to authorize the use of your card for this deposit and
                future payments, and agree to be bound to the{" "}
                <a href="#" className="text-blue-500">
                  Terms & Conditions
                </a>
                .
              </p>

              <div className="flex justify-between items-center mt-4 space-x-4">
                <img
                  src="https://www.f-cdn.com/assets/main/en/assets/payments/secure/ssl-secure.png"
                  alt="Secure"
                  className="h-6"
                />
                <img
                  src="https://www.f-cdn.com/assets/main/en/assets/payments/secure/pci-dss.png"
                  alt="PCI DSS"
                  className="h-6"
                />
                <img
                  src="https://www.f-cdn.com/assets/main/en/assets/payments/secure/mastercard-securecode.svg"
                  alt="Mastercard SecureCode"
                  className="h-6"
                />
                <img
                  src="https://www.f-cdn.com/assets/main/en/assets/payments/secure/visa-secure-blu.svg"
                  alt="Verified by Visa"
                  className="h-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFundsModal;
